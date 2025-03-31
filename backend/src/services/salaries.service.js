const { default: slugify } = require("slugify");
const db = require("../models");
const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");

/**
 * Service xử lý logic nghiệp vụ liên quan đến mức lương
 */
class SalariesService {
  /**
   * Tạo mức lương mới
   * @param {Object} salaryData - Dữ liệu mức lương
   * @returns {Promise<Object>} - Mức lương đã được tạo
   */
  async createSalary(salaryName) {
    const salarySlug = slugify(salaryName, { lower: true });

    // Kiểm tra mức lương có tồn tại theo slug
    const salary = await this.checkSalaryExists(salarySlug);
    if (salary) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Mức lương này đã tồn tại");
    }

    // Tạo mức lương mới
    const newSalary = await db.Salaries.create({
      salaryName,
      salarySlug,
    });

    return newSalary;
  }

  /**
   * Lấy danh sách mức lương
   * @returns {Promise<Object>} - Danh sách mức lương
   */
  async getSalaries() {
    const salaries = await db.Salaries.findAll({ where: { deleted: false } });
    return salaries;
  }

  /**
   * Cập nhật mức lương
   * @param {Object} salaryName - Dữ liệu mức lương
   * @param {number} id - ID của mức lương
   * @returns {Promise<Object>} - Mức lương đã được cập nhật
   */
  async updateSalary(salaryName, id) {
    // Kiểm tra mức lương có tồn tại không
    const salary = await this.checkSalaryById(id);
    if (!salary) {
      throw new ApiError(StatusCode.NOT_FOUND, "Mức lương không tồn tại");
    }

    // Tạo slug mới
    let salarySlug = salary.salarySlug;
    if (salaryName) {
      salarySlug = slugify(salaryName, { lower: true });
    }

    // Cập nhật mức lương
    const updatedSalary = await salary.update({ salaryName, salarySlug });

    return updatedSalary;
  }

  /**
   * Xóa mức lương
   * @param {number} id - ID của mức lương
   * @returns {Promise<Object>} - Mức lương đã được xóa
   */
  async deleteSalary(id) {
    const salary = await this.checkSalaryById(id);
    if (!salary) {
      throw new ApiError(StatusCode.NOT_FOUND, "Mức lương không tồn tại");
    }

    await salary.update({ deleted: true });
    return {
      message: "Mức lương đã được xóa thành công",
    };
  }

  /**
   * Hàm kiểm tra mức lương có tồn tại theo slug
   */
  async checkSalaryExists(salarySlug) {
    return await db.Salaries.findOne({
      where: { salarySlug },
    });
  }

  /**
   * Hàm kiểm tra mức lương có tồn tại theo id
   */
  async checkSalaryById(id) {
    return await db.Salaries.findOne({
      where: { id, deleted: false },
    });
  }
}

module.exports = new SalariesService();
