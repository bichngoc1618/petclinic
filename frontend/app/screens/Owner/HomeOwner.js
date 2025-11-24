import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Modal,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/HomeOwner";
import BookingPopup from "./bookingPopup";
import axiosClient from "../../api/axiosClient";

export default function HomeOwner({ navigation }) {
  const { user, initializing, logout } = useContext(AuthContext);

  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAppointment, setSelectedAppointment] = useState(null);

  // --- Open/Close booking popup ---
  const openBookingPopup = (service = null) => {
    setSelectedService(service);
    setShowBooking(true);
  };
  const closeBookingPopup = () => {
    setSelectedService(null);
    setShowBooking(false);
  };

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "U";

  const statusLabel = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return { text: "Chờ xác nhận", style: styles.statusWaiting };
      case "TREATING":
        return { text: "Chờ khám", style: styles.statusTreating };
      case "COMPLETED":
        return { text: "Hoàn thành", style: styles.statusCompleted };
      case "CANCELLED":
        return { text: "Đã huỷ", style: styles.statusCancelled };
      default:
        return { text: status || "", style: {} };
    }
  };

  // --- Fetch data ---
  useEffect(() => {
    if (initializing || !user?.token) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("🔹 Fetching pets, appointments, services...");

        // --- fetch từng API để tránh fail toàn bộ ---
        const petRes = await axiosClient
          .get(`/api/pets/owner/${user._id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .catch((err) => {
            console.log(
              "❌ Pets fetch error:",
              err.response?.data || err.message
            );
            return { data: [] };
          });

        const apmRes = await axiosClient
          .get(`/api/appointments/owner/${user._id}`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .catch((err) => {
            console.log(
              "❌ Appointments fetch error:",
              err.response?.data || err.message
            );
            return { data: [] };
          });

        const svcRes = await axiosClient
          .get(`/api/services`, {
            headers: { Authorization: `Bearer ${user.token}` },
          })
          .catch((err) => {
            console.log(
              "❌ Services fetch error:",
              err.response?.data || err.message
            );
            return { data: [] };
          });

        setPets(petRes.data?.data || petRes.data || []);
        setAppointments(apmRes.data?.data || apmRes.data || []);
        setServices(svcRes.data?.data || svcRes.data || []);
      } catch (err) {
        console.log("❌ General fetch error:", err.message);
        Alert.alert("Lỗi", "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initializing, user?.token]);

  if (initializing || !user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Đang tải user...</Text>
      </View>
    );
  }

  // --- Header + Banner + Services + Stats ---
  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user?.name}!</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={28} color="#333" />
          </TouchableOpacity>
          {user?.avatar ? (
            <Image source={{ uri: user.avatar }} style={styles.avatar} />
          ) : (
            <View style={styles.defaultAvatar}>
              <Text style={styles.avatarInitial}>{getInitial(user?.name)}</Text>
            </View>
          )}
        </View>
      </View>

      {/* Banner */}
      <View style={styles.bannerContainer}>
        <View style={styles.bannerCard}>
          <View style={styles.bannerTextBox}>
            <Text style={styles.bannerTitle}>Phòng khám Lamm!</Text>
            <Text style={styles.bannerSlogan}>
              Chăm sóc thú cưng - Tận tâm & An toàn
            </Text>
            <TouchableOpacity
              style={styles.bookButton}
              onPress={openBookingPopup}
            >
              <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Image
          source={require("../../assets/images/banner_owner.png")}
          style={styles.petImage}
          resizeMode="contain"
        />
      </View>

      {/* Services */}
      <Text style={styles.servicesTitle}>Dịch vụ tại phòng khám</Text>
      <View style={styles.servicesList}>
        {services.map((item) => (
          <TouchableOpacity
            key={item._id}
            style={styles.serviceCard}
            onPress={() => openBookingPopup(item)}
          >
            <Image
              source={
                item.icon
                  ? { uri: `${axiosClient.defaults.baseURL}${item.icon}` }
                  : require("../../assets/images/logo.png")
              }
              style={{ width: 40, height: 40, marginBottom: 8 }}
            />
            <Text style={styles.serviceLabel}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Stats */}
      <Text style={styles.servicesTitle}>Thống kê</Text>
      <View style={styles.stats}>
        {pets.length > 0 ? (
          <View style={styles.card}>
            <Ionicons name="paw" style={styles.cardIcon} />
            <Text style={styles.cardNumber}>{pets.length}</Text>
            <Text style={styles.cardLabel}>Thú cưng</Text>
          </View>
        ) : (
          <View style={styles.emptyCardContainer}>
            <Text style={styles.emptyCardText}>Bạn chưa có thú cưng nào</Text>
            <TouchableOpacity
              style={styles.emptyCardButton}
              onPress={openBookingPopup}
            >
              <Text style={styles.emptyCardButtonText}>+ Thêm thú cưng</Text>
            </TouchableOpacity>
          </View>
        )}
        {appointments.length > 0 ? (
          <View style={styles.card}>
            <Ionicons name="calendar" style={styles.cardIcon} />
            <Text style={styles.cardNumber}>{appointments.length}</Text>
            <Text style={styles.cardLabel}>Lịch hẹn</Text>
          </View>
        ) : (
          <View style={styles.emptyCardContainer}>
            <Text style={styles.emptyCardText}>Bạn chưa có lịch hẹn nào</Text>
            <TouchableOpacity
              style={styles.emptyCardButton}
              onPress={openBookingPopup}
            >
              <Text style={styles.emptyCardButtonText}>+ Đặt lịch ngay</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#4c8bf5"
          style={{ marginTop: 20 }}
        />
      )}
    </>
  );

  // --- Render recent appointment ---
  const renderAppointmentItem = ({ item }) => {
    const appointmentDate = new Date(item.date);
    const formattedDate = appointmentDate.toLocaleDateString("vi-VN");
    const formattedTime = appointmentDate.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });

    const serviceNames =
      item.services?.map((s) => s.name).join(", ") || "Không có dịch vụ";
    const petNames =
      item.pets?.map((p) => p.name).join(", ") || "Không có thú cưng";
    const { text: statusText, style: statusStyle } = statusLabel(item.status);

    return (
      <TouchableOpacity
        style={[
          styles.appointmentCard,
          statusStyle.backgroundColor
            ? {
                borderLeftWidth: 5,
                borderLeftColor: statusStyle.backgroundColor,
              }
            : {},
        ]}
        onPress={() => setSelectedAppointment(item)}
      >
        <View style={styles.appointmentRow}>
          <Text style={styles.appointmentPet}>{petNames}</Text>
          <Text style={[styles.status, statusStyle]}>{statusText}</Text>
        </View>
        <Text style={styles.appointmentType}>Dịch vụ: {serviceNames}</Text>
        <Text style={styles.appointmentDate}>
          Ngày: {formattedDate} | Giờ: {formattedTime}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <FlatList
        data={appointments.slice(0, 5)}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        renderItem={renderAppointmentItem}
        contentContainerStyle={{
          padding: 12,
          paddingBottom: 40,
          backgroundColor: "#ecf7ffff",
        }}
      />

      {/* Appointment Modal */}
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

      {/* Booking Popup */}
      <BookingPopup
        visible={showBooking}
        ownerPets={pets}
        setOwnerPets={setPets}
        selectedService={selectedService}
        onClose={closeBookingPopup}
        setAppointments={setAppointments}
      />
    </>
  );
}
