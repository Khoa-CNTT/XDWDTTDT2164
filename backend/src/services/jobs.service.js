const { default: slugify } = require("slugify");
const db = require("../models");
const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");
const { redisClient } = require("../config/redis.config");
const { moderateJob } = require("../libs/geminiClient");
const { fn, col, literal, Op } = require("sequelize");
const { parse } = require("dotenv");
const { sendMailToEmployer } = require("../libs/sendMail");
const { parseGeminiResultMatch } = require("../libs/helper");

/**
 * Service xử lý login nghiệp vụ liên quan đến bài đăng công việc
 */
class JobsService {
  /**
   * Tạo mới bài đăng công việc
   * @param {Object} jobData - Dữ liệu bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được tạo
   */
  async createJob(jobData, userId) {
    const transaction = await db.sequelize.transaction();
    try {
      const jobSlug = slugify(jobData.jobName, { lower: true });

      // Kiểm tra xem bài đăng công việc đã tồn tại chưa
      const job = await this.findJobBySlug(jobSlug, jobData.employerId);

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
          candidateRequirements: jobData.candidateRequirements,
          benefit: jobData.benefit,
          workTime: jobData.workTime,
          categoryId: jobData.categoryId,
          jobTypeId: jobData.jobTypeId,
          salaryId: jobData.salaryId,
          experienceId: jobData.experienceId,
          employerId: jobData.employerId,
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
      const job = await this.findJobById(jobId, { transaction });
      if (!job) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Bài đăng công việc không tồn tại"
        );
      }

      // Kiểm tra nhà tuyển dụng
      const employer = await db.Employers.findOne({
        where: { id: job.employerId },
        transaction,
      });
      if (!employer) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Nhà tuyển dụng không tồn tại"
        );
      }

      // Kiểm tra ví
      const wallet = await db.Wallets.findOne({
        where: { userId },
      });
      if (!wallet) {
        throw new ApiError(
          StatusCode.NOT_FOUND,
          "Bạn hãy nạp tiền vào tài khoản."
        );
      }
      const amountFloat = parseFloat(amount);
      const walletBalance = parseFloat(wallet.balance);
      console.log("Wallet found", { userId, walletBalance, amountFloat });

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
          transactionType: "Thanh toán",
          status: "Thành công",
        },
        { transaction }
      );

      // Cập nhật số dư ví
      const newBalance = walletBalance - amountFloat;
      await db.Wallets.update(
        { balance: newBalance },
        { where: { userId }, transaction }
      );

      // Cập nhật job isVisible
      await db.Jobs.update(
        { isVisible: true },
        { where: { id: jobId }, transaction }
      );

      // Kiểm duyệt với Gemini
      const moderationResult = await moderateJob(job);
      const result = parseGeminiResultMatch(moderationResult);
      console.log("Moderation result", result);

      if (result.result === "Không duyệt") {
        // Gửi thông báo đến admin
        const admins = await this.getAdminList({ transaction });
        const notifications = admins.map((admin) => ({
          userId: admin.id,
          message: `Bài đăng "${job.jobName}" đã bị AI từ chối kiểm duyệt. Vui lòng kiểm tra lại.`,
          type: "moderation",
        }));
        await db.Notifications.bulkCreate(notifications, { transaction });
      } else {
        await db.Jobs.update(
          { isApproved: "Đã được duyệt" },
          { where: { id: jobId }, transaction }
        );
      }

      await transaction.commit();
      return payment;
    } catch (error) {
      console.error("Error in payJob:", error.message, error.stack);
      await transaction.rollback();
      throw error;
    }
  }

  /**
   * Lấy ra danh sách bài đăng công việc
   * @param {Object} query - Dữ liệu tìm kiềm, phân trang, sắp xếp
   * @returns {Promise<Object>} Danh sách bài đăng công việc
   */
  async getJobs(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const { ...queryParams } = query;
    const cacheKey = `jobs:${JSON.stringify({ ...queryParams, page, limit })}`;

    // Kiểm tra cache trước khi truy vấn DB
    const cachedJobs = await redisClient.get(cacheKey);

    if (cachedJobs) {
      return JSON.parse(cachedJobs);
    }

    const offset = (page - 1) * limit;

    const whereClause = {};

    if (queryParams.search) {
      whereClause.jobName = {
        [Op.like]: `%${queryParams.search}%`,
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
        isApproved: "Đã được duyệt",
        isExpired: false,
        isVisible: true,
        deletedAt: null,
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
        {
          model: db.Ranks,
          as: "Ranks",
        },
        {
          model: db.Salaries,
          as: "Salaries",
        },
        {
          model: db.JobTypes,
          as: "JobTypes",
        },
      ],
    });

    const result = {
      jobs: jobs.rows,
      total: jobs.count,
      totalPages: Math.ceil(jobs.count / limit),
      currentPage: page,
      limit,
    };

    await redisClient.set(cacheKey, JSON.stringify(result), {
      EX: 600,
    });

    return result;
  }

  /**
   * Lấy ra danh sách bài đăng công việc cho admin
   * @param {Object} query - Dữ liệu phân trang
   * @returns {Promise<Object>} Danh sách bài đăng công việc
   */
  async getJobForAdmin(query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count: totalJobs, rows: jobs } = await db.Jobs.findAndCountAll({
      where: {
        isVisible: true,
        deletedAt: null,
      },
      include: [
        {
          model: db.Users,
          as: "Users",
        },
        {
          model: db.Employers,
          as: "Employers",
        },
      ],
      limit,
      offset,
    });

    return {
      page,
      limit,
      totalJobs,
      jobs,
    };
  }

  /**
   * Lấy ra danh sách bài đăng công việc theo công ty
   * @param {Object} query - Dữ liệu query
   * @returns {Promise<Object>} Danh sách bài đăng công việc
   */
  async getJobsForEmployer(employerId, query) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 8;
    const offset = (page - 1) * limit;

    const { count: totalJobs, rows: jobs } = await db.Jobs.findAndCountAll({
      where: {
        employerId,
        deletedAt: null,
      },
      include: [
        {
          model: db.Employers,
          as: "Employers",
        },
        {
          model: db.Users,
          as: "Users",
        },
        {
          model: db.Ranks,
          as: "Ranks",
        },
      ],
      limit,
      offset,
    });
    return {
      page,
      limit,
      totalJobs,
      jobs,
    };
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
        isApproved: "Đã được duyệt",
        isVisible: true,
        deletedAt: null,
      },
      include: [
        {
          model: db.Employers,
          as: "Employers",
        },
        {
          model: db.Categories,
          as: "Categories",
        },
        {
          model: db.JobTypes,
          as: "JobTypes",
        },
        {
          model: db.Salaries,
          as: "Salaries",
        },
        {
          model: db.Experiences,
          as: "Experiences",
        },
        {
          model: db.Ranks,
          as: "Ranks",
        },
      ],
    });

    if (!job) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "Bài đăng công việc không tồn tại."
      );
    }

    const jobsRelateds = await db.Jobs.findAll({
      where: {
        jobSlug: { [db.Sequelize.Op.ne]: slug },
        isApproved: "Đã được duyệt",
        isVisible: true,
        deletedAt: null,
        categoryId: job.categoryId,
      },
      include: [
        {
          model: db.Employers,
          as: "Employers",
        },
        {
          model: db.JobTypes,
          as: "JobTypes",
        },
        {
          model: db.Salaries,
          as: "Salaries",
        },
        {
          model: db.Ranks,
          as: "Ranks",
        },
      ],
    });

    return { job, jobsRelateds };
  }

  /**
   * Lấy ra chi tiết bài đăng cho nhà tuyển dụng
   * @param {string} id - Id của bài viết
   * @returns {Promise<Object>} Bài đăng chi tiết công việc
   */
  async getJobDetailForEmployer(id) {
    const job = await db.Jobs.findOne({
      where: { id, deletedAt: null },
      include: [
        {
          model: db.Categories,
          as: "Categories",
        },
        {
          model: db.JobSkills,
          as: "JobSkills",
          include: [
            {
              model: db.Skills,
              as: "Skills",
            },
          ],
        },
        {
          model: db.JobTypes,
          as: "JobTypes",
        },
        {
          model: db.Experiences,
          as: "Experiences",
        },
        {
          model: db.Ranks,
          as: "Ranks",
        },
        {
          model: db.Salaries,
          as: "Salaries",
        },
        {
          model: db.Employers,
          as: "Employers",
        },
      ],
      attributes: [
        "address",
        "expire",
        "jobName",
        "numberOfRecruits",
        "description",
        "candidateRequirements",
        "benefit",
        "workTime",
        "isApproved",
      ],
    });

    return job;
  }

  /**
   * Lấy danh sách bài đăng theo thời gian
   * @param {Object} params
   * @param {string} params.period - Khoảng thời gian (day, month, year, weekday)
   * @param {string} [params.startDate] - Ngày bắt đầu (YYYY-MM-DD)
   * @param {string} [params.endDate] - Ngày kết thúc (YYYY-MM-DD)
   * @returns {Promise<Array>} Danh sách bài đăng với thời gian và số lượng
   */
  async getJobsForTime({ period = "month", startDate, endDate }) {
    try {
      const db = require("../models"); // Giả sử bạn có file models

      const formatByPeriod = {
        day: "%Y-%m-%d",
        month: "%Y-%m",
        year: "%Y",
        weekday: "%W", // Monday, Tuesday, ...
      };

      const format = formatByPeriod[period];
      if (!format) {
        throw new Error("Invalid period. Use day, month, year, or weekday");
      }

      const where = {};
      if (startDate) {
        where.createdAt = { [Op.gte]: new Date(startDate) };
      }
      if (endDate) {
        where.createdAt = where.createdAt || {};
        where.createdAt[Op.lte] = new Date(endDate);
      }

      const data = await db.Jobs.findAll({
        where,
        attributes: [
          [fn("DATE_FORMAT", col("created_at"), format), "period"],
          [fn("MAX", fn("DATE_FORMAT", col("created_at"), "%W")), "weekday"], // Sử dụng MAX
          [fn("MAX", fn("DATE_FORMAT", col("created_at"), "%d")), "day"], // Sử dụng MAX
          [fn("MAX", fn("DATE_FORMAT", col("created_at"), "%m")), "month"], // Sử dụng MAX
          [fn("MAX", fn("DATE_FORMAT", col("created_at"), "%Y")), "year"], // Sử dụng MAX
          [fn("COUNT", col("id")), "count"],
        ],
        group: [literal(`DATE_FORMAT(created_at, '${format}')`)],
        order: [[literal(`DATE_FORMAT(created_at, '${format}')`), "ASC"]],
        raw: true,
      });

      const weekdayMap = {
        Monday: "Thứ Hai",
        Tuesday: "Thứ Ba",
        Wednesday: "Thứ Tư",
        Thursday: "Thứ Năm",
        Friday: "Thứ Sáu",
        Saturday: "Thứ Bảy",
        Sunday: "Chủ Nhật",
      };

      return data.map(({ period, weekday, day, month, year, count }) => ({
        period,
        display:
          period === weekday
            ? weekdayMap[weekday]
            : `${weekdayMap[weekday]}, ${day}/${month}/${year}`,
        count: Number(count),
      }));
    } catch (error) {
      throw new Error(`Error fetching job counts: ${error.message}`);
    }
  }

  /**
   * Cập nhật bài đăng công việc
   * @param {string} id - ID của bài đăng công việc
   * @param {Object} jobData - Dữ liệu cập nhật bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được cập nhật
   */
  async updateJob(id, jobData) {
    const transaction = await db.sequelize.transaction();
    try {
      const job = await this.findJobById(id);

      if (!job) {
        throw new ApiError(
          StatusCode.NOT_FOUND,
          "Bài đăng công việc không tồn tại."
        );
      }

      const jobSlug = slugify(jobData.jobName, { lower: true });
      const existingJob = await this.findJobBySlug(jobSlug, job.employerId);

      if (existingJob && existingJob.id !== job.id) {
        throw new ApiError(
          StatusCode.BAD_REQUEST,
          "Bài đăng công việc đã tồn tại."
        );
      }

      // Cập nhật thông tin job
      await job.update(
        {
          jobName: jobData.jobName,
          jobSlug,
          description: jobData.description,
          candidateRequirements: jobData.candidateRequirements,
          benefit: jobData.benefit,
          workTime: jobData.workTime,
          categoryId: jobData.categoryId,
          jobTypeId: jobData.jobTypeId,
          salaryId: jobData.salaryId,
          experienceId: jobData.experienceId,
          numberOfRecruits: jobData.numberOfRecruits,
          rank: jobData.rank,
          address: jobData.address,
          isApproved: "Chờ kiểm duyệt",
        },
        { transaction }
      );

      // Kiểm duyệt với Gemini
      const moderationResult = await moderateJob(job);
      const result = parseGeminiResultMatch(moderationResult);
      console.log("Moderation result", result);

      if (result.result === "Không duyệt") {
        // Gửi thông báo đến admin
        const admins = await this.getAdminList({ transaction });
        const notifications = admins.map((admin) => ({
          userId: admin.id,
          message: `Bài đăng "${job.jobName}" đã bị AI từ chối kiểm duyệt. Vui lòng kiểm tra lại.`,
          type: "moderation",
        }));
        await db.Notifications.bulkCreate(notifications, { transaction });
      } else {
        await db.Jobs.update(
          { isApproved: "Đã được duyệt" },
          { where: { id: id }, transaction }
        );
      }

      // Commit transaction sau khi xong mọi việc
      await transaction.commit();

      // Xóa cache
      const keys = await redisClient.keys("jobs:*");
      if (keys.length > 0) await redisClient.del(keys);

      return job;
    } catch (error) {
      await transaction.rollback();
      console.log(error);
      throw error;
    }
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

    job.deletedAt = new Date();
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
  async createNotification(userId, message, transaction) {
    return db.Notifications.create(
      {
        userId,
        message,
        type: "job",
        isRead: false,
      },
      { transaction }
    );
  }

  async handleRefund(job, transaction) {
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

    const payment = await db.Payments.findOne({
      where: {
        jobId: job.id,
        transactionType: "Thanh toán",
      },
      transaction,
    });
    if (!payment) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Không tìm thấy giao dịch thanh toán để hoàn tiền"
      );
    }

    const refundAmount = parseFloat(payment.amount);
    if (isNaN(refundAmount) || refundAmount <= 0) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Số tiền thanh toán không hợp lệ để hoàn tiền"
      );
    }

    const wallet = await db.Wallets.findOne({
      where: { userId: payment.userId },
      transaction,
    });

    const currentBalance = parseFloat(wallet.balance);
    const newBalance = currentBalance + refundAmount;

    await db.Wallets.update(
      { balance: newBalance },
      { where: { id: wallet.id }, transaction }
    );

    await db.Payments.create(
      {
        employerId: job.employerId,
        userId: payment.userId,
        amount: refundAmount,
        balanceBefore: currentBalance,
        balanceAfter: newBalance,
        transactionType: "Hoàn tiền",
        note: `Hoàn tiền cho bài đăng công việc ${job.jobName} không được kiểm duyệt`,
        currency: "VND",
        paymentDate: new Date(),
        jobId: job.id,
        status: "Thành công",
      },
      { transaction }
    );

    console.log(
      `Refunded ${refundAmount} to employer ${job.employerId}. New balance: ${newBalance}`
    );
  }

  async verifyJob(id, data) {
    const transaction = await db.sequelize.transaction();
    try {
      const job = await this.findJobById(id);
      if (!job) {
        throw new ApiError(
          StatusCode.NOT_FOUND,
          "Bài đăng công việc không tồn tại."
        );
      }

      if (data.status === "Đã được duyệt") {
        job.isApproved = "Đã được duyệt";

        await this.createNotification(
          job.userId,
          `Bài đăng công việc "${job.jobName}" đã được duyệt.`,
          transaction
        );
      } else {
        job.isApproved = "Đã bị từ chối";
        job.rejectionReason = data.rejectionReason;
        job.rejectionCount = (job.rejectionCount || 0) + 1;

        await this.createNotification(
          job.userId,
          `Bài đăng công việc "${job.jobName}" đã bị từ chối. Lý do: ${job.rejectionReason}`,
          transaction
        );

        if (job.rejectionCount >= 3) {
          await this.handleRefund(job, transaction);

          // xóa ảo bài đăng
          job.deletedAt = new Date();
        }
      }

      await job.save({ transaction });

      const cacheKeys = [
        `jobs:${job.id}`,
        `jobs:employer:${job.employerId}`,
        "jobs:visible",
      ];
      await Promise.all(cacheKeys.map((key) => redisClient.del(key)));

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
   * Kiểm tra bìa đăng đã hết hạn
   * @param {Promise<void>}
   */
  async handleExpiredJobs() {
    const today = new Date();

    const expiredJobs = await db.Jobs.findAll({
      where: { expire: { [Op.lt]: today }, isExpired: false },
      include: [
        {
          model: db.Employers,
          as: "Employers",
          include: [
            {
              model: db.Users,
              as: "Users",
              attributes: ["email"],
            },
          ],
        },
      ],
    });

    for (const job of expiredJobs) {
      job.status = "Đã hết hạn";
      job.isExpired = true;

      await job.save();

      await sendMailToEmployer(job.Employers.Users.email, job);

      await redisClient.del([
        `jobs:${job.id}`,
        `jobs:employer:${job.employerId}`,
        "jobs:visible",
      ]);

      console.log(
        `[CRON] Đã kiểm tra và cập nhật ${expiredJobs.length} bài đăng hết hạn`
      );
    }
  }

  /**
   * Hàm tìm kiếm bài đăng công việc theo slug và id công ty
   * @param {string} slug - Slug của bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được tìm kiếm
   */
  async findJobBySlug(slug, employerId) {
    return await db.Jobs.findOne({
      where: { jobSlug: slug, employerId, deletedAt: null },
    });
  }

  /**
   * Hàm tìm kiếm bài đăng công việc theo id
   * @param {string} id - ID của bài đăng công việc
   * @returns {Promise<Object>} Bài đăng công việc được tìm kiếm
   */
  async findJobById(id) {
    return await db.Jobs.findByPk(id, {
      where: { deletedAt: null },
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
