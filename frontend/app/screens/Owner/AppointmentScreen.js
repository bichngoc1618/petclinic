// screens/Owner/AppointmentScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  TouchableWithoutFeedback,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import BookingPopup from "./bookingPopup";
import axios from "axios";
import styles from "../../styles/AppointmentOwner";

export default function AppointmentScreen() {
  const { user } = useContext(AuthContext);
  const [appointments, setAppointments] = useState([]);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("PENDING");
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [confirmCancelVisible, setConfirmCancelVisible] = useState(false);
  const [appointmentToCancel, setAppointmentToCancel] = useState(null);
  const [showBooking, setShowBooking] = useState(false);

  const statuses = ["PENDING", "TREATING", "COMPLETED", "CANCELLED"];
  const SERVER = "http://192.168.5.46:5000";

  // --- Fetch appointments & pets
  const fetchAppointments = async () => {
    if (!user || !user.id) return;
    try {
      setLoading(true);
      const [apmRes, petRes] = await Promise.all([
        axios.get(`${SERVER}/api/appointments/owner/${user.id}`),
        axios.get(`${SERVER}/api/pets/owner/${user.id}`),
      ]);
      setAppointments(apmRes.data ?? []);
      setPets(petRes.data ?? []);
    } catch (error) {
      console.log("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const filteredAppointments =
    selectedStatus === "ALL"
      ? appointments
      : appointments.filter(
          (app) => app.status.toUpperCase() === selectedStatus
        );

  const openBookingPopup = () => setShowBooking(true);
  const closeBookingPopup = () => setShowBooking(false);

  const openConfirmCancel = (appointment) => {
    setAppointmentToCancel(appointment);
    setConfirmCancelVisible(true);
  };

  const handleConfirmCancel = async () => {
    if (!appointmentToCancel) return;
    try {
      // Huỷ trên server
      await axios.put(
        `${SERVER}/api/appointments/${appointmentToCancel._id}/cancel`
      );

      // Cập nhật state local
      setAppointments((prev) =>
        prev.map((a) =>
          a._id === appointmentToCancel._id ? { ...a, status: "CANCELLED" } : a
        )
      );
    } catch (error) {
      console.log("Cancel error:", error);
    } finally {
      setConfirmCancelVisible(false);
      setAppointmentToCancel(null);
      setSelectedAppointment(null);
    }
  };

  const statusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return "Chờ xác nhận";
      case "TREATING":
        return "Chờ khám";
      case "COMPLETED":
        return "Hoàn thành";
      case "CANCELLED":
        return "Đã huỷ";
      default:
        return status || "";
    }
  };

  if (loading)
    return <ActivityIndicator size="large" style={{ marginTop: 50 }} />;

  return (
    <View style={styles.container}>
      {/* Header + Add Button */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 12,
        }}
      >
        <Text style={{ fontSize: 20, fontWeight: "700", color: "#4A90E2" }}>
          Danh sách lịch hẹn
        </Text>
        <TouchableOpacity
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            backgroundColor: "#4CAF50",
            alignItems: "center",
            justifyContent: "center",
          }}
          onPress={openBookingPopup}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        {statuses.map((status, idx) => {
          const isSelected = status === selectedStatus;
          return (
            <TouchableOpacity
              key={idx}
              style={{
                flex: 1,
                paddingVertical: 8,
                marginHorizontal: 4,
                borderRadius: 8,
                backgroundColor: isSelected ? "#4A90E2" : "#E0E0E0",
                alignItems: "center",
              }}
              onPress={() => setSelectedStatus(status)}
            >
              <Text
                style={{
                  color: isSelected ? "#fff" : "#333",
                  fontWeight: "600",
                  fontSize: 12,
                  textAlign: "center",
                }}
              >
                {statusLabel(status)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Appointments List */}
      <ScrollView style={{ marginTop: 10 }}>
        {filteredAppointments.map((app) => {
          const appDate = new Date(app.date);
          const startHour = appDate.getHours();
          const endHour = startHour + 1;
          return (
            <TouchableOpacity
              key={app._id}
              style={styles.timelineCard}
              onPress={() => setSelectedAppointment(app)}
            >
              <Text style={styles.timeLabel}>
                {`${startHour}:00 - ${endHour}:00`}
              </Text>
              <View style={styles.timelineContent}>
                <Text style={styles.timelineTitle}>
                  📅 {appDate.toLocaleDateString()}
                </Text>
                <Text style={styles.timelineTitle}>
                  🧰 {(app.services ?? []).map((s) => s.name).join(", ")}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Detail Modal */}
      {/* Detail Modal */}
      {selectedAppointment && (
        <Modal visible transparent animationType="fade">
          <TouchableWithoutFeedback
            onPress={() => setSelectedAppointment(null)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent, { width: "90%" }]}>
                  <Text style={styles.modalTitle}>Chi tiết lịch hẹn</Text>
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
                    🔖 Trạng thái: {statusLabel(selectedAppointment.status)}
                  </Text>

                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    {/* Chỉ hiện nút Huỷ nếu chưa huỷ */}
                    {selectedAppointment.status !== "CANCELLED" && (
                      <TouchableOpacity
                        style={[
                          styles.cancelButton,
                          {
                            flex: 1,
                            marginRight: 8,
                            backgroundColor: "#FF4D4F",
                          },
                        ]}
                        onPress={() => openConfirmCancel(selectedAppointment)}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontWeight: "700",
                            textAlign: "center",
                          }}
                        >
                          Huỷ lịch
                        </Text>
                      </TouchableOpacity>
                    )}
                    <TouchableOpacity
                      style={[styles.cancelButton, { flex: 1 }]}
                      onPress={() => setSelectedAppointment(null)}
                    >
                      <Text style={{ fontWeight: "700", textAlign: "center" }}>
                        Đóng
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {/* Confirm Cancel Modal */}
      {confirmCancelVisible && appointmentToCancel && (
        <Modal visible transparent animationType="fade">
          <TouchableWithoutFeedback
            onPress={() => setConfirmCancelVisible(false)}
          >
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0,0,0,0.5)",
              }}
            >
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent, { width: "80%" }]}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "700",
                      marginBottom: 20,
                      textAlign: "center",
                    }}
                  >
                    Xác nhận huỷ lịch hẹn?
                  </Text>
                  <View style={{ flexDirection: "row" }}>
                    <TouchableOpacity
                      style={[
                        styles.cancelButton,
                        { flex: 1, marginRight: 8, backgroundColor: "#FF4D4F" },
                      ]}
                      onPress={handleConfirmCancel}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontWeight: "700",
                          textAlign: "center",
                        }}
                      >
                        Xác nhận
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[styles.cancelButton, { flex: 1 }]}
                      onPress={() => setConfirmCancelVisible(false)}
                    >
                      <Text style={{ fontWeight: "700", textAlign: "center" }}>
                        Hủy
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}

      {/* Booking Popup */}
      <BookingPopup
        visible={showBooking}
        ownerPets={pets}
        setOwnerPets={setPets}
        selectedService={null}
        onClose={() => {
          closeBookingPopup();
          fetchAppointments();
        }}
        setAppointments={setAppointments}
      />
    </View>
  );
}
