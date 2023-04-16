import axios from "axios";
import { backendApi } from "config";

const axio = axios.create({
  baseURL: backendApi,
});

axio.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers["X-Authorization"] = token;
  }
  return config;
});

axio.interceptors.response.use((response) => {
  return response.data;
});

export default axio;
