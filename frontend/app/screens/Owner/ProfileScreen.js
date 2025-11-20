import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";

export default function ProfileScreen() {
  const { user, setUser } = useContext(AuthContext);
  const [editableUser, setEditableUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    avatar: "",
  });

  const SERVER = "http://192.168.5.46:5000";

  useEffect(() => {
    if (user) setEditableUser({ ...user });
  }, [user]);
  if (!editableUser) return null;

  const openModal = () => {
    setFormData({
      name: editableUser.name || "",
      phone: editableUser.phone || "",
      address: editableUser.address || "",
      avatar: editableUser.avatar || "",
    });
    setModalVisible(true);
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });
    if (!result.canceled)
      setFormData({ ...formData, avatar: result.assets[0].uri });
  };

  const handleSave = async () => {
    if (!formData.name.trim()) return Alert.alert("Họ tên không được để trống");
    if (!user || !user.token)
      return Alert.alert("Không có token, vui lòng đăng nhập lại");

    try {
      setUpdating(true);
      const fd = new FormData();
      fd.append("name", formData.name);
      fd.append("phone", formData.phone || "");
      fd.append("address", formData.address || "");
      if (formData.avatar && !formData.avatar.startsWith("http")) {
        const filename = formData.avatar.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";
        fd.append("avatar", { uri: formData.avatar, name: filename, type });
      }

      const res = await axios.put(
        `${SERVER}/api/users/${editableUser._id}`,
        fd,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setEditableUser(res.data);
      setUser(res.data);
      await AsyncStorage.setItem("user", JSON.stringify(res.data));
      Alert.alert("Cập nhật thành công");
      setModalVisible(false);
    } catch (err) {
      console.error(err);
      Alert.alert("Cập nhật thất bại");
    } finally {
      setUpdating(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.avatarContainer}>
        {editableUser.avatar ? (
          <Image source={{ uri: editableUser.avatar }} style={styles.avatar} />
        ) : (
          <View style={[styles.avatar, styles.avatarPlaceholder]}>
            <Text style={{ fontSize: 40 }}>👤</Text>
          </View>
        )}
        <TouchableOpacity onPress={openModal}>
          <Text style={styles.editAvatarText}>Chỉnh sửa profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Họ và tên</Text>
        <Text style={styles.input}>{editableUser.name}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Email</Text>
        <Text style={styles.input}>{editableUser.email}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Số điện thoại</Text>
        <Text style={styles.input}>{editableUser.phone || "-"}</Text>
      </View>
      <View style={styles.fieldContainer}>
        <Text style={styles.label}>Địa chỉ</Text>
        <Text style={styles.input}>{editableUser.address || "-"}</Text>
      </View>

      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ScrollView>
              <View style={{ alignItems: "center", marginBottom: 20 }}>
                {formData.avatar ? (
                  <Image
                    source={{ uri: formData.avatar }}
                    style={styles.avatar}
                  />
                ) : (
                  <View style={[styles.avatar, styles.avatarPlaceholder]}>
                    <Text style={{ fontSize: 40 }}>👤</Text>
                  </View>
                )}
                <TouchableOpacity onPress={pickImage}>
                  <Text style={styles.editAvatarText}>Thay đổi ảnh</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Họ và tên</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) =>
                    setFormData({ ...formData, name: text })
                  }
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Số điện thoại</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) =>
                    setFormData({ ...formData, phone: text })
                  }
                  keyboardType="phone-pad"
                />
              </View>
              <View style={styles.fieldContainer}>
                <Text style={styles.label}>Địa chỉ</Text>
                <TextInput
                  style={styles.input}
                  value={formData.address}
                  onChangeText={(text) =>
                    setFormData({ ...formData, address: text })
                  }
                />
              </View>

              <View style={{ flexDirection: "row", marginTop: 20 }}>
                <TouchableOpacity
                  style={[styles.saveButton, { flex: 1, marginRight: 8 }]}
                  onPress={handleSave}
                  disabled={updating}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    {updating ? "Đang lưu..." : "Lưu"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.cancelButton, { flex: 1 }]}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={{ fontWeight: "700", textAlign: "center" }}>
                    Hủy
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f8ff", padding: 16 },
  avatarContainer: { alignItems: "center", marginBottom: 20 },
  avatar: { width: 100, height: 100, borderRadius: 50 },
  avatarPlaceholder: {
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  editAvatarText: { color: "#3498db", marginTop: 8, fontWeight: "600" },
  fieldContainer: { marginBottom: 12 },
  label: { fontWeight: "600", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  saveButton: { backgroundColor: "#3498db", padding: 12, borderRadius: 8 },
  cancelButton: { backgroundColor: "#eee", padding: 12, borderRadius: 8 },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  modalContent: {
    width: "100%",
    maxWidth: 400,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
  },
});
