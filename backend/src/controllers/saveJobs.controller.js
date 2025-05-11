const { resSuccess, resError } = require("../libs/response");
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
      return resSuccess(
        res,
        "Lưu bài đăng công việc vào danh sách thành công",
        result
      );
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(
        res,
        "Xóa bài đăng công việc khỏi danh sách thành công"
      );
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy ra danh sách jobs đã lưu
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Danh sách jobs
   */
  async getJobs(req, res) {
    try {
      const { id } = req.user;
      const result = await saveJobsService.getJobs(req.query, id);
      return resSuccess(res, null, result);
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new SaveJobsController();
