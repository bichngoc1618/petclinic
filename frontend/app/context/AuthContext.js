import React, { createContext, useState, useEffect } from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [initializing, setInitializing] = useState(true); // thêm state để biết đã load xong user chưa

  const API_URL = "http://192.168.5.91:5000";

  // --- LOAD USER TỪ ASYNCSTORAGE KHI APP MỞ ---
  useEffect(() => {
    const loadUser = async () => {
      try {
        const userData = await AsyncStorage.getItem("user");
        if (userData) setUser(JSON.parse(userData));
      } catch (err) {
        console.log("Failed to load user from storage:", err);
      } finally {
        setInitializing(false);
      }
    };
    loadUser();
  }, []);

  // --- REGISTER ---
  const register = async ({ name, email, password, role }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
        roleName: role,
      });
      const userData = res.data.user;
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);
      return userData;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // --- LOGIN ---
  const login = async ({ email, password }) => {
    setLoading(true);
    try {
      const res = await axios.post(`${API_URL}/auth/login`, {
        email,
        password,
      });
      const userData = res.data.user;
      setUser(userData);
      await AsyncStorage.setItem("user", JSON.stringify(userData));
      setLoading(false);
      return userData;
    } catch (err) {
      setLoading(false);
      throw err;
    }
  };

  // --- LOGOUT ---
  const logout = async () => {
    setUser(null);
    await AsyncStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, register, login, logout, loading, initializing }}
    >
      {children}
    </AuthContext.Provider>
  );
};
