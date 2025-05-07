import api from "@utils/axios.config";

export const getDashboardOverview = async () => {
  const response = await api.get("/api/dashboard/get-overview");
  return response.data;
};

export const getPaymentOverview = async () => {
  const response = await api.get("/api/dashboard/get-payment-overview");
  return response.data;
};
