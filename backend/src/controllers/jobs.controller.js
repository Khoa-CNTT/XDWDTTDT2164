const { StatusCode, ResponseStatus } = require("../libs/enum");
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
      const job = await jobsService.createJob(req.body);
      return res.status(StatusCode.CREATED).json({
        statusCode: StatusCode.CREATED,
        status: ResponseStatus.SUCCESS,
        message: "Tạo bài đăng công việc thành công",
        data: job,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Lấy danh sách bài đăng công việc thành công",
        data: jobs,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Lấy chi tiết bài đăng công việc thành công",
        data: job,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Cập nhật bài đăng công việc thành công",
        data: job,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
        status: ResponseStatus.ERROR,
        message: error.message || "Lỗi hệ thống",
      });
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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Xóa bài đăng công việc thành công",
        data: job,
      });
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
      const job = await jobsService.verifyJob(req.params.id, req.body.status);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Kiểm duyệt bài đăng công việc thành công",
        data: job,
      });
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
