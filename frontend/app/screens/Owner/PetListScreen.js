// screens/Owner/PetListScreen.js
import React, { useEffect, useState, useContext } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Image,
  Modal,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { AuthContext } from "../../context/AuthContext";
import AddPetPopup from "./addPetPopup";
import EditPetPopup from "./EditPetPopup";
import styles from "../../styles/PetListOwner";

export default function PetListScreen() {
  const { user } = useContext(AuthContext);
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);

  const [showAddPopup, setShowAddPopup] = useState(false);
  const [editingPet, setEditingPet] = useState(null);
  const [detailPet, setDetailPet] = useState(null);

  const [showDeletePopup, setShowDeletePopup] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const API_URL = "http://192.168.5.46:5000/api/pets";

  useEffect(() => {
    if (user?.id) fetchPets();
  }, [user]);

  const fetchPets = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/owner/${user.id}`);
      const data = await res.json();
      setPets(data);
    } catch (err) {
      console.error("fetchPets error:", err);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeletePet = (pet) => {
    setDeleteTarget(pet);
    setShowDeletePopup(true);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    console.log("Deleting pet ID:", deleteTarget._id); // Debug
    try {
      const res = await fetch(`${API_URL}/${deleteTarget._id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const errText = await res.text().catch(() => null);
        throw new Error(errText || "delete failed");
      }

      // Update state local
      setPets((prev) => prev.filter((p) => p._id !== deleteTarget._id));
    } catch (err) {
      console.error("delete error:", err);
    } finally {
      setShowDeletePopup(false);
      setDeleteTarget(null);
    }
  };

  const onAddPet = (newPet) => {
    if (!newPet) return;
    setPets((prev) => [newPet, ...prev]);
    setShowAddPopup(false);
  };

  const onSavePet = (updatedPet) => {
    if (!updatedPet) return;
    setPets((prev) =>
      prev.map((p) => (p._id === updatedPet._id ? updatedPet : p))
    );
    setEditingPet(null);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.petCard}
      activeOpacity={0.8}
      onPress={() => setDetailPet(item)}
    >
      {item.image ? (
        <Image
          source={{
            uri: `${API_URL.replace("/api/pets", "")}/uploads/${item.image}`,
          }}
          style={styles.petImage}
        />
      ) : (
        <View style={[styles.petImage, styles.petImagePlaceholder]}>
          <Ionicons name="paw" size={36} color="#007AFF" />
        </View>
      )}

      <View style={styles.petInfoContainer}>
        <Text style={styles.petName}>{item.name}</Text>
        <Text style={styles.petInfo}>Loài: {item.species}</Text>
        <Text style={styles.petInfo}>Tuổi: {item.age}</Text>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => setEditingPet(item)}
        >
          <Ionicons name="create-outline" size={20} color="#007AFF" />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => confirmDeletePet(item)}
        >
          <Ionicons name="trash-outline" size={20} color="#D32F2F" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Danh sách thú cưng</Text>
        <TouchableOpacity
          onPress={() => {
            setShowAddPopup(true);
            setEditingPet(null);
          }}
        >
          <Ionicons name="add-circle" size={40} color="#007AFF" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color="#007AFF"
          style={{ marginTop: 20 }}
        />
      ) : pets.length === 0 ? (
        <View style={styles.center}>
          <Text>Chưa có thú cưng nào</Text>
        </View>
      ) : (
        <FlatList
          data={pets}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          contentContainerStyle={{ paddingBottom: 30 }}
        />
      )}

      {/* Add / Edit Popups */}
      <AddPetPopup
        visible={showAddPopup}
        onClose={() => setShowAddPopup(false)}
        onAddPet={onAddPet}
        apiBase={API_URL.replace("/api/pets", "")}
      />
      <EditPetPopup
        visible={!!editingPet}
        pet={editingPet}
        onClose={() => setEditingPet(null)}
        onSave={onSavePet}
        apiBase={API_URL.replace("/api/pets", "")}
      />

      {/* Detail Modal */}
      <Modal visible={!!detailPet} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.detailContent}>
            {detailPet && (
              <>
                {detailPet.image ? (
                  <Image
                    source={{
                      uri: `${API_URL.replace("/api/pets", "")}/uploads/${
                        detailPet.image
                      }`,
                    }}
                    style={styles.detailImage}
                  />
                ) : (
                  <View
                    style={[styles.detailImage, styles.petImagePlaceholder]}
                  >
                    <Ionicons name="paw" size={60} color="#007AFF" />
                  </View>
                )}

                <Text style={styles.detailTitle}>{detailPet.name}</Text>
                <Text style={styles.detailText}>Loài: {detailPet.species}</Text>
                <Text style={styles.detailText}>
                  Giống: {detailPet.breed || "-"}
                </Text>
                <Text style={styles.detailText}>Tuổi: {detailPet.age}</Text>
                <Text style={styles.detailText}>
                  Giới tính: {detailPet.gender === "male" ? "Đực" : "Cái"}
                </Text>

                <View
                  style={{ flexDirection: "row", marginTop: 16, width: "100%" }}
                >
                  <TouchableOpacity
                    style={[styles.saveButton, { flex: 1, marginRight: 6 }]}
                    onPress={() => {
                      setEditingPet(detailPet);
                      setDetailPet(null);
                    }}
                  >
                    <Text style={{ color: "#fff", fontWeight: "700" }}>
                      Chỉnh sửa
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={[styles.cancelButton, { flex: 1 }]}
                    onPress={() => setDetailPet(null)}
                  >
                    <Text style={{ fontWeight: "700" }}>Đóng</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* Delete Popup */}
      <Modal visible={showDeletePopup} animationType="fade" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { width: "80%" }]}>
            <Text style={{ fontSize: 18, fontWeight: "700", marginBottom: 12 }}>
              Xoá thú cưng
            </Text>
            <Text style={{ marginBottom: 20 }}>
              Bạn có chắc muốn xoá "{deleteTarget?.name}" không?
            </Text>
            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity
                style={[styles.cancelButton, { flex: 1, marginRight: 6 }]}
                onPress={() => setShowDeletePopup(false)}
              >
                <Text style={{ fontWeight: "700" }}>Huỷ</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.saveButton, { flex: 1 }]}
                onPress={handleDelete}
              >
                <Text style={{ color: "#fff", fontWeight: "700" }}>Xoá</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
