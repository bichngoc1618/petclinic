import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Image,
  Modal,
  Platform,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

export default function EditPetPopup({
  visible,
  onClose,
  pet,
  onSave,
  apiBase,
}) {
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [image, setImage] = useState(null); // URI mới hoặc Base64 web
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);

  // Xác định preview image
  const previewImage = image
    ? image
    : pet?.image
    ? `${apiBase}/uploads/${pet.image}`
    : null;

  useEffect(() => {
    if (pet) {
      setName(pet.name || "");
      setSpecies(pet.species || "");
      setBreed(pet.breed || "");
      setAge(pet.age ? String(pet.age) : "");
      setGender(pet.gender || "male");
      setImage(null);
    }
  }, [pet]);

  // Chọn ảnh
  const pickImage = async () => {
    try {
      if (Platform.OS === "web") {
        fileInputRef.current.click();
        return;
      }

      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!res.canceled && res.assets && res.assets.length > 0) {
        setImage(res.assets[0].uri);
      }
    } catch (err) {
      console.error("ImagePicker error:", err);
    }
  };

  // Web chọn file
  const handleWebFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImage(url);
    }
  };

  // Lưu thông tin + upload ảnh
  const handleSave = async () => {
    if (!name || !species || !age) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("species", species);
      formData.append("breed", breed);
      formData.append("age", Number(age));
      formData.append("gender", gender);

      // Nếu Web & có file
      if (Platform.OS === "web" && fileInputRef.current?.files[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      }
      // Mobile & image mới
      else if (image && !image.startsWith(`${apiBase}/uploads/`)) {
        const filename = image.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";
        formData.append("image", { uri: image, name: filename, type });
      }

      const res = await fetch(`${apiBase}/api/pets/${pet._id}`, {
        method: "PUT",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Cập nhật thất bại");
      }

      const updatedPet = await res.json();
      onSave(updatedPet); // cập nhật parent
      onClose();
    } catch (err) {
      console.error("Update failed", err);
      alert(err.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.4)",
          justifyContent: "center",
          padding: 20,
        }}
      >
        <View
          style={{
            backgroundColor: "#fff",
            padding: 20,
            borderRadius: 20,
            elevation: 5,
          }}
        >
          <Text
            style={{
              fontSize: 20,
              fontWeight: "bold",
              marginBottom: 15,
              color: "#007AFF",
              textAlign: "center",
            }}
          >
            Chỉnh sửa thú cưng
          </Text>

          {/* Image Picker */}
          <TouchableOpacity onPress={pickImage}>
            {previewImage ? (
              <Image
                source={{ uri: previewImage }}
                style={{
                  width: "100%",
                  height: 180,
                  borderRadius: 16,
                  marginBottom: 12,
                }}
              />
            ) : (
              <View
                style={{
                  width: "100%",
                  height: 150,
                  backgroundColor: "#d3e6ff",
                  borderRadius: 16,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <Ionicons name="image-outline" size={50} color="#007AFF" />
                <Text style={{ color: "#007AFF" }}>Chọn hình mới</Text>
              </View>
            )}
          </TouchableOpacity>

          {/* Input ẩn web */}
          {Platform.OS === "web" && (
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleWebFile}
              style={{ display: "none" }}
            />
          )}

          {uploading && (
            <ActivityIndicator
              size="large"
              color="#007AFF"
              style={{ marginVertical: 10 }}
            />
          )}

          {/* Form */}
          <TextInput
            value={name}
            onChangeText={setName}
            placeholder="Tên thú cưng"
            style={input}
          />
          <TextInput
            value={species}
            onChangeText={setSpecies}
            placeholder="Loài (dog, cat...)"
            style={input}
          />
          <TextInput
            value={breed}
            onChangeText={setBreed}
            placeholder="Giống"
            style={input}
          />
          <TextInput
            value={age}
            onChangeText={setAge}
            placeholder="Tuổi"
            keyboardType="numeric"
            style={input}
          />

          <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
            <TouchableOpacity
              onPress={() => setGender("male")}
              style={[genderBtn, gender === "male" && genderActive]}
            >
              <Text>♂ Đực</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setGender("female")}
              style={[genderBtn, gender === "female" && genderActive]}
            >
              <Text>♀ Cái</Text>
            </TouchableOpacity>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 10,
            }}
          >
            <TouchableOpacity onPress={onClose} style={cancelBtn}>
              <Text style={{ color: "#007AFF", fontWeight: "bold" }}>Hủy</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleSave} style={saveBtn}>
              <Text style={{ color: "#fff", fontWeight: "bold" }}>
                Lưu thay đổi
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const input = {
  backgroundColor: "#f4f8ff",
  padding: 12,
  borderRadius: 12,
  marginBottom: 12,
};
const genderBtn = {
  flex: 1,
  padding: 10,
  backgroundColor: "#f0f0f0",
  borderRadius: 12,
  alignItems: "center",
};
const genderActive = {
  backgroundColor: "#d3e6ff",
  borderColor: "#007AFF",
  borderWidth: 1,
};
const cancelBtn = {
  flex: 1,
  padding: 12,
  backgroundColor: "#eef4ff",
  borderRadius: 12,
  alignItems: "center",
  marginRight: 8,
};
const saveBtn = {
  flex: 1,
  padding: 12,
  backgroundColor: "#007AFF",
  borderRadius: 12,
  alignItems: "center",
  marginLeft: 8,
};
