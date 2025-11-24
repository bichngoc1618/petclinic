import React, { useState, useContext } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { AuthContext } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";

export default function AssignTaskPopup({
  visible,
  onClose,
  appointment,
  doctors,
  setAppointments,
}) {
  const { user } = useContext(AuthContext); // Lấy token từ context
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);

  const assignDoctor = async () => {
    if (!selectedDoctor) {
      Alert.alert("Thông báo", "Vui lòng chọn bác sĩ trước khi giao task");
      return;
    }
    if (!user?.token) {
      Alert.alert("Unauthorized", "Chưa có token, vui lòng đăng nhập lại");
      return;
    }

    try {
      setLoading(true);
      console.log(
        "⏳ Assigning doctor:",
        selectedDoctor.name,
        "to appointment:",
        appointment._id
      );

      const res = await axiosClient.put(
        `/api/admin/appointments/${appointment._id}/assign-doctor`,
        { doctorId: selectedDoctor._id },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );

      console.log("✅ Assign success:", res.data);

      setAppointments((prev) =>
        prev.map((a) => (a._id === appointment._id ? res.data : a))
      );

      Alert.alert("Thành công", `Đã giao ${selectedDoctor.name} cho lịch hẹn`);
      onClose();
    } catch (err) {
      console.log("❌ Assign error full:", err);
      const message =
        err.response?.data?.message || err.message || "Lỗi không xác định";
      Alert.alert("Lỗi", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Chọn bác sĩ để giao lịch</Text>

          <FlatList
            data={doctors}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={[
                  styles.item,
                  selectedDoctor?._id === item._id && styles.selectedItem,
                ]}
                onPress={() => setSelectedDoctor(item)}
              >
                <Text style={styles.itemText}>{item.name}</Text>
              </TouchableOpacity>
            )}
            style={{ maxHeight: 250 }}
          />

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.btn, styles.cancelBtn]}
              onPress={onClose}
            >
              <Text style={styles.btnText}>Huỷ</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.btn, styles.assignBtn]}
              onPress={assignDoctor}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={[styles.btnText, { color: "#fff" }]}>Giao</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
  },
  item: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginVertical: 4,
  },
  selectedItem: {
    backgroundColor: "#3498db",
    borderColor: "#2980b9",
  },
  itemText: {
    color: "#333",
    fontWeight: "500",
  },
  buttons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 16,
  },
  btn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 6,
    marginLeft: 10,
  },
  cancelBtn: {
    backgroundColor: "#eee",
  },
  assignBtn: {
    backgroundColor: "#3498db",
  },
  btnText: {
    fontWeight: "600",
  },
});
