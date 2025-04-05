const { default: slugify } = require("slugify");
const db = require("../models");
const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");
const { redisClient } = require("../config/redis.config");

/**
 * Service xử lý login nghiệp vụ liên quan đến bài đăng công việc
 */
class JobsService {
  /**
   * Tạo mới bài đăng công việc
   * @param {Object} jobData - Dữ liệu bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được tạo
   */
  async createJob(jobData, employerId, userId) {
    const transaction = await db.sequelize.transaction();
    try {
      const jobSlug = slugify(jobData.jobName, { lower: true });

      // Kiểm tra xem bài đăng công việc đã tồn tại chưa
      const job = await this.findJobBySlug(jobSlug, employerId);

      if (job) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Bài đăng công việc đã tồn tại."
        );
      }

      // Tạo mới bài đăng công việc
      const newJob = await db.Jobs.create(
        {
          jobName: jobData.jobName,
          jobSlug,
          description: jobData.description,
          categoryId: jobData.categoryId,
          jobTypeId: jobData.jobTypeId,
          salaryId: jobData.salaryId,
          experienceId: jobData.experienceId,
          employerId: employerId,
          userId: userId,
          numberOfRecruits: jobData.numberOfRecruits,
          rankId: jobData.rankId,
          address: jobData.address,
          expire: jobData.expire,
        },
        { transaction }
      );

      // Tạo skill job trong bảng skilljobs
      await db.JobSkills.bulkCreate(
        jobData.skillIds.map((skillId) => ({
          skillId,
          jobId: newJob.id,
        })),
        { transaction }
      );

      // Xóa cache cũ
      const keys = await redisClient.keys("jobs:*");
      if (keys.length > 0) {
        await redisClient.del(keys);
      }

      await transaction.commit();
      return newJob;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Thanh toán bài đăng công việc
   * @param {string} jobId - ID của bài đăng công việc
   * @param {string} userId - ID của người dùng
   * @returns {Promise<Object>} Bài đăng công việc được thanh toán
   */
  async payJob(jobId, amount, userId) {
    const transaction = await db.sequelize.transaction();
    try {
      // Kiểm tra bài đăng công việc
      const job = await this.getJobById(jobId, { transaction });
      if (!job) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Bài đăng công việc không tồn tại"
        );
      }

      if (job.employerId !== userId) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Bạn không có quyền thanh toán bài đăng công việc này"
        );
      }

      // Lấy thông tin employer (bao gồm wallet_balance)
      const employer = await db.Employers.findOne({
        where: { id: userId },
        transaction,
      });

      if (!employer) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Nhà tuyển dụng không tồn tại"
        );
      }

      // Kiểm tra số dư ví
      const amountFloat = parseFloat(amount);
      const walletBalance = parseFloat(employer.wallet_balance);
      if (walletBalance < amountFloat) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Số dư không đủ để thanh toán bài đăng công việc"
        );
      }

      // Tạo payment
      const payment = await db.Payments.create(
        {
          amount: amountFloat,
          balanceBefore: walletBalance,
          balanceAfter: walletBalance - amountFloat,
          isDeposit: false,
          currency: "VND",
          paymentDate: new Date(),
          jobId,
          userId,
          userId,
        },
        { transaction }
      );
      console.log(`Created payment ${payment.id} for job ${jobId}`);

      // Cập nhật số dư ví của employer
      const newBalance = walletBalance - amountFloat;
      await db.Employers.update(
        { wallet_balance: newBalance },
        { where: { id: userId }, transaction }
      );
      console.log(
        `Updated employer ${userId} wallet balance to: ${newBalance}`
      );

      // Cập nhật job is visible thành true
      await db.Jobs.update(
        { isVisible: true, price: amountFloat },
        { where: { id: jobId }, transaction }
      );

      // Lấy danh sách admin để tạo notification
      const admins = await this.getAdminList({ transaction });

      // Gửi thông báo đến admin
      const notifications = admins.map((admin) => ({
        userId: admin.id,
        message: `Bài đăng công việc ${job.jobName} đã được thanh tạo và thanh toán.`,
        type: "job",
      }));

      await db.Notifications.bulkCreate(notifications, { transaction });
      console.log(`Created ${notifications.length} notifications for admins`);

      await transaction.commit();
      return payment;
    } catch (error) {
      await transaction.rollback();
      console.error("Error in payJob:", error);
      throw error;
    }
  }

  /**
   * Lấy ra danh sách bài đăng công việc
   * @param {Object} query - Dữ liệu tìm kiềm, phân trang, sắp xếp
   * @returns {Promise<Object>} Danh sách bài đăng công việc
   */
  async getJobs(query) {
    const { page = 1, limit = 10, ...queryParams } = query;
    const cacheKey = `jobs:${JSON.stringify(query)}`;

    // Kiểm tra cache trước khi truy vấn DB
    const cachedJobs = await redisClient.get(cacheKey);

    if (cachedJobs) {
      return JSON.parse(cachedJobs);
    }

    // Nếu không có cache, thực hiện truy vấn DB
    const offset = (page - 1) * limit;

    const whereClause = {};

    if (queryParams.jobName) {
      whereClause.jobName = {
        [Op.like]: `%${queryParams.jobName}%`,
      };
    }

    if (queryParams.categoryId) {
      whereClause.categoryId = queryParams.categoryId;
    }

    if (queryParams.jobTypeId) {
      whereClause.jobTypeId = queryParams.jobTypeId;
    }

    if (queryParams.salaryId) {
      whereClause.salaryId = queryParams.salaryId;
    }

    if (queryParams.experienceId) {
      whereClause.experienceId = queryParams.experienceId;
    }

    if (queryParams.employerId) {
      whereClause.employerId = queryParams.employerId;
    }

    if (queryParams.address) {
      whereClause.address = {
        [Op.like]: `%${queryParams.address}%`,
      };
    }

    if (queryParams.rank) {
      whereClause.rank = queryParams.rank;
    }

    const jobs = await db.Jobs.findAndCountAll({
      where: {
        ...whereClause,
        status: "Đã kiểm duyệt",
        isVisible: true,
        deleted: false,
      },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.Employers,
          as: "Employers",
          attributes: ["companyName", "companySlug", "companyLogo"],
        },
      ],
    });

    const result = {
      jobs: jobs.rows,
      total: jobs.count,
      totalPages: Math.ceil(jobs.count / limit),
      currentPage: parseInt(page),
      limit: parseInt(limit),
    };

    // Lưu vào redis với TTL = 600s (10 phút)
    await redisClient.set(cacheKey, JSON.stringify(result), {
      EX: 600,
    });

    return result;
  }

  /**
   * Lấy ra chi tiết bài đăng theo slug
   * @param {string} slug - Slug của bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được tìm kiếm
   */
  async getJobBySlug(slug) {
    const job = await db.Jobs.findOne({
      where: {
        jobSlug: slug,
        status: "Đã kiểm duyệt",
        isVisible: true,
        deleted: false,
      },
      include: [
        {
          model: db.Employers,
          as: "employer",
        },
        {
          model: db.Categories,
          as: "category",
        },
        {
          model: db.JobTypes,
          as: "jobType",
        },
        {
          model: db.Salaries,
          as: "salary",
        },
        {
          model: db.Experiences,
          as: "experience",
        },
      ],
    });

    if (!job) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "Bài đăng công việc không tồn tại."
      );
    }

    return job;
  }

  /**
   * Cập nhật bài đăng công việc
   * @param {string} id - ID của bài đăng công việc
   * @param {Object} jobData - Dữ liệu cập nhật bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được cập nhật
   */
  async updateJob(id, jobData) {
    const job = await this.getJobById(id);

    if (!job) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "Bài đăng công việc không tồn tại."
      );
    }

    // Kiểm tra xem bài đăng công việc đã tồn tại chưa
    const jobSlug = slugify(jobData.jobTitle, { lower: true });
    const existingJob = await this.findJobBySlug(jobSlug, job.employerId);

    if (existingJob) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Bài đăng công việc đã tồn tại."
      );
    }

    // Cập nhật bài đăng công việc
    await job.update({
      jobName: jobData.jobTitle,
      jobSlug,
      description: jobData.description,
      categoryId: jobData.categoryId,
      jobTypeId: jobData.jobTypeId,
      salaryId: jobData.salaryId,
      experienceId: jobData.experienceId,
      numberOfRecruits: jobData.numberOfRecruits,
      rank: jobData.rank,
      address: jobData.address,
    });

    // Xóa cache cũ
    const keys = await redisClient.keys("jobs:*"); // Lấy tất cả cache liên quan đến jobs
    await redisClient.del(keys);

    return job;
  }

  /**
   * Xóa bài đăng công việc
   * @param {string} id - ID của bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được xóa
   */
  async deleteJob(id) {
    const job = await this.getJobById(id);

    if (!job) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "Bài đăng công việc không tồn tại."
      );
    }

    job.deleted = true;
    await job.save();

    // Xóa cache cũ
    const keys = await redisClient.keys("jobs:*"); // Lấy tất cả cache liên quan đến jobs
    await redisClient.del(keys);

    return job;
  }

  /**
   * Kiểm duyệt bài đăng công việc
   * @param {string} id - ID của bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được kiểm duyệt
   */
  async verifyJob(id, status) {
    const transaction = await db.sequelize.transaction();
    try {
      // Kiểm tra bài đăng công việc
      const job = await this.getJobById(id, { transaction });
      if (!job) {
        throw new ApiError(
          StatusCode.NOT_FOUND,
          "Bài đăng công việc không tồn tại."
        );
      }

      // Cập nhật trạng thái bài đăng
      if (status === "Đã kiểm duyệt") {
        job.status = "Đã kiểm duyệt";
      } else {
        job.status = "Không kiểm duyệt";
        job.isVisible = false;

        // Hoàn tiền cho nhà tuyển dụng
        const employer = await db.Employers.findOne({
          where: { id: job.employerId },
          transaction,
        });

        if (!employer) {
          throw new ApiError(
            StatusCode.NOT_FOUND,
            `Nhà tuyển dụng với id ${job.employerId} không tồn tại`
          );
        }

        // Kiểm tra job.price
        const refundAmount = parseFloat(job.price);
        if (isNaN(refundAmount) || refundAmount <= 0) {
          throw new ApiError(
            StatusCode.BAD_REQUEST,
            "Giá bài đăng không hợp lệ để hoàn tiền"
          );
        }

        // Cập nhật số dư ví của employer (dùng wallet_balance)
        const wallet = await db.Wallets.findOne({
          where: { userId: job.employerId },
          transaction,
        });
        const currentBalance = parseFloat(wallet.balance);
        const newBalance = currentBalance + refundAmount;
        await db.Wallets.update(
          { balance: newBalance },
          { where: { id: wallet.id }, transaction }
        );
        console.log(
          `Refunded ${refundAmount} to employer ${job.employerId}. New balance: ${newBalance}`
        );

        // Tạo bản ghi hoàn tiền trong bảng Payments
        await db.Payments.create(
          {
            id: DataTypes.UUIDV4(),
            employerId: job.employerId,
            userId: job.employerId,
            amount: refundAmount,
            balanceBefore: currentBalance,
            balanceAfter: newBalance,
            transactionType: "Hoàn tiền",
            note: `Hoàn tiền cho bài đăng công việc ${job.jobName} không được kiểm duyệt`,
            currency: "VND",
            paymentDate: new Date(),
            jobId: job.id,
          },
          { transaction }
        );
        console.log(`Created refund payment for job ${job.id}`);
      }

      // Lưu thay đổi trạng thái bài đăng
      await job.save({ transaction });
      console.log(`Updated job ${job.id} status to: ${job.status}`);

      // Tạo thông báo cho nhà tuyển dụng
      await db.Notifications.create(
        {
          userId: job.employerId,
          message: `Bài đăng công việc ${job.jobName} đã được ${status}.`,
          type: "job",
          isRead: false,
        },
        { transaction }
      );
      console.log(`Created notification for employer ${job.employerId}`);

      // Xóa cache liên quan đến bài đăng cụ thể
      const cacheKeys = [
        `jobs:${job.id}`, // Cache của bài đăng cụ thể
        `jobs:employer:${job.employerId}`, // Cache danh sách bài đăng của nhà tuyển dụng
        "jobs:visible", // Cache danh sách bài đăng hiển thị
      ];
      await redisClient.del(cacheKeys);
      console.log(`Cleared cache for keys: ${cacheKeys.join(", ")}`);

      await transaction.commit();
      return job;
    } catch (error) {
      await transaction.rollback();
      console.error("Error in verifyJob:", error);
      throw error;
    }
  }

  /**
   * Hàm tìm kiếm bài đăng công việc theo slug và id công ty
   * @param {string} slug - Slug của bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được tìm kiếm
   */
  async findJobBySlug(slug, employerId) {
    return await db.Jobs.findOne({
      where: { jobSlug: slug, employerId, deleted: false },
    });
  }

  /**
   * Hàm tìm kiếm bài đăng công việc theo id
   * @param {string} id - ID của bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được tìm kiếm
   */
  async findJobById(id) {
    return await db.Jobs.findByPk(id, {
      where: { deleted: false },
    });
  }

  /**
   * Lấy danh sách admin để tạo notification
   * @returns {Promise<Object>} Danh sách admin
   */
  async getAdminList() {
    return await db.Users.findAll({
      where: {
        role: "admin",
      },
    });
  }
}

module.exports = new JobsService();
