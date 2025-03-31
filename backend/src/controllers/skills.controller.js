const { StatusCode, ResponseStatus } = require("../libs/enum");
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

      return res.status(StatusCode.CREATED).json({
        statusCode: StatusCode.CREATED,
        status: ResponseStatus.SUCCESS,
        message: "Skill đã được tạo thành công",
        data: skill,
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
   * Lấy danh sách skill
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Danh sách skill
   */
  async getSkills(req, res) {
    try {
      const { categoryId } = req.params;

      const skills = await skillsService.getSkills(categoryId);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: skills,
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

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.ERROR,
        message: "Cập nhật skill thành công",
        data: skill,
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
   * Xóa skill
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Skill đã được xóa
   */
  async deleteSkill(req, res) {
    try {
      const { id } = req.params;
      const skill = await skillsService.deleteSkill(id);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Xóa skill thành công",
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

module.exports = new SkillsController();
