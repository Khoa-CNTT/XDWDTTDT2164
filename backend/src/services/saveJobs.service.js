const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");
const db = require("../models");

/**
 * Service xử lý logic nghiệp vụ liên quan đến lưu job yêu thích
 */
class SaveJobsService {
  /**
   * Lưu một job vào danh sách yêu thích
   * @param {string} jobId - Dữ liệu job để lưu job
   * @param {string} userId - Dữ liệu user để lưu job
   * @returns {Promise<Object>} - Job được lưu trong danh sách
   */
  async saveJob(jobId, userId) {
    // Kiểm tra job này đã tồn tại chưa
    const saveJobExists = await db.SaveJobs.findOne({
      where: {
        userId,
        jobId,
      },
    });

    if (saveJobExists) {
      throw new ApiError(
        StatusCode.BAD_REQUEST,
        "Job này đã tồn tại trong danh sách"
      );
    }

    // Thêm job mới vào danh sách lưu
    const newSaveJob = await db.SaveJobs.create({
      userId,
      jobId,
    });

    return newSaveJob;
  }

  /**
   * Xóa một job trong danh sách
   * @param {string} jobId - Dữ liệu job để lưu job
   * @param {string} userId - Dữ liệu user để lưu job
   * @returns {Promise<Object>} - Job được xóa khỏi danh sách
   */
  async delJob(jobId, userId) {
    // Kiểm tra job này đã tồn tại chưa
    const saveJobExists = await db.SaveJobs.findOne({
      where: {
        userId,
        jobId,
      },
    });

    if (!saveJobExists) {
      throw new ApiError(
        StatusCode.NOT_FOUND,
        "Job này không tồn tại trong danh sách"
      );
    }

    await saveJobExists.destroy();

    return {
      message: "Xóa bài đăng đã lưu thành công",
    };
  }

  /**
   * Lấy ra danh sách jobs đã lưu
   * @param {query} query - Query: phân trang cho danh sách jobs
   * @param {string} userId - Id user để lọc danh sách jobs
   * @returns {Promise<Object>} - Danh sách jobs
   */
  async getJobs(query, userId) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const offset = (page - 1) * limit;

    const jobs = await db.SaveJobs.findAndCountAll({
      where: { userId },
      limit,
      offset,
    });

    return jobs;
  }
}

module.exports = new SaveJobsService();
