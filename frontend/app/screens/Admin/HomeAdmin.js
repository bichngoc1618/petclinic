import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Image,
  TextInput,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import axiosClient from "../../api/axiosClient";
import styles from "../../styles/HomeAdmin";
import AssignTaskPopup from "./AssignTaskPopup";

export default function HomeAdmin() {
  const { user, initializing, logout } = useContext(AuthContext);

  const [appointments, setAppointments] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [owners, setOwners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [showAssignTask, setShowAssignTask] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  // --- Open/Close popup assign doctor ---
  const openAssignTask = (apm) => {
    setSelectedAppointment(apm);
    setShowAssignTask(true);
  };
  const closeAssignTask = () => {
    setSelectedAppointment(null);
    setShowAssignTask(false);
  };

  // --- Label trạng thái ---
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

  // --- Fetch all data ---
  useEffect(() => {
    if (initializing) return; // chờ AuthContext load xong
    if (!user?.token) {
      console.warn("⚠️ Token chưa sẵn sàng, không fetch");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        console.log("🔹 Fetching appointments, doctors, owners...");

        // --- fetch từng API để tránh fail toàn bộ ---
        const apmRes = await axiosClient
          .get("/api/admin/appointments")
          .catch((err) => {
            console.log(
              "❌ Appointments fetch error:",
              err.response?.data || err.message
            );
            return { data: [] };
          });

        const docRes = await axiosClient
          .get("/api/admin/users?role=doctor")
          .catch((err) => {
            console.log(
              "❌ Doctors fetch error:",
              err.response?.data || err.message
            );
            return { data: [] };
          });

        const ownerRes = await axiosClient
          .get("/api/admin/users?role=owner")
          .catch((err) => {
            console.log(
              "❌ Owners fetch error:",
              err.response?.data || err.message
            );
            return { data: [] };
          });

        console.log("✅ Appointments:", apmRes.data.length);
        console.log("✅ Doctors:", docRes.data.length);
        console.log("✅ Owners:", ownerRes.data.length);

        // log pets
        ownerRes.data.forEach((owner) => {
          console.log(
            `Owner ${owner.name} pets:`,
            owner.pets?.map((p) => p.name) || "No pets"
          );
        });

        setAppointments(apmRes.data || []);
        setDoctors(docRes.data || []);
        setOwners(ownerRes.data || []);
      } catch (err) {
        console.log("❌ Fetch general error:", err.message);
        Alert.alert("Lỗi", "Không thể tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [initializing, user?.token]); // chỉ phụ thuộc token để tránh loop

  // --- Assign doctor ---
  const assignDoctor = async (appointmentId, doctorId) => {
    try {
      const res = await axiosClient.put(
        `/api/admin/appointments/${appointmentId}/assign-doctor`,
        { doctorId }
      );
      setAppointments((prev) =>
        prev.map((apm) => (apm._id === appointmentId ? res.data : apm))
      );
      closeAssignTask();
    } catch (err) {
      console.log("❌ Assign doctor error:", err.response?.data || err.message);
      Alert.alert("Lỗi", err.response?.data?.message || "Không thể gán bác sĩ");
    }
  };

  if (initializing || !user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Đang tải user...</Text>
      </View>
    );
  }

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "A");

  const filteredAppointments = appointments
    .filter((a) =>
      a.owner?.name.toLowerCase().includes(searchText.toLowerCase())
    )
    .filter((a) =>
      statusFilter === "ALL" ? true : a.status.toUpperCase() === statusFilter
    );

  // --- Render header ---
  const renderHeader = () => (
    <>
      <View style={styles.header}>
        <Text style={styles.greeting}>Hi, {user?.name}!</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity style={{ marginRight: 12 }}>
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

      <View style={styles.bannerContainer}>
        <View style={styles.bannerCard}>
          <View style={styles.bannerTextBox}>
            <Text style={styles.bannerTitle}>Quản lý phòng khám</Text>
            <Text style={styles.bannerSlogan}>
              Quản lý lịch hẹn • Bác sĩ • Chủ nuôi
            </Text>
          </View>
        </View>
        <Image
          source={require("../../assets/images/banner_owner.png")}
          style={styles.petImage}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.servicesTitle}>Thống kê nhanh</Text>
      <View style={styles.stats}>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="people-outline" style={styles.cardIcon} />
          <Text style={styles.cardNumber}>{doctors.length}</Text>
          <Text style={styles.cardLabel}>Bác sĩ</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="calendar-outline" style={styles.cardIcon} />
          <Text style={styles.cardNumber}>{appointments.length}</Text>
          <Text style={styles.cardLabel}>Lịch hẹn</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="people-outline" style={styles.cardIcon} />
          <Text style={styles.cardNumber}>{owners.length}</Text>
          <Text style={styles.cardLabel}>Người dùng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card}>
          <Ionicons name="paw-outline" style={styles.cardIcon} />
          <Text style={styles.cardNumber}>
            {owners.reduce((total, u) => total + (u.pets?.length || 0), 0)}
          </Text>
          <Text style={styles.cardLabel}>Lưu trú</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.searchFilterContainer}>
        <TextInput
          placeholder="Tìm kiếm theo tên chủ nuôi..."
          style={styles.searchInput}
          value={searchText}
          onChangeText={setSearchText}
        />
        <View style={styles.filterButtons}>
          {["ALL", "PENDING", "TREATING", "COMPLETED"].map((s) => (
            <TouchableOpacity
              key={s}
              style={[
                styles.filterButton,
                statusFilter === s && styles.filterButtonActive,
              ]}
              onPress={() => setStatusFilter(s)}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  statusFilter === s && styles.filterButtonTextActive,
                ]}
              >
                {s === "ALL"
                  ? "Tất cả"
                  : s === "PENDING"
                  ? "Chờ xác nhận"
                  : s === "TREATING"
                  ? "Chờ khám"
                  : "Hoàn thành"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading && (
        <ActivityIndicator
          size="large"
          color="#4c8bf5"
          style={{ marginTop: 20 }}
        />
      )}

      <Text style={styles.servicesTitle}>Lịch hẹn gần đây</Text>
    </>
  );

  const renderAppointmentItem = ({ item }) => {
    const date = new Date(item.date);
    const { text, style: statusStyle } = statusLabel(item.status);

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
        onPress={() => openAssignTask(item)}
      >
        <View style={styles.appointmentRow}>
          <Text style={styles.appointmentPet}>
            {item.owner?.name || "Chưa có"}
          </Text>
          <Text style={[styles.status, statusStyle]}>{text}</Text>
        </View>
        <Text style={styles.appointmentType}>
          Dịch vụ: {item.services?.map((s) => s.name).join(", ") || "-"}
        </Text>
        <Text style={styles.appointmentDate}>
          Ngày: {date.toLocaleDateString("vi-VN")} • Giờ:{" "}
          {date.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <FlatList
        data={filteredAppointments.slice(0, 5)}
        keyExtractor={(item) => item._id}
        ListHeaderComponent={renderHeader}
        renderItem={renderAppointmentItem}
        contentContainerStyle={{
          padding: 12,
          paddingBottom: 40,
          backgroundColor: "#ecf7ffff",
        }}
      />

      {selectedAppointment && (
        <AssignTaskPopup
          visible={showAssignTask}
          appointment={selectedAppointment}
          doctors={doctors}
          onClose={closeAssignTask}
          setAppointments={setAppointments}
          assignDoctor={assignDoctor}
        />
      )}
    </>
  );
}
