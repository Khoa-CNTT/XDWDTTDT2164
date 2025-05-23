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
  async getSalaries(pageParam, limitParam) {
    if (!pageParam || !limitParam) {
      const salaries = await db.Salaries.findAll({
        where: { deletedAt: null },
      });
      return salaries;
    }

    const page = parseInt(pageParam) || 1;
    const limit = parseInt(limitParam) || 8;
    const skip = (page - 1) * limit;
    const salaries = await db.Salaries.findAll({
      where: { deletedAt: null },
      skip,
      limit,
    });
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

    // Kiểm tra tên khoản lương có bị trùng không
    if (salaryName) {
      const existingSalary = await db.Salaries.findOne({
        where: { salaryName },
      });
      if (existingSalary && existingSalary.id !== id) {
        throw new ApiError(StatusCode.CONFLICT, "Tên khoản lương đã tồn tại");
      }
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

    // Kiểm tra đã có job chưa
    const hasJobs = await db.Jobs.count({ where: { salaryId: id } });
    if (hasJobs) {
      throw new ApiError(
        StatusCode.CONFLICT,
        "Không thể xóa khoản lương vì có công việc liên quan"
      );
    }

    await salary.update({ deletedAt: new Date() });
    return {
      message: "Mức lương đã được xóa thành công",
    };
  }

  /**
   * Hàm kiểm tra mức lương có tồn tại theo slug
   */
  async checkSalaryExists(salarySlug) {
    return await db.Salaries.findOne({
      where: { salarySlug, deletedAt: null },
    });
  }

  /**
   * Hàm kiểm tra mức lương có tồn tại theo id
   */
  async checkSalaryById(id) {
    return await db.Salaries.findOne({
      where: { id, deletedAt: null },
    });
  }
}

module.exports = new SalariesService();
