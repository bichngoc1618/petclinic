import React, { useState, useContext, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ActivityIndicator,
  ScrollView,
  Alert,
  Modal,
  Animated,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

// === Floating Label Input ===
function FloatingLabelInput({ label, value, onChangeText, ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute",
    left: 12,
    color: "#3f51b5",
    fontWeight: "500",
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -6],
    }),
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 4,
    zIndex: 1,
  };

  const borderColor = isFocused ? "#3f51b5" : "#90caf9";

  return (
    <View style={{ marginVertical: 10, position: "relative" }}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <TextInput
        style={{
          height: 50,
          fontSize: 16,
          paddingHorizontal: 12,
          paddingTop: 18,
          paddingBottom: 6,
          borderWidth: 1.5,
          borderRadius: 12,
          backgroundColor: "#e3f2fd",
          color: "#1a237e",
          borderColor,
        }}
        value={value}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        {...props}
      />
    </View>
  );
}

// === Profile Screen ===
export default function ProfileScreen() {
  const apiBase = "http://192.168.5.46:5000";
  const { user, setUser } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    avatar: "",
    _webFile: null,
  });
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const fileInputRef = useRef(null);

  // Load info khi mở màn hình
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        address: user.address || "",
        avatar:
          user.avatar?.startsWith("http") || !user.avatar
            ? user.avatar || ""
            : `${apiBase}${user.avatar}`,
        _webFile: null,
      });
    }
  }, [user]);

  // Chọn ảnh
  const pickImage = async () => {
    try {
      if (Platform.OS === "web") {
        fileInputRef.current.click();
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 0.7,
      });
      if (!result.canceled && result.assets?.length > 0) {
        setFormData({ ...formData, avatar: result.assets[0].uri });
      }
    } catch (error) {
      console.error("Error picking image:", error);
    }
  };

  const handleWebFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        avatar: URL.createObjectURL(file),
        _webFile: file,
      });
    }
  };

  const handleSave = async () => {
    if (!user?.token) return Alert.alert("Error", "User chưa sẵn sàng");
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", formData.name);
      data.append("email", formData.email);
      data.append("phone", formData.phone);
      data.append("address", formData.address);

      if (Platform.OS === "web" && formData._webFile) {
        data.append("avatar", formData._webFile);
      } else if (formData.avatar && Platform.OS !== "web") {
        if (!formData.avatar.startsWith("http")) {
          const uriParts = formData.avatar.split(".");
          const fileType = uriParts[uriParts.length - 1];
          data.append("avatar", {
            uri: formData.avatar,
            name: `avatar.${fileType}`,
            type: `image/${fileType}`,
          });
        }
      }

      const res = await axios.put(`${apiBase}/api/users/me`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${user.token}`,
        },
      });

      const resData = res.data;
      const updatedUser = {
        ...user,
        name: resData.name ?? user.name,
        email: resData.email ?? user.email,
        phone: resData.phone ?? user.phone,
        address: resData.address ?? user.address,
        avatar:
          resData.avatar?.startsWith("http") || !resData.avatar
            ? resData.avatar || user.avatar
            : `${apiBase}${resData.avatar}`,
      };

      setUser({ ...updatedUser, token: user.token });
      setFormData({
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        address: updatedUser.address,
        avatar: updatedUser.avatar,
        _webFile: null,
      });

      Alert.alert("Thành công", "Thông tin đã được cập nhật!", [
        { text: "OK", onPress: () => setModalVisible(false) },
      ]);
    } catch (err) {
      Alert.alert(
        "Error",
        err.response?.data?.message || err.message || "Unknown error"
      );
    } finally {
      setLoading(false);
    }
  };

  const renderAvatar = () => {
    if (!formData.avatar) {
      const initial = formData.name
        ? formData.name.charAt(0).toUpperCase()
        : "?";
      return (
        <View
          style={{
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: "#3f51b5",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: 10,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 40 }}>{initial}</Text>
        </View>
      );
    }
    return (
      <Image
        source={{ uri: formData.avatar }}
        style={{
          width: 160,
          height: 160,
          borderRadius: 50,
          marginBottom: 10,
        }}
        onError={() => setFormData({ ...formData, avatar: "" })}
      />
    );
  };

  return (
    <ScrollView
      contentContainerStyle={{
        padding: 20,
        backgroundColor: "#e3f2fd",
      }}
    >
      {/* Nút chỉnh sửa ở góc phải trên màn hình */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
          marginBottom: 10,
        }}
      >
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={{
            padding: 8,
            backgroundColor: "#5097e8ff",
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontWeight: "600" }}>Chỉnh sửa</Text>
        </TouchableOpacity>
      </View>

      {/* Thông tin user hiển thị giống form */}
      <TouchableOpacity onPress={pickImage} style={{ alignSelf: "center" }}>
        {renderAvatar()}
      </TouchableOpacity>
      {Platform.OS === "web" && (
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          onChange={handleWebFile}
          style={{ display: "none" }}
        />
      )}

      <FloatingLabelInput
        label="Tên"
        value={formData.name}
        onChangeText={(text) => setFormData({ ...formData, name: text })}
      />
      <FloatingLabelInput
        label="Email"
        value={formData.email}
        keyboardType="email-address"
        onChangeText={(text) => setFormData({ ...formData, email: text })}
      />
      <FloatingLabelInput
        label="Số điện thoại"
        value={formData.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => setFormData({ ...formData, phone: text })}
      />
      <FloatingLabelInput
        label="Địa chỉ"
        value={formData.address}
        onChangeText={(text) => setFormData({ ...formData, address: text })}
      />

      {loading && (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginVertical: 15 }}
        />
      )}

      {/* Modal chỉnh sửa ảnh và thông tin */}
      <Modal visible={modalVisible} animationType="slide" transparent={true}>
        <View
          style={{
            flex: 1,
            backgroundColor: "rgba(0,0,0,0.55)",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <View
            style={{
              backgroundColor: "#e3f2fd",
              padding: 20,
              borderRadius: 16,
              maxHeight: "85%",
            }}
          >
            <TouchableOpacity
              onPress={pickImage}
              style={{ alignSelf: "center", marginBottom: 15 }}
            >
              {renderAvatar()}
            </TouchableOpacity>

            <FloatingLabelInput
              label="Tên"
              value={formData.name}
              onChangeText={(text) => setFormData({ ...formData, name: text })}
            />
            <FloatingLabelInput
              label="Email"
              value={formData.email}
              keyboardType="email-address"
              onChangeText={(text) => setFormData({ ...formData, email: text })}
            />
            <FloatingLabelInput
              label="Số điện thoại"
              value={formData.phone}
              keyboardType="phone-pad"
              onChangeText={(text) => setFormData({ ...formData, phone: text })}
            />
            <FloatingLabelInput
              label="Địa chỉ"
              value={formData.address}
              onChangeText={(text) =>
                setFormData({ ...formData, address: text })
              }
            />

            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 15,
              }}
            >
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{
                  flex: 1,
                  marginRight: 10,
                  padding: 12,
                  backgroundColor: "#b0bec5",
                  borderRadius: 10,
                  alignItems: "center",
                }}
                disabled={loading}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Hủy</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={handleSave}
                style={{
                  flex: 1,
                  marginLeft: 10,
                  padding: 12,
                  backgroundColor: "#3f51b5",
                  borderRadius: 10,
                  alignItems: "center",
                }}
                disabled={loading}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Lưu</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
