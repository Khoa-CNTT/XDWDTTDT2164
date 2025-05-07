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
      const { employerId, id } = req.user;
      const job = await jobsService.createJob(req.body, employerId, id);
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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: result,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.StatusCode || StatusCode.SERVER_ERROR,
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
   * Lấy danh sách bài đăng công việc cho admin
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Danh sách bài đăng công việc
   */
  async getJobsForAdmin(req, res) {
    try {
      const data = await jobsService.getJobForAdmin(req.query);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data,
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
   * Lấy danh sách bài đăng công việc theo nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Danh sách bài đăng công việc
   */
  async getJobsForEmployer(req, res) {
    try {
      const { employerId } = req.user;
      console.log(req.query);
      const data = await jobsService.getJobsForEmployer(employerId, req.query);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data,
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
   * Lấy chi tiết bài đăng công việc cho nhà tuyển dụng
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Chi tiết bài đăng công việc
   */
  async getJobDetailForEmployer(req, res) {
    try {
      const { id } = req.params;
      const data = await jobsService.getJobDetailForEmployer(id);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data,
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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data,
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.StatusCode || StatusCode.SERVER_ERROR,
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
      const job = await jobsService.verifyJob(req.params.id, req.body);
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
