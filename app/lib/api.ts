import axios from "axios";

export const API_URL = "http://192.168.1.5:3000"; // your backend machine IP

const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export function setAuthToken(token?: string | null) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export default api;
