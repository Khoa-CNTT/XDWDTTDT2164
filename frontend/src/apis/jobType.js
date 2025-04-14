import api from "@utils/axios.config";

/**
 * Tạo mới hình thức làm việc
 * @param data
 * @returns {Promise<Object>}
 */
export const createJobTypeApi = async (data) => {
  const response = await api.post("/api/job-types", data);
  return response.data;
};

/**
 * Lấy danh sách hình thức làm việc
 * @param page
 * @param limit
 * @returns {Promise<Object>}
 */
export const getJobTypesApi = async (page, limit) => {
  const response = await api.get("/api/job-types", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Cập nhật hình thức làm việc
 * @param data
 * @param id
 * @returns {Promise<Object>}
 */
export const updateJobTypeApi = async (id, data) => {
  const response = await api.put(`/api/job-types/${id}`, data);
  return response.data;
};

/**
 * Xóa hình thức làm việc
 * @param id
 * @returns {Promise<Object>}
 */
export const deleteJobTypeApi = async (id) => {
  const response = await api.delete(`/api/job-types/${id}`);
  return response.data;
};
