import api from "./api";

// --- Auth & Profile Endpoints (Aligned with your actual backend router) ---
export const loginUser = async (credentials) => {
  // Knocks against route.post("/users/login")
  const response = await api.post("/users/login", credentials);
  return response.data; // Expects { success, data: { token, user } } or similar
};

export const signUpUser = async (userData) => {
  // Knocks against route.post("/users/register")
  const response = await api.post("/users/register", userData);
  return response.data;
};

export const getProfile = async () => {
  // Knocks against route.get("/users/me")
  const response = await api.get("/users/me");
  return response.data; // Expects { success: true, data: { id, name, balance } }
};

// --- Financial & Dashboard Endpoints ---
export const getDashboardStats = async () => {
  return (await api.get("/dashboard/stats")).data;
};

export const initializeTopup = async (topupData) => {
  // Knocks against route.post("/init-topup")
  const response = await api.post("/init-topup", topupData);
  return response.data; // Expects something like { success: true, data: { checkout_url } }
};

// --- Payment Schedules Endpoints ---
export const fetchActiveSchedules = async () => {
  return (await api.get("/schedule")).data;
};

export const createScheduleRule = async (scheduleData) => {
  return (await api.post("/schedule", scheduleData)).data;
};

// --- Transaction History Endpoints ---
export const fetchTransactionLedger = async (page = 1, limit = 10) => {
  const response = await api.get(`/transaction/history`, {
    params: { page, limit },
  });
  return response.data; // Expects { status, pagination, data: [] }
};
