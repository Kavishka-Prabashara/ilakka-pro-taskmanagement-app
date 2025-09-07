import axios from "axios";

export const API_URL = "http://192.168.8.137:3000";


const api = axios.create({
  baseURL: API_URL,
  timeout: 10000,
});

export function setAuthToken(token?: string | null) {
  if (token) api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  else delete api.defaults.headers.common["Authorization"];
}

export default api;
