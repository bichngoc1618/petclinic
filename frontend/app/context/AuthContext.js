import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { Alert } from "react-native";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const API_URL = "http://192.168.5.46:5000/api/users";

  // --- Load user từ AsyncStorage ---
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = await AsyncStorage.getItem("user");
        if (storedUser) {
          const parsedUser = JSON.parse(storedUser);
          if (parsedUser.token) {
            setUser(parsedUser);
            // Gắn token trực tiếp vào axios
            axios.defaults.headers.common[
              "Authorization"
            ] = `Bearer ${parsedUser.token}`;
            console.log("✅ Loaded user:", parsedUser);
          } else {
            console.warn("⚠️ Không có token trong AsyncStorage, logout");
            await logout();
          }
        }
      } catch (err) {
        console.log("❌ Failed to load user:", err);
      } finally {
        setInitializing(false);
      }
    };
    loadUser();
  }, []);

  // --- Register ---
  const register = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/register`, {
        name,
        email,
        password,
        roleName: role,
      });
      const userData = { ...res.data.user, token: res.data.token };
      if (!userData.token) throw new Error("⚠️ Server không trả token");
      setUser(userData);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.token}`;
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ Registered user:", userData);
      return userData;
    } catch (err) {
      console.log("❌ Register error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Login ---
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/login`, { email, password });
      const userData = { ...res.data.user, token: res.data.token };
      if (!userData.token) throw new Error("⚠️ Server không trả token");
      setUser(userData);
      axios.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${userData.token}`;
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ Logged in user:", userData);
      return userData;
    } catch (err) {
      console.log("❌ Login error:", err.response?.data || err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // --- Logout ---
  const logout = async () => {
    setUser(null);
    delete axios.defaults.headers.common["Authorization"];
    await AsyncStorage.removeItem("user");
    console.log("✅ Logged out");
    Alert.alert("Thông báo", "Bạn đã đăng xuất");
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, register, logout, loading, initializing }}
    >
      {children}
    </AuthContext.Provider>
  );
};
