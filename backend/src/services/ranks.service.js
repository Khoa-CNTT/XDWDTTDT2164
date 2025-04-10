const { default: slugify } = require("slugify");
const db = require("../models");
const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");

/**
 * Service xủ lý logic nghiệp vụ liên quand đến cấp bậc
 */
class RanksService {
  /**
   * Tạo cấp bậc mới
   * @param {Object} rankName - Dữ liệu cấp bậc
   * @returns {Promise<Object>} - Mức lương đã được tạo
   */
  async createRank(rankName) {
    const rankSlug = slugify(rankName, { lower: true });

    // Kiểm tra cấp bậc đã tồn tại chưa
    const rank = await this.checkRankExistBySlug(rankSlug);
    if (rank) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Cấp bậc này đã tồn tại");
    }

    // Tạo cấp bậc mới
    const newRank = await db.Ranks.create({
      rankName,
      rankSlug,
    });

    return newRank;
  }

  /**
   * Lấy danh sách cấp bậc
   * @param {number} page - Số trang
   * @param {number} limit - Số phần tử trong trang
   * @returns {Promise<Object>} - Danh sách cấp bậc
   */
  async getRanks(pageParam, limitParam) {
    // Kiểm tra có truyền tham số không, nếu không truyền thì lấy tất cả
    if (!pageParam && !limitParam) {
      return await db.Ranks.findAll({
        where: { deletedAt: null },
      });
    }

    const page = parseInt(pageParam, 10) || 1;
    const limit = parseInt(limitParam, 10) || 8;
    const offset = (page - 1) * limit;

    return await db.Ranks.findAll({
      where: { deletedAt: null },
      offset,
      limit,
    });
  }

  /**
   * Cập nhật cấp bậc
   * @param {Object} rankName - Dữ liệu cấp bậc
   * @param {number} id - ID của cấp bậc
   * @returns {Promise<Object>} - Cấp bậc đã được cập nhật
   */
  async updateRank(rankName, id) {
    // Kiểm tra cấp bậc có tồn tại không
    const rank = await this.checkRankExistById(id);
    if (!rank) {
      throw new ApiError(StatusCode.NOT_FOUND, "Cấp bậc không tồn tại");
    }

    // Kiểm tra tên cấp bậc có bị trùng không
    if (rankName) {
      const existingName = await db.Ranks.findOne({
        where: { rankName },
      });
      if (existingName && existingName.id !== id) {
        throw new ApiError(StatusCode.CONFLICT, "Tên cấp bậc đã tồn tại");
      }
    }

    // Tạo slug mới
    let rankSlug = rank.rankSlug;
    if (rankName) {
      rankSlug = slugify(rankName, { lower: true });
    }

    // Cập nhật cấp bậc
    const updateRank = await rank.update({ rankName, rankSlug });

    return updateRank;
  }

  /**
   * Xóa cấp bậc (xóa ảo)
   * @param {number} id - ID của cấp bậc
   * @returns {Promise<Object>} - Cấp bậc đã được xóa
   */
  async deleteRank(id) {
    const rank = await this.checkRankExistById(id);
    if (!rank) {
      throw new ApiError(StatusCode.NOT_FOUND, "Cấp bậc không tồn tại");
    }

    // Kiểm tra đã có job chưa
    const hasJobs = await db.Jobs.count({ where: { rankId: id } });
    if (hasJobs) {
      throw new ApiError(
        StatusCode.CONFLICT,
        "Không thể xóa cấp bậc vì có công việc liên quan"
      );
    }

    await rank.update({ deletedAt: new Date() });
    return {
      message: "Cấp bậc đã được xóa thành công",
    };
  }

  /**
   * Hàm kiểm tra cấp bậc có tồn tại không theo slug
   */
  async checkRankExistBySlug(rankSlug) {
    return await db.Ranks.findOne({ where: { rankSlug, deletedAt: null } });
  }

  /**
   * Hàm kiểm tra cấp bậc có tồn tại theo id
   */
  async checkRankExistById(id) {
    return await db.Ranks.findOne({
      where: { id, deletedAt: null },
    });
  }
}

module.exports = new RanksService();
