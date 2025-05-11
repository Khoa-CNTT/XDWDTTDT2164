const categoryService = require("../services/categories.service");
const ApiError = require("../libs/apiError");
const { StatusCode } = require("../libs/enum");
const { resSuccess, resError } = require("../libs/response");

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
      return resSuccess(
        res,
        "Tạo danh mục thành công",
        category,
        StatusCode.CREATED
      );
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(res, null, categories);
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(res, "Cập nhật danh mục thành công", category);
    } catch (error) {
      return resError(res, error);
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
      return resSuccess(res, "Xóa danh mục thành công");
    } catch (error) {
      return resError(res, error);
    }
  }
}
module.exports = new CategoryController();
