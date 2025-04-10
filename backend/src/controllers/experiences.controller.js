const { StatusCode, ResponseStatus } = require("../libs/enum");
const experiencesService = require("../services/experiences.service");

/**
 * Controller xử lý logic liên quan đến kinh nghiệm
 */
class ExperiencesController {
  /**
   * Tạo mới kinh nghiệm
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Kinh nghiệm đã được tạo
   */
  async createExperience(req, res) {
    const { experienceName } = req.body;
    try {
      const experince = await experiencesService.createExperience(
        experienceName
      );

      return res.status(StatusCode.CREATED).json({
        statusCode: StatusCode.CREATED,
        status: ResponseStatus.SUCCESS,
        message: "Thêm mới kinh nghiệm thành công",
        data: experince,
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
   * Lấy danh sách kinh nghiệm
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Danh sách kinh nghiệm
   */
  async getExperiences(req, res) {
    try {
      const { page, limit } = req.query;
      const experiences = await experiencesService.getExperiences(page, limit);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: experiences,
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
   * Cập nhật kinh nghiệm
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Kinh nghiệm đã được cập nhật
   */
  async updateExperience(req, res) {
    const { id } = req.params;
    const { experienceName } = req.body;
    try {
      const experience = await experiencesService.updateExperience(
        experienceName,
        id
      );

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Cập nhật kinh nghiệm thành công",
        data: experience,
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
   * Xóa kinh nghiệm
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} Kinh nghiệm đã được xóa
   */
  async deleteExperience(req, res) {
    const { id } = req.params;
    try {
      const experience = await experiencesService.deleteExperience(id);

      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Xóa kinh nghiệm thành công",
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

module.exports = new ExperiencesController();
