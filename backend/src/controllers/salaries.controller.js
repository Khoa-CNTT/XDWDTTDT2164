const { StatusCode, ResponseStatus } = require("../libs/enum");
const salariesService = require("../services/salaries.service");

/**
 * Controller xử lý logic liên quan đến mức lương
 */
class SalariesController {
  /**
   * Tạo mức lương mới
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Mức lương đã được tạo
   */
  async createSalary(req, res) {
    const { salaryName } = req.body;
    try {
      const salary = await salariesService.createSalary(salaryName);
      return res.status(StatusCode.CREATED).json({
        statusCode: StatusCode.CREATED,
        status: ResponseStatus.SUCCESS,
        message: "Tạo mức lương thành công",
        data: salary,
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
   * Lấy danh sách mức lương
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Danh sách mức lương
   */
  async getSalaries(req, res) {
    try {
      const { page, limit } = req.query;
      const salaries = await salariesService.getSalaries(page, limit);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: salaries,
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
   * Cập nhật mức lương
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Mức lương đã được cập nhật
   */
  async updateSalary(req, res) {
    const { id } = req.params;
    const { salaryName } = req.body;
    try {
      const salary = await salariesService.updateSalary(salaryName, id);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Cập nhật mức lương thành công",
        data: salary,
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
   * Xóa mức lương
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Mức lương đã được xóa
   */
  async deleteSalary(req, res) {
    const { id } = req.params;
    try {
      const salary = await salariesService.deleteSalary(id);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Xóa mức lương thành công",
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

module.exports = new SalariesController();
