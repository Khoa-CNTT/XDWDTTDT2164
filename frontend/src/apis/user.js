import api from "@utils/axios.config";

export const getInfoApi = async () => {
  const response = await api.get("/api/users/info");
  return response.data;
};

export const getUsersByAdminApi = async (page, limit) => {
  const response = await api.get("/api/users/get-users-admin", {
    params: { page, limit },
  });
  return response.data;
};

export const getEmployersApi = async (query = {}) => {
  const response = await api.get("/api/users/employers", {
    params: query,
  });
  return response.data;
};

export const getDetailEmployerApi = async (slug) => {
  const response = await api.get(`/api/users/employer-detail/${slug}`);
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

export const forgotPasswordApi = async (data) => {
  const response = await api.post("/api/users/forgot-password", data);
  return response.data;
};

export const resetPasswordApi = async (data) => {
  const response = await api.post("/api/users/reset-password", data);
  return response.data;
};

export const updateUserApi = async (userId, data) => {
  const response = await api.put(
    `/api/users/update-user-admin/${userId}`,
    data
  );
  return response.data;
};

export const createEmployerProfile = async (data) => {
  const response = await api.post("/api/users/create-employer-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const createCandidateProfile = async (data) => {
  const response = await api.post("/api/users/create-candidate-profile", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
