import api from "@utils/axios.config";

/**
 *
 * @param {string} page
 * @param {string} limit
 * @returns {Promise<Object>}
 */
export const getSaveJobsApi = async (page, limit) => {
  const response = await api.get("/api/save-jobs", {
    params: { page, limit },
  });
  return response.data;
};

/**
 * @param {Object} data
 * @returns {Promise<Object>}
 */
export const saveJobApi = async (data) => {
  const response = await api.post("/api/save-jobs/", data);
  return response.data;
};

/**
 * @param {string} jobId
 * @returns {Promise<Object>}
 */
export const deleteSaveJobApi = async (jobId) => {
  const response = await api.delete(`/api/save-jobs/${jobId}`);
  return response.data;
};
