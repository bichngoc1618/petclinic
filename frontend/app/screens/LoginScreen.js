// LoginScreen.js
import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AuthContext } from "../context/AuthContext";
import { styles } from "../styles/login";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      // Sửa: truyền object theo AuthContext
      const user = await login({ email, password });

      // Điều hướng theo role
      if (user.role === "admin") navigation.replace("HomeAdmin");
      else if (user.role === "doctor") navigation.replace("HomeDoctor");
      else navigation.replace("HomeOwner");
    } catch (error) {
      console.error(error.response?.data || error.message);
      Alert.alert(
        "Lỗi",
        error.response?.data?.message || "Sai thông tin đăng nhập!"
      );
    }
  };

  return (
    <LinearGradient colors={["#dcf1faff", "#f7fff4"]} style={styles.fullScreen}>
      <SafeAreaView style={styles.fullScreen}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.fullScreen}
        >
          <ScrollView
            contentContainerStyle={styles.container}
            keyboardShouldPersistTaps="handled"
          >
            {/* Header */}
            <View style={styles.centerTop}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.appTitle}>Lamm</Text>
              <Text style={styles.subtitle}>Chăm sóc thú cưng</Text>
            </View>

            {/* Form Card */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Đăng nhập</Text>

              {/* Email */}
              <View
                style={[
                  styles.inputRow,
                  focusedInput === "email" && styles.inputFocused,
                ]}
              >
                <MaterialCommunityIcons
                  name="email-outline"
                  size={20}
                  color={focusedInput === "email" ? "#1976D2" : "#666"}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={email}
                  onChangeText={setEmail}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              {/* Password */}
              <View
                style={[
                  styles.inputRow,
                  focusedInput === "password" && styles.inputFocused,
                ]}
              >
                <MaterialCommunityIcons
                  name="lock-outline"
                  size={20}
                  color={focusedInput === "password" ? "#1976D2" : "#666"}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Mật khẩu"
                  secureTextEntry={!isPasswordVisible}
                  value={password}
                  onChangeText={setPassword}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                />
                <TouchableOpacity
                  onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                >
                  <MaterialCommunityIcons
                    name={isPasswordVisible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                    color="#666"
                  />
                </TouchableOpacity>
              </View>

              {/* Quên mật khẩu */}
              <TouchableOpacity
                style={{ alignSelf: "flex-end", marginBottom: 12 }}
                onPress={() =>
                  Alert.alert(
                    "Thông báo",
                    "Chức năng quên mật khẩu đang được phát triển!"
                  )
                }
              >
                <Text style={{ color: "#1976D2", fontSize: 13 }}>
                  Quên mật khẩu?
                </Text>
              </TouchableOpacity>

              {/* Nút đăng nhập */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleLogin}
              >
                <Text style={styles.buttonText}>Đăng nhập</Text>
              </TouchableOpacity>

              {/* Đăng ký */}
              <View style={styles.signupRow}>
                <Text>Chưa có tài khoản? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate("Register")}
                >
                  <Text style={{ color: "#1976D2", fontWeight: "600" }}>
                    Đăng ký ngay
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Footer */}
            <View style={styles.footerPaws}>
              <Image
                source={require("../assets/images/mew_logo.png")}
                style={styles.footerImage}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </LinearGradient>
  );
}
