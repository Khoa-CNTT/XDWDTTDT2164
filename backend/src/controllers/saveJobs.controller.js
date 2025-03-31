const { ResponseStatus, StatusCode } = require("../libs/enum");
const saveJobsService = require("../services/saveJobs.service");

/**
 * Controller xử lý logic liên quan lưu job yêu thích
 */
class SaveJobsController {
  /**
   * Lưu một job vào danh sách yêu thích
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Job được lưu trong danh sách
   */
  async saveJob(req, res) {
    try {
      const { jobId } = req.body;
      const { id } = req.user;
      const result = await saveJobsService.saveJob(jobId, id);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Lưu job vào danh sách thành công",
        data: result,
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
   * Xóa một job trong danh sách
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Job được xóa khỏi danh sách
   */
  async delJob(req, res) {
    try {
      const { jobId } = req.params;
      const { id } = req.user;
      await saveJobsService.delJob(jobId, id);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Xóa job khỏi danh sách thành công",
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
   * Lấy ra danh sách jobs đã lưu
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Danh sách jobs
   */
  async getJobs() {
    try {
      const { id } = req.user;
      const result = await saveJobsService.getJobs(req.query, id);
      return res.status(ResponseStatus.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: result,
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

module.exports = new SaveJobsController();
