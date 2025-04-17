import api from "@utils/axios.config";

export const getInfoApi = async () => {
  const response = await api.get("/api/users/info");
  return response.data;
};

export const getUsersByAdminApi = async () => {
  const response = await api.get("/api/users/users-admin");
  return response.data;
};

export const getEmployersApi = async (page, limit) => {
  const response = await api.get("/api/users/employers", {
    params: { page, limit },
  });
  return response.data;
};

export const getEmployersForAdminApi = async (page, limit) => {
  const response = await api.get("/api/users/employers-admin", {
    params: { page, limit },
  });
  return response.data;
};

export const getCandidatesByAdminApi = async (page, limit) => {
  const response = await api.get("/api/users/candidates", {
    params: { page, limit },
  });
  return response.data;
};

export const getEmployerInfoApi = async () => {
  const response = await api.get("/api/users/employer");
  return response.data;
};

export const changePassword = async (data) => {
  const response = await api.put("/api/users/change-password", data);
  return response.data;
};
