import api from "@utils/axios.config";

export const getInfoApi = async () => {
  const response = await api.get("/api/users/info");
  return response.data;
};
