// screens/Doctor/HomeDoctor.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/HomeOwner";
import axiosClient from "../../api/axiosClient";

export default function HomeDoctor() {
  const { user, initializing } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const statusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return { text: "Chờ xác nhận", color: "#f39c12" };
      case "TREATING":
        return { text: "Đang khám", color: "#3498db" };
      case "COMPLETED":
        return { text: "Hoàn thành", color: "#2ecc71" };
      case "CANCELLED":
        return { text: "Đã huỷ", color: "#e74c3c" };
      default:
        return { text: status || "", color: "#333" };
    }
  };

  useEffect(() => {
    if (initializing || !user?.id || !global.authToken) return;

    const fetchAppointments = async () => {
      try {
        setLoading(true);
        const res = await axiosClient.get(
          `/api/appointments/doctor/${user.id}`
        );
        setAppointments(res.data?.data || res.data || []);
      } catch (err) {
        console.log("Fetch error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [initializing, user]);

  if (initializing || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Đang tải thông tin bác sĩ...</Text>
      </View>
    );
  }

  const renderAppointmentItem = ({ item }) => {
    const appointmentDate = new Date(item.date);
    const formattedDate = appointmentDate.toLocaleDateString("vi-VN");
    const formattedTime = appointmentDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const { text: statusText, color } = statusLabel(item.status);
    const petNames =
      (item.pets ?? []).map((p) => p.name).join(", ") || "Không có thú cưng";
    const serviceNames =
      (item.services ?? []).map((s) => s.name).join(", ") || "Không có dịch vụ";

    return (
      <TouchableOpacity
        style={[
          styles.appointmentCard,
          { borderLeftColor: color, borderLeftWidth: 5 },
        ]}
        onPress={() => setSelectedAppointment(item)}
      >
        <Text style={styles.appointmentPet}>{petNames}</Text>
        <Text>Dịch vụ: {serviceNames}</Text>
        <Text>
          Ngày: {formattedDate} | Giờ: {formattedTime}
        </Text>
        <Text style={{ color, fontWeight: "bold" }}>{statusText}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Chào, {user?.name}!</Text>
      <Text style={styles.sectionTitle}>Lịch hẹn sắp tới</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : appointments.length === 0 ? (
        <Text style={{ textAlign: "center", marginTop: 20 }}>
          Bạn chưa có lịch hẹn nào
        </Text>
      ) : (
        <FlatList
          data={appointments.sort(
            (a, b) => new Date(a.date) - new Date(b.date)
          )}
          keyExtractor={(item) => item._id}
          renderItem={renderAppointmentItem}
          contentContainerStyle={{ paddingBottom: 40 }}
        />
      )}

      {/* DETAIL MODAL */}
      <Modal visible={!!selectedAppointment} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Chi tiết lịch hẹn</Text>
            {selectedAppointment && (
              <>
                <Text style={styles.modalLabel}>
                  📅 Ngày giờ:{" "}
                  {new Date(selectedAppointment.date).toLocaleString()}
                </Text>
                <Text style={styles.modalLabel}>
                  🐶 Thú cưng:{" "}
                  {(selectedAppointment.pets ?? [])
                    .map((p) => p.name)
                    .join(", ")}
                </Text>
                <Text style={styles.modalLabel}>
                  🧰 Dịch vụ:{" "}
                  {(selectedAppointment.services ?? [])
                    .map((s) => s.name)
                    .join(", ")}
                </Text>
                <Text style={styles.modalLabel}>
                  🔖 Trạng thái: {statusLabel(selectedAppointment.status).text}
                </Text>
                {selectedAppointment.note && (
                  <Text style={styles.modalLabel}>
                    📝 Ghi chú: {selectedAppointment.note}
                  </Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setSelectedAppointment(null)}
                >
                  <Text style={{ color: "#fff", textAlign: "center" }}>
                    Đóng
                  </Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
}
