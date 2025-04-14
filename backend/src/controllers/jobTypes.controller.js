const { StatusCode, ResponseStatus } = require("../libs/enum");
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
      return res.status(StatusCode.CREATED).json({
        statusCode: StatusCode.CREATED,
        status: ResponseStatus.SUCCESS,
        message: "Tạo hình thức làm việc thành công",
        data: jobType,
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
   * Lấy danh sách hình thức làm việc
   * @param {Object} req - Đối tượng request
   * @param {Object} res - Đối tượng response
   * @returns {Promise<Object>} Danh sách hình thức làm việc
   */
  async getJobTypes(req, res) {
    try {
      const { page, limit } = req.query;
      const jobTypes = await JoTypesService.getJobTypes(page, limit);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: jobTypes,
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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Cập nhật hình thức làm việc thành công",
        data: jobType,
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
   * Xóa hình thức làm việc
   * @param {Object} req - Đối tượng request
   * @param {Object} res - Đối tượng response
   * @returns {Promise<Object>} Hình thức làm việc đã được xóa
   */
  async deleteJobType(req, res) {
    try {
      const { id } = req.params;
      const jobType = await JoTypesService.deleteJobType(id);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Xóa hình thức làm việc thành công",
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

module.exports = new JobTypesController();
