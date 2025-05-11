const { StatusCode } = require("../libs/enum");
const { resSuccess, resError } = require("../libs/response");
const ranksService = require("../services/ranks.service");

/**
 * Controller xử lý logic liên quan đến cấp bậc
 */
class RanksController {
  /**
   * Tạo mới cấp bậc
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Cấp bậc đã được tạo
   */
  async createRank(req, res) {
    try {
      const { rankName } = req.body;
      const rank = await ranksService.createRank(rankName);
      return resSuccess(
        res,
        "Tạo mới cấp bậc thành công",
        rank,
        StatusCode.CREATED
      );
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Lấy danh sách cấp bậc
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Danh sách cấp bậc
   */
  async getRanks(req, res) {
    try {
      const { page, limit } = req.query;
      const ranks = await ranksService.getRanks(page, limit);

      return resSuccess(res, null, ranks);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Cập nhật cấp bậc
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Cấp bậc đã được cập nhật
   */
  async updateRank(req, res) {
    const { id } = req.params;
    const { rankName } = req.body;
    try {
      const rank = await ranksService.updateRank(rankName, id);
      return resSuccess(res, "Cập nhật cấp bậc thành công", rank);
    } catch (error) {
      return resError(res, error);
    }
  }

  /**
   * Xóa cấp bậc
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Cấp bậc đã được xóa
   */
  async deleteRank(req, res) {
    const { id } = req.params;
    try {
      const rank = await ranksService.deleteRank(id);
      return resSuccess(res, "Xóa cấp bậc thành công");
    } catch (error) {
      return resError(res, error);
    }
  }
}

module.exports = new RanksController();
