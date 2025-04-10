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

    // Lấy skill vừa tạo kèm theo thông tin Categories
    const skillWithCategory = await db.Skills.findOne({
      where: { id: newSkill.id },
      include: [
        {
          model: db.Categories, // Bảng liên kết
          as: "Categories", // Alias của quan hệ (cần đảm bảo đã khai báo trong models)
        },
      ],
    });

    return skillWithCategory;
  }

  /**
   * Lấy danh sách skill theo categoryId
   * @returns {Promise<Object>} - Danh sách skill
   */
  async getSkillsByCategory(categoryId) {
    const skills = await db.Skills.findAll({
      where: { categoryId, deletedAt: null },
    });
    return skills;
  }

  /**
   * Lấy danh sách tất cả skill
   * @param {number} page - Số trang
   * @param {number} limit - Số phần tử xuất hiện trong một trang
   * @returns {Promise<Object>} - Trả về tất cả các phần tử
   */
  async getSkills(pageParam, limitParam) {
    const page = parseInt(pageParam, 10) || 1;
    const limit = parseInt(limitParam, 10) || 8;
    const offset = (page - 1) * limit;

    const { count, rows } = await db.Skills.findAndCountAll({
      include: [
        {
          model: db.Categories,
          as: "Categories",
        },
      ],
      offset,
      limit,
    });

    return {
      skills: rows,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      pageSize: limit,
    };
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

    // Kiểm tra tên skill có bị trùng không
    if (skillData.skillName) {
      const existingSkill = await db.Skills.findOne({
        where: { skillName: skillData.skillName },
      });
      if (existingSkill && existingSkill.id !== id) {
        throw new ApiError(StatusCode.CONFLICT, "Tên kỹ năng đã tồn tại");
      }
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

    // Kiểm tra đã có job chưa
    const hasJobs = await db.JobSkills.count({ where: { skillId: id } });
    if (hasJobs) {
      throw new ApiError(
        StatusCode.CONFLICT,
        "Không thể xóa khoản lương vì có công việc liên quan"
      );
    }

    // Xóa skill
    await db.Skills.update({ deletedAt: new Date() }, { where: { id } });

    return {
      message: "Skill đã được xóa thành công",
    };
  }

  /**
   * Hàm kiểm tra skill đã tồn chưa
   */
  async checkSkillExists(skillName) {
    return await db.Skills.findOne({
      where: { skillName: skillName, deletedAt: null },
    });
  }

  /**
   * Hàm kiểm tra skill bằng skillId
   * @param {number} skillId - ID của skill
   * @returns {Promise<Object>} - Skill đã được kiểm tra
   */
  async checkSkillById(skillId) {
    return await db.Skills.findByPk(skillId, { where: { deletedAt: null } });
  }
}

module.exports = new SkillsService();
