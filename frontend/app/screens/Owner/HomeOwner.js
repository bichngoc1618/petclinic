// screens/Owner/HomeOwner.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import styles from "../../styles/HomeOwner";
import BookingPopup from "./bookingPopup";
import axios from "axios";

export default function HomeOwner({ navigation }) {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);
  const [selectedService, setSelectedService] = useState(null);

  const SERVER = "http://192.168.5.91:5000";

  const openBookingPopup = (service = null) => {
    setSelectedService(service);
    setShowBooking(true);
  };
  const closeBookingPopup = () => {
    setSelectedService(null);
    setShowBooking(false);
  };

  // 👉 Fetch pets, appointments, services
  useEffect(() => {
    if (!user || !user.id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const [petRes, apmRes, svcRes] = await Promise.all([
          axios.get(`${SERVER}/api/pets/owner/${user.id}`),
          axios.get(`${SERVER}/api/appointments/owner/${user.id}`),
          axios.get(`${SERVER}/api/services`),
        ]);

        setPets(petRes.data);
        setAppointments(apmRes.data);
        setServices(svcRes.data);
        setLoading(false);
      } catch (error) {
        console.log("❌ Error loading:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const getInitial = (name) => name?.charAt(0).toUpperCase() || "U";

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Đang tải user...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* HEADER */}
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

      {/* BANNER */}
      <View style={styles.bannerContainer}>
        <Image
          source={require("../../assets/images/banner_owner.png")}
          style={styles.bannerImage}
          resizeMode="contain"
        />
        <View style={styles.bannerTextBox}>
          <Text style={styles.bannerTitle}>Phòng khám Lamm!</Text>
          <Text style={styles.bannerSlogan}>
            Chăm sóc thú cưng - Tận tâm & An toàn
          </Text>
          <TouchableOpacity
            style={styles.bookButton}
            onPress={() => openBookingPopup()}
          >
            <Text style={styles.bookButtonText}>Đặt lịch ngay</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* SERVICES */}
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
                  ? { uri: `${SERVER}${item.icon}` } // sửa đường dẫn icon
                  : require("../../assets/images/logo.png")
              }
              style={{ width: 40, height: 40, marginBottom: 8 }}
            />
            <Text style={styles.serviceLabel}>{item.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* STATS */}
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

      {/* RECENT APPOINTMENTS */}
      {/* RECENT APPOINTMENTS */}
      {appointments.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>Lịch hẹn gần đây</Text>
          <FlatList
            data={
              appointments
                .sort((a, b) => new Date(b.date) - new Date(a.date)) // sắp xếp mới nhất trước
                .slice(0, 5) // chỉ lấy 5 lịch gần nhất
            }
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => {
              const appointmentDate = new Date(item.date);
              const formattedDate = appointmentDate.toLocaleDateString("vi-VN");
              const formattedTime = appointmentDate.toLocaleTimeString(
                "vi-VN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                }
              );
              const serviceNames =
                item.services?.map((s) => s.name).join(", ") ||
                "Không có dịch vụ";
              const petNames =
                item.pets?.map((p) => p.name).join(", ") || "Không có thú cưng";

              let statusText = "";
              let statusStyle = {};
              if (item.status === "completed") {
                statusText = "Đã hoàn thành";
                statusStyle = styles.statusCompleted;
              } else if (item.status === "pending") {
                statusText = "Chờ xác nhận";
                statusStyle = styles.statusWaiting;
              } else {
                statusText = "Đã tiếp nhận";
                statusStyle = styles.statusTreating;
              }

              return (
                <TouchableOpacity style={styles.appointmentCard}>
                  <View style={styles.appointmentRow}>
                    <Text style={styles.appointmentPet}>{petNames}</Text>
                    <Text style={[styles.status, statusStyle]}>
                      {statusText}
                    </Text>
                  </View>
                  <Text style={styles.appointmentType}>
                    Dịch vụ: {serviceNames}
                  </Text>
                  <Text style={styles.appointmentDate}>
                    Ngày: {formattedDate} | Giờ: {formattedTime}
                  </Text>
                  {item.note && (
                    <Text style={styles.appointmentNote}>
                      Ghi chú: {item.note}
                    </Text>
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </>
      )}

      <View style={{ height: 40 }} />

      {/* BOOKING POPUP */}
      <BookingPopup
        visible={showBooking}
        ownerPets={pets}
        setOwnerPets={setPets}
        selectedService={selectedService}
        onClose={closeBookingPopup}
        setAppointments={setAppointments} // ← truyền trực tiếp
      />
    </ScrollView>
  );
}
