import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const axiosClient = axios.create({
  baseURL: "http://192.168.5.46:5000",
  headers: { "Content-Type": "application/json" },
});

// --- Request interceptor ---
axiosClient.interceptors.request.use(
  async (config) => {
    // Token đã được set sẵn vào axios.defaults.headers.common
    const token = axios.defaults.headers.common["Authorization"]?.split(" ")[1];
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor ---
axiosClient.interceptors.response.use(
  (response) => {
    console.log("⬅️ Response:", response.config.url, response.data);
    return response;
  },
  async (error) => {
    if (error.response?.status === 401) {
      console.warn("⚠️ 401 Unauthorized, xóa token và logout");
      delete axios.defaults.headers.common["Authorization"];
      await AsyncStorage.removeItem("user");
      // Tùy chọn: bạn có thể trigger logout trong AuthContext nếu cần
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
