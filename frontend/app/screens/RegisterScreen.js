import React, { useState, useContext } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { AuthContext } from "../context/AuthContext";
import { styles } from "../styles/login"; // sử dụng cùng style với Login

export default function RegisterScreen({ navigation }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "owner",
  });

  const { register } = useContext(AuthContext);
  const [focusedInput, setFocusedInput] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) {
      Alert.alert("Lỗi", "Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      await register(form);
      Alert.alert("Thành công", "Đăng ký tài khoản thành công!");
      navigation.replace("Login");
    } catch (error) {
      Alert.alert("Lỗi", "Không thể đăng ký. Vui lòng thử lại!");
    }
  };

  return (
    <LinearGradient colors={["#dcf1faff", "#f7fff4"]} style={styles.fullScreen}>
      <SafeAreaView style={styles.fullScreen}>
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : undefined}
          style={styles.fullScreen}
        >
          <ScrollView contentContainerStyle={styles.container}>
            {/* Logo và tiêu đề */}
            <View style={styles.centerTop}>
              <Image
                source={require("../assets/images/logo.png")}
                style={styles.logo}
              />
              <Text style={styles.appTitle}>LAmm</Text>
              <Text style={styles.subtitle}>
                Tham gia cùng Lamm - chăm sóc thú cưng
              </Text>
            </View>

            {/* Form */}
            <View style={styles.formCard}>
              <Text style={styles.formTitle}>Tạo tài khoản mới</Text>

              {/* Họ tên */}
              <View
                style={[
                  styles.inputRow,
                  focusedInput === "name" && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="person-outline"
                  size={20}
                  color="#777"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Họ tên"
                  value={form.name}
                  onFocus={() => setFocusedInput("name")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={(val) => setForm({ ...form, name: val })}
                />
              </View>

              {/* Email */}
              <View
                style={[
                  styles.inputRow,
                  focusedInput === "email" && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color="#777"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  keyboardType="email-address"
                  value={form.email}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={(val) => setForm({ ...form, email: val })}
                />
              </View>

              {/* Mật khẩu */}
              <View
                style={[
                  styles.inputRow,
                  focusedInput === "password" && styles.inputFocused,
                ]}
              >
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color="#777"
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Mật khẩu"
                  secureTextEntry={!passwordVisible}
                  value={form.password}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput(null)}
                  onChangeText={(val) => setForm({ ...form, password: val })}
                />
                <TouchableOpacity
                  onPress={() => setPasswordVisible(!passwordVisible)}
                >
                  <Ionicons
                    name={passwordVisible ? "eye-outline" : "eye-off-outline"}
                    size={22}
                    color="#777"
                  />
                </TouchableOpacity>
              </View>

              {/* Nút đăng ký */}
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={handleRegister}
              >
                <Text style={styles.buttonText}>Đăng ký</Text>
              </TouchableOpacity>

              {/* Chuyển sang đăng nhập */}
              <View style={styles.signupRow}>
                <Text>Bạn đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                  <Text style={{ color: "#1976D2", fontWeight: "700" }}>
                    Đăng nhập
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
