const db = require("../models");
const slugify = require("slugify");
const cloudinary = require("cloudinary").v2;
const { StatusCode, ResponseStatus } = require("../libs/enum");
const ApiError = require("../libs/apiError");

/**
 * Service xử lý logic nghiệp vụ liên quan đến category
 */
class CategoryService {
  /**
   * Tạo category mới
   * @param {Object} categoryData - Dữ liệu category
   * @returns {Promise<Object>} - Category đã được tạo
   */
  async createCategory(categoryData) {
    const categorySlug = slugify(categoryData.categoryName, { lower: true });
    const category = await db.Categories.findOne({
      where: { categorySlug: categorySlug },
    });
    if (category) {
      throw new ApiError(StatusCode.BAD_REQUEST, "Tên danh mục đã tồn tại");
    }

    const newCategory = await db.Categories.create({
      categoryName: categoryData.categoryName,
      categoryImage: categoryData.image,
      categorySlug: categorySlug,
    });

    return newCategory;
  }

  /**
   * Lấy danh sách category
   * @returns {Promise<Object>} - Danh sách category
   */
  async getCategories() {
    const categories = await db.Categories.findAll({
      where: { deleted: false },
    });
    return categories;
  }

  /**
   * Cập nhật category
   * @param {Object} categoryData - Dữ liệu category
   * @returns {Promise<Object>} - Category đã được cập nhật
   */
  async updateCategory(categoryData, id) {
    const category = await this.findCategoryById(id);
    if (!category) {
      throw new ApiError(StatusCode.NOT_FOUND, "Danh mục không tồn tại");
    }

    // Kiểm tra tên danh mục có bị trùng không (nếu có thay đổi tên)
    if (categoryData.categoryName) {
      const existingCategory = await db.Categories.findOne({
        where: { categoryName: categoryData.categoryName },
      });
      if (existingCategory && existingCategory.id !== id) {
        throw new ApiError(StatusCode.CONFLICT, "Danh mục đã tồn tại");
      }
    }

    // Nếu có ảnh thì xóa ảnh ở cloudinary
    if (categoryData.image && category.categoryImage) {
      await cloudinary.uploader.destroy(category.categoryImage);
    }

    let slug = category.categorySlug;
    if (categoryData.categoryName) {
      slug = slugify(categoryData.categoryName, { lower: true });
    }

    const updatedCategory = await category.update({
      categoryName: categoryData.categoryName,
      categoryImage: categoryData.image,
      categorySlug: slug,
    });

    return updatedCategory;
  }

  /**
   * Xóa category
   * @param {Object} id - ID category
   * @returns {Promise<Object>} - Category đã được xóa
   */
  async deleteCategory(id) {
    const category = await this.findCategoryById(id);
    if (!category) {
      throw new ApiError(StatusCode.NOT_FOUND, "Danh mục không tồn tại");
    }

    // Kiểm tra đã có job chưa
    const hasJobs = await db.Jobs.count({ where: { categoryId: id } });
    if (hasJobs) {
      throw new ApiError(
        StatusCode.CONFLICT,
        "Không thể xóa danh mục vì có công việc liên quan"
      );
    }

    await category.update({ deleted: true });
    return category;
  }

  /**
   * Hàm tìm kiếm category theo id
   * @param {number} id - Id của category
   * @returns {Promise<Object>} - Category đã được tìm kiếm
   */
  async findCategoryById(id) {
    const category = await db.Categories.findByPk(id);
    return category;
  }
}

module.exports = new CategoryService();
