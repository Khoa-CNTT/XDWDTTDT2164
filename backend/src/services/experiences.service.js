const { default: slugify } = require("slugify");
const db = require("../models");
const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");

/**
 * Service xử lý logic nghiệp vụ liên quan đến kinh nghiệm
 */
class ExperiencesService {
  /**
   * Tạo mới một kinh nghiệm
   * @param {Object} data - Dữ liệu kinh nghiệm
   * @returns {Promise<Object>} Kinh nghiệm đã được tạo
   */
  async createExperience(experienceName) {
    const experienceSlug = slugify(experienceName, { lower: true });
    // Kiểm tra xem kinh nghiệm đã tồn tại hay chưa
    const experience = await this.checkExperienceBySlug(experienceSlug);
    if (experience) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Kinh nghiệm đã tồn tại");
    }

    // Tạo mới kinh nghiệm
    const newExperience = await db.Experiences.create({
      experienceName,
      experienceSlug,
    });

    return newExperience;
  }

  /**
   * Lâý danh sách kinh nghiệm
   * @returns {Promise<Object>} Danh sách kinh nghiệm
   */
  async getExperiences() {
    const experiences = await db.Experiences.findAll({
      where: { deletedAt: null },
    });
    return experiences;
  }

  /**
   * Cập nhật kinh nghiệm
   * @param {string} experienceName - Tên kinh nghiệm
   * @param {string} id - ID của kinh nghiệm
   * @returns {Promise<Object>} Kinh nghiệm đã được cập nhật
   */
  async updateExperience(experienceName, id) {
    // Kiểm tra xem kinh nghiệm có tồn tại hay không
    const experience = await this.checkExperienceById(id);
    if (!experience) {
      throw new ApiError(StatusCode.NOT_FOUND, "Kinh nghiệm không tồn tại");
    }

    // Kiểm tra tên kinh nghiệm làm việc có bị trùng không
    if (experienceName) {
      const existingExperience = await db.Experiences.findOne({
        where: { experienceName },
      });
      if (existingExperience && existingExperience.id !== id) {
        throw new ApiError(
          StatusCode.CONFLICT,
          "Tên kinh nghiệm làm việc đã tồn tại"
        );
      }
    }

    let experienceSlug = experience.experienceSlug;
    if (experienceName !== experience.experienceName) {
      experienceSlug = slugify(experienceName, { lower: true });
    }

    // Cập nhật kinh nghiệm
    const updatedExperience = await experience.update({
      experienceName,
      experienceSlug,
    });

    return updatedExperience;
  }

  /**
   * Xóa kinh nghiệm
   * @param {string} id - ID của kinh nghiệm
   * @returns {Promise<Object>} Kinh nghiệm đã được xóa
   */
  async deleteExperience(id) {
    // Kiểm tra xem kinh nghiệm có tồn tại hay không
    const experience = await this.checkExperienceById(id);
    if (!experience) {
      throw new ApiError(StatusCode.NOT_FOUND, "Kinh nghiệm không tồn tại");
    }

    // Kiểm tra đã có job chưa
    const hasJobs = await db.Jobs.count({ where: { experienceId: id } });
    if (hasJobs) {
      throw new ApiError(
        StatusCode.CONFLICT,
        "Không thể xóa kinh nghiệm làm việc vì có công việc liên quan"
      );
    }

    // Xóa kinh nghiệm
    await experience.update({ deletedAt: new Date() });

    return experience;
  }

  /**
   * Hàm kiểm tra kinh nghiệm có tồn tại hay không bằng slug
   * @param {string} experienceSlug - Slug của kinh nghiệm
   * @returns {Promise<boolean>} true nếu kinh nghiệm tồn tại, false nếu không tồn tại
   */
  async checkExperienceBySlug(experienceSlug) {
    const experience = await db.Experiences.findOne({
      where: { experienceSlug, deletedAt: null },
    });
    return experience;
  }

  /**
   * Hàm kiểm tra kinh nghiệm có tồn tại hay không bằng id
   * @param {string} id - ID của kinh nghiệm
   * @returns {Promise<boolean>} true nếu kinh nghiệm tồn tại, false nếu không tồn tại
   */
  async checkExperienceById(id) {
    const experience = await db.Experiences.findOne({
      where: {
        id,
        deletedAt: null,
      },
    });
    return experience;
  }
}

module.exports = new ExperiencesService();
