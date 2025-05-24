import api from "@utils/axios.config";

export const registerApi = async (data) => {
  const response = await api.post("/api/auth/register", data);
  return response.data;
};

export const verifyEmailApi = async (data) => {
  const response = await api.post("/api/auth/verify-otp", data);
  return response.data;
};

export const loginApi = async (data) => {
  const response = await api.post("/api/auth/login", data);
  console.log(response);
  return response.data;
};

export const logoutApi = async () => {
  const response = await api.post("/api/auth/logout");
  return response.data;
};
