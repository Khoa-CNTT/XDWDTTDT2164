const { StatusCode } = require("../libs/enum");
const { resSuccess, resError } = require("../libs/response");
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
      return resSuccess(
        res,
        "Tạo mới mức lương thành công",
        salary,
        StatusCode.CREATED
      );
    } catch (error) {
      return resError(res, error);
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

      return resSuccess(res, null, salaries);
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(res, "Cập nhật mức lương thành công", salary);
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(res, "Xóa mức lương thành công");
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new SalariesController();
