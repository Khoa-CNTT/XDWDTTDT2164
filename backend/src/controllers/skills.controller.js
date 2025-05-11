const { StatusCode } = require("../libs/enum");
const { resSuccess, resError } = require("../libs/response");
const skillsService = require("../services/skills.service");

/**
 * Controller xử lý logic liên quan đến skills
 */
class SkillsController {
  /**
   * Tạo skill mới
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Skill đã được tạo ra
   */
  async createSkill(req, res) {
    try {
      const { skillName, categoryId } = req.body;

      const skill = await skillsService.createSkill({
        skillName,
        categoryId,
      });

      return resSuccess(
        res,
        "Tạo mới kỹ năng thành công",
        skill,
        StatusCode.CREATED
      );
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách skill theo category
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Danh sách skill
   */
  async getSkillsByCategory(req, res) {
    try {
      const { categoryId } = req.params;

      const skills = await skillsService.getSkillsByCategory(categoryId);

      return resSuccess(res, null, skills);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách skill
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Danh sách skill
   */
  async getSkills(req, res) {
    try {
      const { page, limit } = req.query;
      const skills = await skillsService.getSkills(page, limit);
      return resSuccess(res, null, skills);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Cập nhật skill
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Skill đã được cập nhật
   */
  async updateSkill(req, res) {
    try {
      const { id } = req.params;
      const { skillName, categoryId } = req.body;

      const skill = await skillsService.updateSkill(
        { skillName, categoryId },
        id
      );

      return resSuccess(res, "Cập nhật kỹ năng thành công", skill);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Xóa skill
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Skill đã được xóa
   */
  async deleteSkill(req, res) {
    try {
      const { id } = req.params;
      const skill = await skillsService.deleteSkill(id);

      return resSuccess(res, "Xóa kỹ năng thành công");
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new SkillsController();
