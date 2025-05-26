import api from "@utils/axios.config";

/**
 * Lấy ra danh sách thông báo
 * @returns {Promise<void>} - Danh sách thông báo
 */
export const getNotificationsApi = async () => {
  const response = await api.get("/api/notifications/admin");
  return response.data;
};

/**
 * Lấy ra danh sách thông báo cho nhà tuyển dụng
 * @returns {promise<void>} - Danh sách thông báo
 */
export const getNotificationsForEmployerApi = async () => {
  const response = await api.get("/api/notifications/employer");
  return response.data;
};
