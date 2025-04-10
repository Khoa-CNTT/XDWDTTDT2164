import api from "@utils/axios.config";

/**
 * Tạo mới một mức lương
 * @param data
 * @returns {Promise<Object>}
 */
export const createSalaryApi = async (data) => {
  const response = await api.post("/api/salaries", data);
  return response.data;
};

/**
 * Lây ra danh sách mức lương
 * @param page
 * @param limit
 * @returns {Promise<Object>}
 */
export const getSalariesApi = async (page, limit) => {
  const response = await api.get("/api/salaries", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Cập nhật mức lưong
 * @param id
 * @param data
 * @returns {Promise<Object>}
 */
export const updateSalaryApi = async (id, data) => {
  const response = await api.put(`/api/salaries/${id}`, data);
  return response.data;
};

/**
 * Xóa mức lương
 * @param id
 * @returns {Promise<void>}
 */
export const deleteSalaryApi = async (id) => {
  const response = await api.delete(`/api/salaries/${id}`);
  return response.data;
};
