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
