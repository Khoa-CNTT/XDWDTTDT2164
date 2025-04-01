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
  async createJob(jobData) {
    const transaction = await db.sequelize.transaction();
    try {
      const jobSlug = slugify(jobData.jobTitle, { lower: true });

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
          jobName: jobData.jobTitle,
          jobSlug,
          description: jobData.description,
          categoryId: jobData.categoryId,
          jobTypeId: jobData.jobTypeId,
          salaryId: jobData.salaryId,
          experienceId: jobData.experienceId,
          employerId: jobData.employerId,
          numberOfRecruits: jobData.numberOfRecruits,
          rank: jobData.rank,
          address: jobData.address,
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

      // Lấy danh sách admin để tạo notification
      const admins = await this.getAdminList();

      // Gửi thông báo đến admin
      const notifications = admins.map((admin) => ({
        userId: admin.id,
        message: `Bài đăng công việc ${newJob.jobName} đã được tạo.`,
        type: "job",
        isRead: false,
      }));

      await db.Notifications.bulkCreate(notifications, { transaction });

      await transaction.commit();
      return newJob;
    } catch (error) {
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
      where: { ...whereClause, status: "Đã kiểm duyệt", deleted: false },
      offset,
      limit,
      order: [["createdAt", "DESC"]],
      include: [
        {
          model: db.Employers,
          as: "employer",
          attributes: ["employerName", "employerSlug", "logo"],
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
      where: { jobSlug: slug, status: "Đã kiểm duyệt", deleted: false },
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
    const job = await this.getJobById(id);

    if (!job) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "Bài đăng công việc không tồn tại."
      );
    }

    if (status === "Đã kiểm duyệt") {
      job.status = "Đã kiểm duyệt";
    } else {
      job.status = "Không kiểm duyệt";
    }

    await job.save();

    // Xóa cache cũ
    const keys = await redisClient.keys("jobs:*"); // Lấy tất cả cache liên quan đến jobs
    await redisClient.del(keys);

    // Tạo notification cho công ty
    await db.Notifications.create({
      userId: job.employerId,
      message: `Bài đăng công việc ${job.jobName} đã được ${status}.`,
      type: "job",
      isRead: false,
    });

    return job;
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
