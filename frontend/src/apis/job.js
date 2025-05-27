import api from "@utils/axios.config";

/**
 * Lấy ra danh sách bài đăng công việc
 * @returns {Promise<void>} - Danh sách bài đăng công việc
 */
export const getJobsApi = async (params = {}) => {
  const response = await api.get("/api/jobs", {
    params,
  });
  return response.data;
};

/**
 * Lấy ra thông tin chi tiết bài đăng công việc
 * @returns {Promise<void>} - chi tiết bài đăng công việc
 */
export const getDetailJob = async (slug) => {
  const response = await api.get(`/api/jobs/${slug}`);
  return response.data;
};

/**
 * Lấy ra danh sách bài đăng công việc cho admin
 * @returns {Promise<void>} - Danh sách bài đăng công việc
 */
export const getJobsForAdminAPi = async (page, limit) => {
  const response = await api.get("/api/jobs/get-jobs-admin", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Lấy ra danh sách bài đăng công việc cho nhà tuyển dụng
 * @returns {Promise<void>} - Danh sách bài đăng công việc
 */
export const getJobsForEmployerApi = async (page, limit, employerId) => {
  const response = await api.get(`/api/jobs/get-jobs-employer/${employerId}`, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Tạo mới bài đăng công việc
 * @param {Object} data
 * @returns {Promise<void>}
 */
export const createNewJobApi = async (data) => {
  const response = await api.post("/api/jobs/", data);
  return response.data;
};

/**
 * Thanh toán bài đăng
 * @param {Object} data
 * @returns {Promise<void>}
 */
export const paymentJobApi = async (data) => {
  const response = await api.post("/api/jobs/pay-job", data);
  return response.data;
};

/**
 * Lấy ra chi tiết bài đăng cho nhà tuyển dụng
 * @param {string} id
 * @returns {Promise<void>}
 */
export const getJobDetailForEmployerApi = async (id) => {
  const response = await api.get(`/api/jobs/get-job-employer/${id}`);
  return response.data;
};

/**
 * Cập nhật bài đăng
 * @param {string} id
 * @param {Object} data
 * @returns {Promise<void>}
 */
export const updateJobApi = async (id, data) => {
  const response = await api.put(`/api/jobs/${id}`, data);
  return response.data;
};

/**
 * Kiểm duyệt bài đăng
 * @param {string} id
 * @param {string} status
 * @returns {Promise<void>}
 */
export const verifyJobApi = async (id, status, rejectionReason) => {
  const response = await api.put(`/api/jobs/${id}/verify`, {
    status,
    rejectionReason,
  });
  return response.data;
};

/**
 * Lấy danh sách bài đăng theo thời gian
 * @param {Object} query
 * @returns {Promise<void>}
 */
export const getJobsForTime = async (query = {}) => {
  const respone = await api.get("/api/jobs/get-jobs-time", { params: query });
  return respone.data;
};
