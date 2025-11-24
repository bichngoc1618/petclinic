import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  Image,
  Alert,
  Modal,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import axiosClient from "../../api/axiosClient";
import { AuthContext } from "../../context/AuthContext";

export default function UsersManagement() {
  const { user } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const getRoleName = (role) => {
    if (!role) return "UNKNOWN";
    if (typeof role === "string") return role.toUpperCase();
    return role.name?.toUpperCase() || "UNKNOWN";
  };

  const fetchUsers = async (role) => {
    if (!user?.token) return;
    setLoading(true);
    try {
      let url = "/api/admin/users";
      if (role === "owner" || role === "doctor") url += `?role=${role}`;
      else if (role === "all") url = "/api/admin/users/all";

      const res = await axiosClient.get(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.log(err.response?.data || err.message);
      Alert.alert(
        "Lỗi",
        err.response?.data?.message || "Không thể tải dữ liệu"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(roleFilter);
  }, [user, roleFilter]);

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchText.toLowerCase())
  );

  const getInitial = (name) => (name ? name.charAt(0).toUpperCase() : "U");

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setModalVisible(true);
  };

  const handleChangeRole = async (newRole) => {
    try {
      await axiosClient.put(
        `/api/admin/users/${selectedUser._id}/role`,
        { roleName: newRole }, // <-- đây mới đúng
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      Alert.alert("Thành công", "Đổi role thành công");
      fetchUsers(roleFilter);
      setModalVisible(false);
    } catch (err) {
      Alert.alert("Lỗi", err.response?.data?.message || "Không thể đổi role");
    }
  };

  const handleBanUser = async () => {
    try {
      await axiosClient.delete(`/api/admin/users/${selectedUser._id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      Alert.alert("Thành công", "Đã ban tài khoản này");
      fetchUsers(roleFilter);
      setModalVisible(false);
    } catch (err) {
      Alert.alert("Lỗi", err.response?.data?.message || "Không thể ban user");
    }
  };

  const renderItem = ({ item }) => {
    const roleName = getRoleName(item.role);

    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          {item.avatar ? (
            <Image
              source={{
                uri: item.avatar.startsWith("http")
                  ? item.avatar
                  : `http://192.168.5.46:5000${item.avatar}`,
              }}
              style={styles.avatarImage}
            />
          ) : (
            <View style={styles.avatarContainer}>
              <Text style={styles.avatarText}>{getInitial(item.name)}</Text>
            </View>
          )}
          <View style={styles.info}>
            <Text style={styles.name}>{item.name}</Text>
            <Text style={styles.email}>{item.email}</Text>
            <Text style={styles.phone}>
              {item.phone || "Chưa có số điện thoại"}
            </Text>
            <Text style={styles.role}>{roleName}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          {["OWNER", "DOCTOR"].includes(roleName) && (
            <TouchableOpacity
              style={styles.btn}
              onPress={() => handleOpenModal(item)}
            >
              <Text style={styles.btnText}>Xem chi tiết</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Quản lý người dùng</Text>

      {/* Search & filter */}
      <View style={styles.searchFilter}>
        <View style={styles.searchBox}>
          <Ionicons name="search-outline" size={20} color="#999" />
          <TextInput
            placeholder="Tìm kiếm theo tên hoặc email..."
            style={styles.searchInput}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>

        <View style={styles.filterButtons}>
          {["all", "owner", "doctor"].map((role) => (
            <TouchableOpacity
              key={role}
              style={[
                styles.filterBtn,
                roleFilter === role && styles.filterBtnActive,
              ]}
              onPress={() => setRoleFilter(role)}
            >
              <Text
                style={[
                  styles.filterText,
                  roleFilter === role && styles.filterTextActive,
                ]}
              >
                {role === "all"
                  ? "Tất cả"
                  : role === "owner"
                  ? "Người dùng"
                  : "Bác sĩ"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#3498db"
          style={{ marginTop: 20 }}
        />
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#555" }}>
              Không có người dùng
            </Text>
          }
        />
      )}

      {/* Modal popup */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <ScrollView contentContainerStyle={{ padding: 16 }}>
            {/* Nút đóng */}
            <TouchableOpacity
              style={styles.closeBtn}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeBtnText}>Đóng ✖</Text>
            </TouchableOpacity>

            {selectedUser && (
              <>
                {/* Thông tin cơ bản */}
                <View style={styles.userHeader}>
                  {selectedUser.avatar ? (
                    <Image
                      source={{
                        uri: selectedUser.avatar.startsWith("http")
                          ? selectedUser.avatar
                          : `http://192.168.5.46:5000${selectedUser.avatar}`,
                      }}
                      style={styles.userAvatar}
                    />
                  ) : (
                    <View style={styles.avatarPlaceholder}>
                      <Text style={styles.avatarInitial}>
                        {selectedUser.name?.charAt(0).toUpperCase() || "U"}
                      </Text>
                    </View>
                  )}
                  <View style={{ marginLeft: 12, flex: 1 }}>
                    <Text style={styles.userName}>{selectedUser.name}</Text>
                    <Text style={styles.userEmail}>{selectedUser.email}</Text>
                    <Text style={styles.userPhone}>
                      {selectedUser.phone || "Chưa có số điện thoại"}
                    </Text>
                    <Text style={styles.userRole}>
                      Role: {getRoleName(selectedUser.role)}
                    </Text>
                  </View>
                </View>

                {/* Thông tin owner */}
                {getRoleName(selectedUser.role) === "OWNER" && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>Danh sách pet:</Text>
                    {selectedUser.pets?.map((p) => (
                      <Text key={p._id} style={styles.infoText}>
                        - {p.name} ({p.species}, {p.age} tuổi)
                      </Text>
                    ))}
                    <Text style={styles.infoText}>
                      Số lịch hẹn: {selectedUser.appointments?.length || 0}
                    </Text>
                  </View>
                )}

                {/* Thông tin doctor */}
                {getRoleName(selectedUser.role) === "DOCTOR" && (
                  <View style={styles.infoSection}>
                    <Text style={styles.infoTitle}>
                      Lịch hẹn đang đảm nhận:
                    </Text>
                    {selectedUser.activeAppointments?.map((a) => (
                      <Text key={a._id} style={styles.infoText}>
                        - {a.petName} ({a.date})
                      </Text>
                    ))}
                    <Text style={styles.infoTitle}>
                      Lịch hẹn đã hoàn thành:
                    </Text>
                    {selectedUser.completedAppointments?.map((a) => (
                      <Text key={a._id} style={styles.infoText}>
                        - {a.petName} ({a.date})
                      </Text>
                    ))}
                  </View>
                )}

                {/* Chọn role */}
                <Text style={styles.changeRoleTitle}>Đổi role:</Text>
                <View style={styles.roleButtonsContainer}>
                  {["OWNER", "DOCTOR", "ADMIN"].map((r) => (
                    <TouchableOpacity
                      key={r}
                      style={[
                        styles.roleBtn,
                        getRoleName(selectedUser.role) === r
                          ? styles.roleBtnActive
                          : {},
                      ]}
                      onPress={() => handleChangeRole(r.toLowerCase())}
                    >
                      <Text style={styles.roleBtnText}>{r}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                {/* Ban user */}
                <TouchableOpacity
                  style={[styles.banBtn]}
                  onPress={handleBanUser}
                >
                  <Text style={styles.btnText}>Ban account</Text>
                </TouchableOpacity>
              </>
            )}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}

// ... giữ nguyên styles cũ

const styles = StyleSheet.create({
  // --- Container chính ---
  container: { flex: 1, padding: 16, backgroundColor: "#f2f3f7" },
  title: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 16,
    color: "#2c3e50",
  },

  // --- Search + Filter ---
  searchFilter: { marginBottom: 12 },
  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  searchInput: { flex: 1, marginLeft: 8, fontSize: 16, color: "#333" },
  filterButtons: { flexDirection: "row", marginTop: 10 },
  filterBtn: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    backgroundColor: "#ecf0f1",
    borderRadius: 8,
    marginRight: 8,
  },
  filterBtnActive: { backgroundColor: "#3498db" },
  filterText: { color: "#333" },
  filterTextActive: { color: "#fff" },

  // --- Card user ---
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 14,
    marginVertical: 6,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardHeader: { flexDirection: "row", alignItems: "center" },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: { color: "#fff", fontWeight: "700", fontSize: 18 },
  avatarImage: { width: 50, height: 50, borderRadius: 25 },
  info: { marginLeft: 12, flex: 1 },
  name: { fontSize: 16, fontWeight: "600", color: "#2c3e50" },
  email: { fontSize: 14, color: "#7f8c8d" },
  phone: { fontSize: 13, color: "#95a5a6" },
  role: { fontSize: 13, color: "#3498db", marginTop: 2 },
  cardFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },

  // --- Nút chung ---
  btn: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    backgroundColor: "#3498db",
    borderRadius: 8,
    alignItems: "center",
  },
  btnText: { color: "#fff", fontWeight: "600" },

  // --- Modal ---
  modalContainer: { flex: 1, backgroundColor: "#f5f6fa" },
  closeBtn: { alignSelf: "flex-end", marginBottom: 12 },
  closeBtnText: { fontSize: 18, color: "#e74c3c", fontWeight: "600" },

  userHeader: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  userAvatar: { width: 60, height: 60, borderRadius: 30 },
  avatarPlaceholder: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#3498db",
    justifyContent: "center",
    alignItems: "center",
  },
  avatarInitial: { color: "#fff", fontSize: 22, fontWeight: "700" },
  userName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 2,
    color: "#2c3e50",
  },
  userEmail: { fontSize: 14, color: "#7f8c8d" },
  userPhone: { fontSize: 14, color: "#7f8c8d" },
  userRole: { fontSize: 14, color: "#2ecc71", marginTop: 2 },

  infoSection: {
    marginTop: 12,
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  infoTitle: {
    fontWeight: "600",
    marginBottom: 6,
    fontSize: 15,
    color: "#34495e",
  },
  infoText: { fontSize: 14, color: "#555", marginLeft: 8, marginBottom: 2 },

  changeRoleTitle: {
    marginTop: 18,
    fontWeight: "600",
    fontSize: 16,
    color: "#2c3e50",
  },
  roleButtonsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
  },
  roleBtn: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: "#3498db",
    borderRadius: 8,
    marginRight: 10,
    marginBottom: 10,
  },
  roleBtnActive: { backgroundColor: "#2ecc71" },
  roleBtnText: { color: "#fff", fontWeight: "600" },

  banBtn: {
    backgroundColor: "#e74c3c",
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 14,
    alignItems: "center",
  },
});
