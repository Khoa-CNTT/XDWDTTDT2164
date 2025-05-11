const { StatusCode } = require("../libs/enum");
const { resSuccess, resError } = require("../libs/response");
const experiencesService = require("../services/experiences.service");

/**
 * Controller xử lý logic liên quan đến kinh nghiệm
 */
class ExperiencesController {
  /**
   * Tạo mới kinh nghiệm
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Kinh nghiệm đã được tạo
   */
  async createExperience(req, res) {
    const { experienceName } = req.body;
    try {
      const experince = await experiencesService.createExperience(
        experienceName
      );

      return resSuccess(
        res,
        "Thêm mới kinh nghiệm thành công",
        experince,
        StatusCode.CREATED
      );
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách kinh nghiệm
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Danh sách kinh nghiệm
   */
  async getExperiences(req, res) {
    try {
      const { page, limit } = req.query;
      const experiences = await experiencesService.getExperiences(page, limit);
      return resSuccess(res, null, experiences);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Cập nhật kinh nghiệm
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Kinh nghiệm đã được cập nhật
   */
  async updateExperience(req, res) {
    const { id } = req.params;
    const { experienceName } = req.body;
    try {
      const experience = await experiencesService.updateExperience(
        experienceName,
        id
      );

      return resSuccess(res, "Cập nhật kinh nghiệm thành công", experience);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Xóa kinh nghiệm
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Kinh nghiệm đã được xóa
   */
  async deleteExperience(req, res) {
    const { id } = req.params;
    try {
      const experience = await experiencesService.deleteExperience(id);

      return resSuccess(res, "Xóa kinh nghiệm thành công");
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new ExperiencesController();
