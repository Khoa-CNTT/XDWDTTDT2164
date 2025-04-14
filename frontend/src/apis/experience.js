import api from "@utils/axios.config";

/**
 * Tạo mới một kinh nghiệm làm việc
 * @param data
 * @returns {Promise<Object>}
 */
export const createExperenceApi = async (data) => {
  const response = await api.post("/api/experiences", data);
  return response.data;
};

/**
 * Lấy ra danh sách kinh nghiệm làm việc
 * @param page
 * @param limit
 * @returns {Promise<Object>}
 */
export const getExperiencesApi = async (page, limit) => {
  const response = await api.get("/api/experiences", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Cập nhật kinh nghiệm làm việc
 * @param id
 * @param data
 * @returns {Promise<Object>}
 */
export const updateExperienceApi = async (id, data) => {
  const response = await api.put(`/api/experiences/${id}`, data);
  return response.data;
};

/**
 * Xóa một kinh nghiệm làm việc
 * @param id
 * @returns {Promise<void>}
 */
export const deleteExperienceApi = async (id) => {
  const response = await api.delete(`/api/experiences/${id}`);
  return response.data;
};
