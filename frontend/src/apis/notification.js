import api from "@utils/axios.config";

/**
 * Lấy ra danh sách thông báo
 * @returns {Promise<void>} - Danh sách thông báo
 */
export const getNotificationsApi = async () => {
  const response = await api.get("/api/notifications/admin");
  return response.data;
};
