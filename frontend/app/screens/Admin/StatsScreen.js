// screens/Admin/HomeAdmin.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosClient from "../../api/axiosClient";
import styles from "../../styles/HomeOwner"; // dùng lại style cũ

export default function HomeAdmin({ navigation }) {
  const [owners, setOwners] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ownerRes, doctorRes, apmRes] = await Promise.all([
        axiosClient.get("/api/users?role=owner"),
        axiosClient.get("/api/users?role=doctor"),
        axiosClient.get("/api/appointments"),
      ]);

      setOwners(ownerRes.data?.data || []);
      setDoctors(doctorRes.data?.data || []);
      setAppointments(apmRes.data?.data || []);
    } catch (err) {
      console.log("Fetch error:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderHeader = () => (
    <>
      <Text style={styles.servicesTitle}>Thống kê nhanh</Text>
      <View style={styles.stats}>
        <View style={styles.card}>
          <Ionicons name="people-outline" style={styles.cardIcon} />
          <Text style={styles.cardNumber}>{owners.length}</Text>
          <Text style={styles.cardLabel}>Owner</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="medkit-outline" style={styles.cardIcon} />
          <Text style={styles.cardNumber}>{doctors.length}</Text>
          <Text style={styles.cardLabel}>Doctor</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="calendar-outline" style={styles.cardIcon} />
          <Text style={styles.cardNumber}>{appointments.length}</Text>
          <Text style={styles.cardLabel}>Lịch hẹn</Text>
        </View>
        <View style={styles.card}>
          <Ionicons name="list-outline" style={styles.cardIcon} />
          <Text style={styles.cardNumber}>
            {appointments.filter((a) => !a.assignedDoctor).length}
          </Text>
          <Text style={styles.cardLabel}>Task chưa giao</Text>
        </View>
      </View>
    </>
  );

  const renderAppointmentItem = ({ item }) => {
    const appointmentDate = new Date(item.date);
    const formattedDate = appointmentDate.toLocaleDateString("vi-VN");
    const formattedTime = appointmentDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    return (
      <TouchableOpacity
        style={styles.appointmentCard}
        onPress={() => setSelectedAppointment(item)}
      >
        <View style={styles.appointmentRow}>
          <Text style={styles.appointmentPet}>
            {item.owner?.name || "Owner"}
          </Text>
          <Text style={[styles.status, { backgroundColor: "#3498db" }]}>
            {item.assignedDoctor ? "Đã giao" : "Chưa giao"}
          </Text>
        </View>
        <Text style={styles.appointmentType}>
          Dịch vụ: {(item.services ?? []).map((s) => s.name).join(", ")}
        </Text>
        <Text style={styles.appointmentDate}>
          Ngày: {formattedDate} | Giờ: {formattedTime}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={{ flex: 1, padding: 12 }}>
      {loading ? (
        <ActivityIndicator size="large" color="#3498db" />
      ) : (
        <FlatList
          data={appointments.slice(0, 5)}
          keyExtractor={(item) => item._id}
          ListHeaderComponent={renderHeader}
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
                  🐶 Owner: {selectedAppointment.owner?.name}
                </Text>
                <Text style={styles.modalLabel}>
                  🧰 Dịch vụ:{" "}
                  {(selectedAppointment.services ?? [])
                    .map((s) => s.name)
                    .join(", ")}
                </Text>
                <Text style={styles.modalLabel}>
                  🔖 Trạng thái:{" "}
                  {selectedAppointment.assignedDoctor ? "Đã giao" : "Chưa giao"}
                </Text>
                <TouchableOpacity
                  style={[styles.cancelButton, { marginTop: 20 }]}
                  onPress={() => setSelectedAppointment(null)}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
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
