const { StatusCode } = require("../libs/enum");
const { resSuccess, resError } = require("../libs/response");
const JoTypesService = require("../services/jobTypes.service");

/**
 * Controller xử lý logic liên quan đến hình thức làm việc
 */
class JobTypesController {
  /**
   * Tạo mới hình thức làm việc
   * @param {Object} req - Đối tượng request
   * @param {Object} res - Đối tượng response
   * @returns {Promise<Object>} Hình thức làm việc đã được tạo
   */
  async createJobType(req, res) {
    try {
      const { jobTypeName } = req.body;
      const jobType = await JoTypesService.createJobType(jobTypeName);
      return resSuccess(
        res,
        "Tạo mới hình thức làm việc thành công",
        jobType,
        StatusCode.CREATED
      );
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách hình thức làm việc
   * @param {Object} req - Đối tượng request
   * @param {Object} res - Đối tượng response
   * @returns {Promise<Object>} Danh sách hình thức làm việc
   */
  async getJobTypes(req, res) {
    try {
      const { page, limit } = req.query;
      const jobTypes = await JoTypesService.getJobTypes(page, limit);
      return resSuccess(res, null, jobTypes);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Cập nhật hình thức làm việc
   * @param {Object} req - Đối tượng request
   * @param {Object} res - Đối tượng response
   * @returns {Promise<Object>} Hình thức làm việc đã được cập nhật
   */
  async updateJobType(req, res) {
    try {
      const { jobTypeName } = req.body;
      const { id } = req.params;
      const jobType = await JoTypesService.updateJobType(jobTypeName, id);
      return resSuccess(res, "Cập nhật hình thức làm việc thành công", jobType);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Xóa hình thức làm việc
   * @param {Object} req - Đối tượng request
   * @param {Object} res - Đối tượng response
   * @returns {Promise<Object>} Hình thức làm việc đã được xóa
   */
  async deleteJobType(req, res) {
    try {
      const { id } = req.params;
      const jobType = await JoTypesService.deleteJobType(id);
      return resSuccess(res, "Xóa hình thức làm việc thành công");
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new JobTypesController();
