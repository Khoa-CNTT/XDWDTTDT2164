import api from "@utils/axios.config";

/**
 * Tạo mới cấp bậc
 * @param data
 * @returns {Promise<Object>}
 */
export const createRankApi = async (data) => {
  const response = await api.post("/api/ranks", data);
  return response.data;
};

/**
 * Cập nhật cấp bậc
 * @param data
 * @param id
 * @returns {Promise<Object>}
 */
export const updateRankApi = async (data, id) => {
  const response = await api.put(`/api/ranks/${id}`, data);
  return response.data;
};

/**
 * Lấy ra danh sách cấp bậc
 * @returns {Promise<Object>}
 */
export const getRankApi = async (page, limit) => {
  const response = await api.get("/api/ranks", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Xóa một cấp bậc
 * @param id
 * @returns {Promise<Object>}
 */
export const deleteRankApi = async (id) => {
  const response = await api.delete(`/api/ranks/${id}`);
  return response.data;
};
