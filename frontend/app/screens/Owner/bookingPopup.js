// screens/Owner/BookingPopup.js
import React, { useState, useEffect, useContext } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Modal,
  ScrollView,
  Platform,
  StyleSheet,
} from "react-native";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import AddPetPopup from "./addPetPopup";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function BookingPopup({
  visible,
  onClose,
  ownerPets = [],
  setAppointments,
}) {
  const { user } = useContext(AuthContext);

  const [services, setServices] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedPets, setSelectedPets] = useState([]);
  const [selectedServices, setSelectedServices] = useState([]);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showAddPet, setShowAddPet] = useState(false);

  const SERVER = "http://192.168.5.46:5000";

  // --- Lấy danh sách service từ backend khi popup mở ---
  useEffect(() => {
    if (visible) {
      axios
        .get(`${SERVER}/api/services`)
        .then((res) => setServices(res.data))
        .catch((err) => console.error("❌ Lỗi lấy dịch vụ:", err));
    }
  }, [visible]);

  // Toggle chọn pet
  const togglePet = (petId) => {
    setSelectedPets((prev) =>
      prev.includes(petId)
        ? prev.filter((id) => id !== petId)
        : [...prev, petId]
    );
  };

  // Toggle chọn service
  const toggleService = (serviceId) => {
    setSelectedServices((prev) =>
      prev.includes(serviceId)
        ? prev.filter((id) => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  // Khi thêm pet mới
  const handleAddPet = (newPet) => {
    ownerPets.push(newPet);
    setSelectedPets([...selectedPets, newPet._id]);
  };

  const today = new Date();
  const after17h = today.getHours() >= 17;
  const minDate = after17h
    ? new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
    : today;

  const canConfirm =
    selectedDate &&
    selectedTime &&
    selectedPets.length > 0 &&
    selectedServices.length > 0;

  // --- Gửi lịch lên backend ---
  const handleConfirm = async () => {
    try {
      if (!user || !user.id) throw new Error("User chưa đăng nhập");

      const dateTime = new Date(
        selectedDate.getFullYear(),
        selectedDate.getMonth(),
        selectedDate.getDate(),
        selectedTime.getHours(),
        selectedTime.getMinutes()
      );

      const res = await axios.post(`${SERVER}/api/appointments`, {
        date: dateTime,
        pets: selectedPets,
        services: selectedServices,
        owner: user.id,
      });

      // 🔹 Cập nhật appointments trực tiếp ở HomeOwner
      if (setAppointments) {
        setAppointments((prev) => [res.data, ...prev]);
      }

      onClose();
    } catch (error) {
      console.error("❌ Lỗi đặt lịch:", error);
      alert("Đặt lịch thất bại!");
    }
  };

  if (!visible) return null;

  return (
    <Modal transparent animationType="fade" visible={visible}>
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Đặt lịch chăm sóc thú cưng</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* --- Chọn ngày --- */}
            <Text style={styles.label}>Chọn ngày:</Text>
            {Platform.OS === "web" ? (
              <input
                type="date"
                min={minDate.toISOString().split("T")[0]}
                value={
                  selectedDate ? selectedDate.toISOString().split("T")[0] : ""
                }
                onChange={(e) => setSelectedDate(new Date(e.target.value))}
                style={styles.webInput}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.inputButton}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text>
                    {selectedDate ? selectedDate.toDateString() : "Chọn ngày"}
                  </Text>
                </TouchableOpacity>
                <DatePickerModal
                  mode="single"
                  visible={showDatePicker}
                  onDismiss={() => setShowDatePicker(false)}
                  date={selectedDate || minDate}
                  onConfirm={(params) => {
                    setSelectedDate(params.date);
                    setShowDatePicker(false);
                  }}
                  validRange={{ startDate: minDate }}
                />
              </>
            )}

            {/* --- Chọn giờ --- */}
            <Text style={styles.label}>Chọn giờ:</Text>
            {Platform.OS === "web" ? (
              <input
                type="time"
                value={
                  selectedTime
                    ? `${selectedTime
                        .getHours()
                        .toString()
                        .padStart(2, "0")}:${selectedTime
                        .getMinutes()
                        .toString()
                        .padStart(2, "0")}`
                    : ""
                }
                onChange={(e) => {
                  const [h, m] = e.target.value.split(":");
                  const time = new Date();
                  time.setHours(parseInt(h), parseInt(m));
                  setSelectedTime(time);
                }}
                style={styles.webInput}
              />
            ) : (
              <>
                <TouchableOpacity
                  style={styles.inputButton}
                  onPress={() => setShowTimePicker(true)}
                >
                  <Text>
                    {selectedTime
                      ? `${selectedTime
                          .getHours()
                          .toString()
                          .padStart(2, "0")}:${selectedTime
                          .getMinutes()
                          .toString()
                          .padStart(2, "0")}`
                      : "Chọn giờ"}
                  </Text>
                </TouchableOpacity>
                <TimePickerModal
                  visible={showTimePicker}
                  onDismiss={() => setShowTimePicker(false)}
                  onConfirm={(params) => {
                    const time = new Date();
                    time.setHours(params.hours, params.minutes);
                    setSelectedTime(time);
                    setShowTimePicker(false);
                  }}
                  hours={selectedTime ? selectedTime.getHours() : 9}
                  minutes={selectedTime ? selectedTime.getMinutes() : 0}
                />
              </>
            )}

            {/* --- Chọn dịch vụ --- */}
            <Text style={styles.label}>Chọn dịch vụ:</Text>
            {services.length > 0 ? (
              services.map((sv) => (
                <TouchableOpacity
                  key={sv._id}
                  style={[
                    styles.serviceButton,
                    selectedServices.includes(sv._id) && styles.serviceSelected,
                  ]}
                  onPress={() => toggleService(sv._id)}
                >
                  <Text
                    style={{
                      color: selectedServices.includes(sv._id)
                        ? "white"
                        : "#007AFF",
                    }}
                  >
                    {sv.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>Đang tải dịch vụ...</Text>
            )}

            {/* --- Chọn thú cưng --- */}
            <Text style={styles.label}>Chọn thú cưng:</Text>
            {ownerPets.length > 0 ? (
              ownerPets.map((pet) => (
                <TouchableOpacity
                  key={pet._id}
                  style={[
                    styles.petButton,
                    selectedPets.includes(pet._id) && styles.petSelected,
                  ]}
                  onPress={() => togglePet(pet._id)}
                >
                  <Text
                    style={{
                      color: selectedPets.includes(pet._id)
                        ? "white"
                        : "#007AFF",
                    }}
                  >
                    {pet.name}
                  </Text>
                </TouchableOpacity>
              ))
            ) : (
              <Text>Chưa có thú cưng nào</Text>
            )}

            <TouchableOpacity
              style={styles.addPetButton}
              onPress={() => setShowAddPet(true)}
            >
              <Text style={styles.addPetText}>＋</Text>
            </TouchableOpacity>
          </ScrollView>

          <TouchableOpacity
            style={[
              styles.confirmButton,
              !canConfirm && { backgroundColor: "#ccc" },
            ]}
            disabled={!canConfirm}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmText}>Xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
            <Text style={styles.cancelText}>Đóng</Text>
          </TouchableOpacity>
        </View>

        <AddPetPopup
          visible={showAddPet}
          onClose={() => setShowAddPet(false)}
          onAddPet={handleAddPet}
        />
      </View>
    </Modal>
  );
}

// --- Styles giữ nguyên ---
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    justifyContent: "center",
    padding: 20,
  },
  popup: {
    backgroundColor: "#E6F7FF",
    padding: 20,
    borderRadius: 16,
    maxHeight: "85%",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#007AFF",
    marginBottom: 10,
    textAlign: "center",
  },
  label: { fontSize: 16, fontWeight: "bold", marginTop: 15 },
  inputButton: {
    padding: 10,
    backgroundColor: "white",
    borderRadius: 8,
    marginTop: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
  },
  webInput: {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #007AFF",
    marginTop: 8,
    marginBottom: 10,
  },
  petButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
    alignItems: "center",
  },
  petSelected: { backgroundColor: "#007AFF" },
  addPetButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#00C851",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 10,
  },
  addPetText: { fontSize: 30, color: "white" },
  serviceButton: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#007AFF",
    alignItems: "center",
  },
  serviceSelected: { backgroundColor: "#007AFF" },
  confirmButton: {
    marginTop: 15,
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 10,
  },
  confirmText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    marginTop: 10,
    backgroundColor: "#FF6FA8",
    padding: 12,
    borderRadius: 10,
  },
  cancelText: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
    fontWeight: "bold",
  },
});
