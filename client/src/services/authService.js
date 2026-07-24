import api from "../api/axios";

export async function registerUser(userData) {
  const { data } = await api.post("/auth/register", userData);
  return data;
}

export async function loginUser(credentials) {
  const { data } = await api.post("/auth/login", credentials);
  return data;
}

export async function logoutUser() {
  const { data } = await api.post("/auth/logout");
  return data;
}

export async function getCurrentUser() {
  const { data } = await api.get("/auth/me");
  return data;
}