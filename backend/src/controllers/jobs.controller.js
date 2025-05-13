const { StatusCode, ResponseStatus } = require("../libs/enum");
const { resSuccess, resError } = require("../libs/response");
const jobsService = require("../services/jobs.service");

/**
 * Controller xử lý logic liên quan đến bài đăng công việc
 */
class JobsController {
  /**
   * Tạo mới bài đăng công việc
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Bài đăng công việc đã được tạo
   */
  async createJob(req, res) {
    try {
      const { id } = req.user;
      const job = await jobsService.createJob(req.body, id);
      return resSuccess(
        res,
        "Tạo bài đăng công việc thành công",
        job,
        StatusCode.CREATED
      );
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Thanh toán bài đăng công việc
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Trả về thông báo bài đăng đã thanh toán
   */
  async payJob(req, res) {
    try {
      const { id } = req.user;
      const { jobId, amount } = req.body;
      const result = await jobsService.payJob(jobId, amount, id);
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách bài đăng công việc
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Danh sách bài đăng công việc
   */
  async getJobs(req, res) {
    try {
      const jobs = await jobsService.getJobs(req.query);
      return resSuccess(
        res,
        "Lấy bài đăng danh sách công việc thành công",
        jobs
      );
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách bài đăng công việc cho admin
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Danh sách bài đăng công việc
   */
  async getJobsForAdmin(req, res) {
    try {
      const data = await jobsService.getJobForAdmin(req.query);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách bài đăng công việc theo nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Danh sách bài đăng công việc
   */
  async getJobsForEmployer(req, res) {
    try {
      const { employerId } = req.params;
      const data = await jobsService.getJobsForEmployer(employerId, req.query);

      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy chi tiết bài đăng công việc
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Chi tiết bài đăng công việc
   */
  async getJobBySlug(req, res) {
    try {
      const job = await jobsService.getJobBySlug(req.params.slug);
      return resSuccess(res, "Lấy chi tiết bài đăng công việc thành công", job);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy chi tiết bài đăng công việc cho nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Chi tiết bài đăng công việc
   */
  async getJobDetailForEmployer(req, res) {
    try {
      const { id } = req.params;
      const data = await jobsService.getJobDetailForEmployer(id);
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách bài đăng theo thời gian
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Danh sách bài đăng theo thời gian
   */
  async getJobsForTime(req, res) {
    try {
      const { period, startDate, endDate } = req.query;
      const data = await jobsService.getJobsForTime({
        period,
        startDate,
        endDate,
      });
      return resSuccess(res, null, data);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Cập nhật bài đăng công việc
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Bài đăng công việc đã được cập nhật
   */
  async updateJob(req, res) {
    try {
      const job = await jobsService.updateJob(req.params.id, req.body);
      return resSuccess(res, null, job);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Xóa bài đăng công việc
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Bài đăng công việc đã được xóa
   */
  async deleteJob(req, res) {
    try {
      const job = await jobsService.deleteJob(req.params.id);
      return resSuccess(res, "Xóa bài đăng công việc thành công", job);
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }

  /**
   * Kiểm duyệt bài đăng công việc
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Bài đăng công việc đã được kiểm duyệt
   */
  async verifyJob(req, res) {
    try {
      const job = await jobsService.verifyJob(req.params.id, req.body);
      return resSuccess(res, "Kiểm duyệt bài đăng công việc thành công", job);
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
    }
  }
}

module.exports = new JobsController();
