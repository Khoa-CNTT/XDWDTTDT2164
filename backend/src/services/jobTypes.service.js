const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");
const slugify = require("slugify");
const db = require("../models");

/**
 * Service xử lý logic liên quan đến hình thức làm việc
 */
class JoTypesService {
  /**
   * Tạo mới một hình thức làm việc
   * @param {string} jobTypeName - Tên hình thức làm việc
   * @returns {Promise<Object>} Hình thức làm việc đã được tạo
   */
  async createJobType(jobTypeName) {
    const jobTypeSlug = slugify(jobTypeName, { lower: true });

    // Kiểm tra xem hình thức làm việc đã tồn tại chưa
    const jobType = await this.checkJobTypeBySlug(jobTypeSlug);
    if (jobType) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Hình thức làm việc đã tồn tại"
      );
    }

    // Tạo mới hình thức làm việc
    const newJobType = await db.JobTypes.create({
      jobTypeName,
      jobTypeSlug,
    });

    return newJobType;
  }

  /**
   * Lấy danh sách hình thức làm việc
   * @returns {Promise<Object>} Danh sách hình thức làm việc
   */
  async getJobTypes() {
    const jobTypes = await db.JobTypes.findAll({ where: { deleted: false } });
    return jobTypes;
  }

  /**
   * Cập nhật hình thức làm việc
   * @param {string} jobTypeName - Tên hình thức làm việc
   * @param {string} id - ID hình thức làm việc
   * @returns {Promise<Object>} Hình thức làm việc đã được cập nhật
   */
  async updateJobType(jobTypeName, id) {
    // Kiểm tra xem hình thức làm việc có tồn tại không
    const jobType = await this.checkJobTypeById(id);
    if (!jobType) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "Hình thức làm việc không tồn tại"
      );
    }

    // Kiêm tra tên hình thức làm việc có bị trùng không
    if (jobTypeName) {
      const existingJobtype = await db.JobTypes.findOne({
        where: { jobTypeName },
      });
      if (existingJobtype && existingJobtype.id !== id) {
        throw new ApiError(
          StatusCode.CONFLICT,
          "Tên hình thức làm việc đã tồn tại"
        );
      }
    }

    // Tạo slug mới nếu tên hình thức làm việc thay đổi
    let jobTypeSlug = jobType.jobTypeSlug;
    if (jobTypeName !== jobType.jobTypeName) {
      jobTypeSlug = slugify(jobTypeName, { lower: true });
    }

    // Cập nhật hình thức làm việc
    await jobType.update({ jobTypeName, jobTypeSlug });

    return jobType;
  }

  /**
   * Xóa hình thức làm việc
   * @param {string} id - ID hình thức làm việc
   * @returns {Promise<Object>} Hình thức làm việc đã được xóa
   */
  async deleteJobType(id) {
    // Kiểm tra xem hình thức làm việc có tồn tại không
    const jobType = await this.checkJobTypeById(id);
    if (!jobType) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "Hình thức làm việc không tồn tại"
      );
    }

    // Kiểm tra đã có job chưa
    const hasJobs = await db.Jobs.count({ where: { jobTypeId: id } });
    if (hasJobs) {
      throw new ApiError(
        StatusCode.CONFLICT,
        "Không thể xóa hình thức làm việc vì có công việc liên quan"
      );
    }

    // Xóa hình thức làm việc
    await jobType.update({ deleted: true });

    return jobType;
  }

  /**
   * Hàm kiểm tra hình thức làm việc theo slug
   * @param {string} jobTypeSlug - Slug hình thức làm việc
   * @returns {Promise<Object>} Hình thức làm việc đã được tạo
   */
  async checkJobTypeBySlug(jobTypeSlug) {
    const jobType = await db.JobTypes.findOne({ where: { jobTypeSlug } });
    return jobType;
  }

  /**
   * Hàm kiểm tra hình thức làm việc theo id
   * @param {string} id - ID hình thức làm việc
   * @returns {Promise<Object>} Hình thức làm việc đã được tạo
   */
  async checkJobTypeById(id) {
    const jobType = await db.JobTypes.findByPk(id);
    return jobType;
  }
}

module.exports = new JoTypesService();
