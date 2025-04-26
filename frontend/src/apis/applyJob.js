import api from "@utils/axios.config";
/**
 * Ứng tuyển một công việc
 * @returns {Promise<void>} - Trả về data
 */
export const applyToJobApi = async (data) => {
  const response = await api.post("/api/apply-jobs/apply", data);
  return response.data;
};

/**
 * Lấy ra danh sách ứng tuyển
 * @returns {Promise<void>} - Trả về data
 */
export const getCandidatesApi = async (jobId, page, limit) => {
  const response = await api.get(`/api/apply-jobs/get-candidates/${jobId}`, {
    params: { page, limit },
  });
  return response.data;
};

/**
 * Lấy ra danh sách ứng tuyển
 * @returns {Promise<void>} - Trả về data
 */
export const getCandidateDetailApi = async (applyId) => {
  const response = await api.get(`/api/apply-jobs/get-candidate/${applyId}`);
  return response.data;
};

/**
 * Lấy danh sách bài đằng đã ứng tuyển
 * @param {string} page
 * @param {string} limit
 * @returns {Promise<void>}
 */
export const getJobApplyApi = async (candidateId, page, limit) => {
  const response = await api.get(
    `/api/apply-jobs/get-job-apply/${candidateId}`,
    {
      params: { page, limit },
    }
  );

  return response.data;
};
