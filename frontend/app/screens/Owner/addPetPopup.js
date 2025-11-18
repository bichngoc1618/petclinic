import React, { useState, useContext, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  Image,
  Platform,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

export default function AddPetPopup({ visible, onClose, onAddPet, apiBase }) {
  const { user } = useContext(AuthContext);
  const [name, setName] = useState("");
  const [species, setSpecies] = useState("");
  const [breed, setBreed] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("male");
  const [imageUri, setImageUri] = useState(null);
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef(null);

  const pickImage = async () => {
    try {
      if (Platform.OS === "web") {
        fileInputRef.current.click();
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Error picking image:", error);
    }
  };

  const handleWebFile = (e) => {
    const file = e.target.files[0];
    if (file) setImageUri(URL.createObjectURL(file));
  };

  const handleAdd = async () => {
    if (!name || !species || !age) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("owner", user.id);
      formData.append("name", name);
      formData.append("species", species);
      formData.append("breed", breed);
      formData.append("age", Number(age));
      formData.append("gender", gender);

      if (Platform.OS === "web" && fileInputRef.current?.files[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      } else if (imageUri) {
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image";
        formData.append("image", { uri: imageUri, name: filename, type });
      }

      const res = await fetch(`${apiBase}/api/pets`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.message || "Thêm thú cưng thất bại");
      }

      const newPet = await res.json();
      onAddPet(newPet);

      setName("");
      setSpecies("");
      setBreed("");
      setAge("");
      setGender("male");
      setImageUri(null);
      onClose();
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const previewImage = imageUri;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={overlay}>
        <View style={popup}>
          <Text style={title}>Thêm thú cưng mới</Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={pickImage}>
              {previewImage ? (
                <Image source={{ uri: previewImage }} style={imageStyle} />
              ) : (
                <View style={placeholder}>
                  <Ionicons name="image-outline" size={50} color="#007AFF" />
                  <Text style={{ color: "#007AFF", marginTop: 5 }}>
                    Chọn hình
                  </Text>
                </View>
              )}
            </TouchableOpacity>

            {Platform.OS === "web" && (
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleWebFile}
                style={{ display: "none" }}
              />
            )}

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Tên thú cưng"
              style={input}
            />
            <TextInput
              value={species}
              onChangeText={setSpecies}
              placeholder="Loài"
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

            {loading && (
              <ActivityIndicator
                size="large"
                color="#007AFF"
                style={{ marginBottom: 10 }}
              />
            )}

            <View
              style={{ flexDirection: "row", justifyContent: "space-between" }}
            >
              <TouchableOpacity onPress={onClose} style={cancelBtn}>
                <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
                  Đóng
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdd} style={saveBtn}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const overlay = {
  flex: 1,
  backgroundColor: "rgba(0,0,0,0.4)",
  justifyContent: "center",
  padding: 20,
};

const popup = {
  backgroundColor: "#fff",
  padding: 20,
  borderRadius: 20,
  elevation: 5,
  maxHeight: "85%",
};

const title = {
  fontSize: 20,
  fontWeight: "bold",
  marginBottom: 15,
  color: "#007AFF",
  textAlign: "center",
};

const input = {
  backgroundColor: "#f4f8ff",
  padding: 12,
  borderRadius: 12,
  marginBottom: 12,
};

const genderBtn = {
  flex: 1,
  padding: 12,
  backgroundColor: "#f0f0f0",
  borderRadius: 12,
  alignItems: "center",
};

const genderActive = {
  backgroundColor: "#d3e6ff",
  borderColor: "#007AFF",
  borderWidth: 1,
};

const imageStyle = {
  width: "100%",
  height: 180,
  borderRadius: 16,
  marginBottom: 12,
};

const placeholder = {
  width: "100%",
  height: 150,
  backgroundColor: "#d3e6ff",
  borderRadius: 16,
  justifyContent: "center",
  alignItems: "center",
  marginBottom: 12,
};

const saveBtn = {
  flex: 1,
  padding: 12,
  backgroundColor: "#007AFF",
  borderRadius: 12,
  alignItems: "center",
  marginLeft: 8,
};

const cancelBtn = {
  flex: 1,
  padding: 12,
  backgroundColor: "#eef4ff",
  borderRadius: 12,
  alignItems: "center",
  marginRight: 8,
};
