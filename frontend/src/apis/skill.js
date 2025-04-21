import api from "@utils/axios.config";

/**
 * Thêm mới một kỹ năng
 * @param data
 * @returns  {Promise<Object>}
 */
export const createSkillApi = async (data) => {
  const response = await api.post("/api/skills", data);
  return response.data;
};

/**
 * Lấy danh sách kỹ năng
 * @param data
 * @returns {Promise<Object>}
 */
export const getSkillsApi = async (page = 1, limit = 8) => {
  const response = await api.get("/api/skills", {
    params: { page, limit }, // Đúng cú pháp của Axios
  });
  return response.data;
};

/**
 * Cập nhật kỹ năng
 * @param data
 * @returns {Promise<Object>}
 */
export const updateSkillApi = async (data, id) => {
  const response = await api.update(`/api/skills/${id}`, data);
  return response.data;
};

/**
 * Xóa một kỹ năng
 * @param id
 * @returns {Promise<Object>}
 */
export const deleteSkillApi = async (id) => {
  const response = await api.delete(`/api/skills/${id}`);
  return response.data;
};

/**
 * Lấy danh sách kỹ năng theo mã danh mục
 * @param categoryId
 * @returns {Promise<Object>}
 */
export const getSkillsByCategoryIdApi = async (categoryId) => {
  const response = await api.get(`/api/skills/${categoryId}`);
  return response.data;
};
