const { StatusCode, ResponseStatus } = require("../libs/enum");
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
      return res.status(StatusCode.CREATED).json({
        statusCode: StatusCode.CREATED,
        status: ResponseStatus.SUCCESS,
        message: "Tạo cấp bậc thành công",
        data: rank,
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
   * Lấy danh sách cấp bậc
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Danh sách cấp bậc
   */
  async getRanks(req, res) {
    try {
      const ranks = await ranksService.getRanks();

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: ranks,
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
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Cập nhật cấp bậc thành công",
        data: rank,
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
   * Xóa cấp bậc
   * @param {Object} req - Request
   * @param {Object} res - Response
   * @returns {Promise<Object>} - Cấp bậc đã được xóa
   */
  async deleteRank(req, res) {
    const { id } = req.params;
    try {
      const rank = await ranksService.deleteRank(id);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: rank,
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

module.exports = new RanksController();
