import api from "@utils/axios.config";

/**
 * Tạo mới một danh mục việc làm
 * @param data
 * @returns {Promise<Object>}
 */
export const createCategoryApi = async (data) => {
  const response = await api.post("/api/categories", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Lấy ra danh sách danh mục việc làm
 * @returns {Promise<Object>}
 */
export const getCategoriesApi = async () => {
  const response = await api.get("/api/categories");
  return response.data;
};

/**
 * Cập nhật danh mục việc làm
 * @param data
 * @returns {Promise<Object>}
 */
export const updateCategoryApi = async (data, id) => {
  const response = await api.put(`/api/categories/${id}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

/**
 * Xóa danh mục vệc làm
 * @param id
 * @returns {Promise<Object>}
 */
export const deleteCategoryApi = async (id) => {
  const response = await api.delete(`/api/categories/${id}`);
  return response.data;
};
