import api from "@utils/axios.utils";

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
export const getCandidatesApi = async (jobId) => {
  const response = await api.get(
    `/api/apply-jobs/get-candidates/${jobId}`,
    data
  );
  return response.data;
};

/**
 * Lấy ra danh sách ứng tuyển
 * @returns {Promise<void>} - Trả về data
 */
export const getCandidateDetailApi = async (jobId, candidateId) => {
  const response = await api.get(
    `/api/apply-jobs/get-candidate/${jobId}/${candidateId}`
  );
  return response.data;
};
