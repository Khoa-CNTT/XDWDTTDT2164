import api from "@utils/axios.config";

/**
 * Lấy ra danh sách bài đăng công việc
 * @returns {Promise<void>} - Danh sách bài đăng công việc
 */
export const getJobs = async () => {
  const response = await api.get("/api/jobs");
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
export const getJobsForEmployerApi = async (page, limit) => {
  const response = await api.get("/api/jobs/get-jobs-employer", {
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
