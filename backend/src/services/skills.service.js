const { default: slugify } = require("slugify");
const db = require("../models");
const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");

/**
 * Service xử lý logic nghiệp vụ liên quan đến skills
 */
class SkillsService {
  /**
   * Tạo skill mới
   * @param {Object} skillData - Dữ liệu skill
   * @returns {Promise<Object>} - Skill đã được tạo ra
   */
  async createSkill(skillData) {
    const { skillName, categoryId } = skillData;

    // Kiểm tra skill đã tồn tại chưa
    const skillSlug = slugify(skillName, { lower: true });
    const skill = await this.checkSkillExists(skillSlug);

    if (skill) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Skill này đã tồn tại");
    }

    // Tạo skill mới
    const newSkill = await db.Skills.create({
      skillName,
      skillSlug,
      categoryId,
    });

    return newSkill;
  }

  /**
   * Lấy danh sách skill
   * @returns {Promise<Object>} - Danh sách skill
   */
  async getSkills(categoryId) {
    const skills = await db.Skills.findAll({
      where: { categoryId, deleted: false },
    });
    return skills;
  }

  /**
   * Cập nhật skill
   * @param {Object} skillData - Dữ liệu skill
   * @returns {Promise<Object>} - Skill đã được cập nhật
   */
  async updateSkill(skillData, id) {
    const { skillName, categoryId } = skillData;

    // Kiểm tra skill có tồn tại không
    const skill = await this.checkSkillById(id);

    if (!skill) {
      throw new ApiError(StatusCode.NOT_FOUND, "Skill không tồn tại");
    }

    // Tạo slug mới
    let skillSlug = skill.skillSlug;
    if (skillName) {
      skillSlug = slugify(skillName, { lower: true });
    }

    // Cập nhật skill
    const updatedSkill = await skill.update({
      skillName,
      skillSlug,
      categoryId,
    });

    return updatedSkill;
  }

  /**
   * Xóa skill
   * @param {number} id - ID của skill
   * @returns {Promise<Object>} - Skill đã được xóa
   */
  async deleteSkill(id) {
    const skill = await this.checkSkillById(id);

    // Kiểm tra skill có tồn tại không
    if (!skill) {
      throw new ApiError(StatusCode.NOT_FOUND, "Skill không tồn tại");
    }

    // Xóa skill
    await db.Skills.update({ deleted: true }, { where: { id } });

    return {
      message: "Skill đã được xóa thành công",
    };
  }

  /**
   * Hàm kiểm tra skill đã tồn chưa
   */
  async checkSkillExists(skillName) {
    return await db.Skills.findOne({ where: { skillName: skillName } });
  }

  /**
   * Hàm kiểm tra skill bằng skillId
   * @param {number} skillId - ID của skill
   * @returns {Promise<Object>} - Skill đã được kiểm tra
   */
  async checkSkillById(skillId) {
    return await db.Skills.findByPk(skillId, { where: { deleted: false } });
  }
}

module.exports = new SkillsService();
