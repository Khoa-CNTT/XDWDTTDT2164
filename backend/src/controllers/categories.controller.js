const categoryService = require("../services/categories.service");
const ApiError = require("../libs/apiError");
const { StatusCode, ResponseStatus } = require("../libs/enum");

/**
 *  Controller xử lý logic liên quan đến category
 */
class CategoryController {
  /**
   * Tạo category mới
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Category đã được tạo
   */
  async createCategory(req, res) {
    try {
      const { categoryName } = req.body;
      if (!req.file || !req.file.path) {
        throw new ApiError(StatusCode.BAD_REQUEST, "Ảnh không được để trống");
      }

      const imageUrl = req.file.filename;
      const category = await categoryService.createCategory({
        categoryName,
        image: imageUrl,
      });
      return res.status(StatusCode.CREATED).json({
        statusCode: StatusCode.CREATED,
        status: ResponseStatus.SUCCESS,
        message: "Tạo danh mục thành công",
        data: category,
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
   * Lấy danh sách category
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Danh sách category
   */
  async getCategories(req, res) {
    try {
      const categories = await categoryService.getCategories();
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        data: categories,
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
   * Cập nhật category
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Category đã được cập nhật
   */
  async updateCategory(req, res) {
    try {
      const { id } = req.params;
      const { categoryName } = req.body;

      const imageUrl = req.file?.filename;
      const category = await categoryService.updateCategory(
        {
          categoryName,
          image: imageUrl,
        },
        id
      );
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Cập nhật danh mục thành công",
        data: category,
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
   * Xóa category
   * @param {Object} req - Request object
   * @param {Object} res - Response object
   * @returns {Promise<Object>} - Category đã được xóa
   */
  async deleteCategory(req, res) {
    try {
      const { id } = req.params;
      await categoryService.deleteCategory(id);
      return res.status(StatusCode.OK).json({
        statusCode: StatusCode.OK,
        status: ResponseStatus.SUCCESS,
        message: "Xóa danh mục thành công",
      });
    } catch (error) {
      return res.status(error.statusCode || StatusCode.SERVER_ERROR).json({
        statusCode: error.statusCode || StatusCode.SERVER_ERROR,
      });
    }
  }
}
module.exports = new CategoryController();
