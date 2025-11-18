import axios from "axios";

const axiosClient = axios.create({
  baseURL: "http://192.168.1.10:5000/ 192.168.5.40", // ⚠️ thay IP bằng IP máy chạy backend
  headers: { "Content-Type": "application/json" },
});

axiosClient.interceptors.request.use((config) => {
  const token = global.authToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default axiosClient;
