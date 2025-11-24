import React, { useState, useContext, useRef, useEffect } from "react";
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
  Animated,
  StyleSheet,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import { AuthContext } from "../../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

// Floating Label Input Component
const FloatingLabelInput = ({ label, value, onChangeText, keyboardType }) => {
  const [isFocused, setIsFocused] = useState(false);
  const animatedIsFocused = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animatedIsFocused, {
      toValue: isFocused || value ? 1 : 0,
      duration: 150,
      useNativeDriver: false,
    }).start();
  }, [isFocused, value]);

  const labelStyle = {
    position: "absolute",
    left: 12,
    top: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [14, -8],
    }),
    fontSize: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    color: animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ["#999", "#007AFF"],
    }),
    backgroundColor: "#fff", // đây là phần che viền
    paddingHorizontal: 4,
    zIndex: 1, // đảm bảo label nổi trên viền
  };

  return (
    <View style={{ marginBottom: 16 }}>
      <Animated.Text style={labelStyle}>{label}</Animated.Text>
      <View
        style={[styles.inputWrapper, isFocused && { borderColor: "#007AFF" }]}
      >
        <TextInput
          value={value}
          onChangeText={onChangeText}
          keyboardType={keyboardType || "default"}
          style={styles.textInput}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
      </View>
    </View>
  );
};

// Main AddPetPopup Component
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
      formData.append("owner", user._id);
      formData.append("name", name);
      formData.append("species", species);
      formData.append("breed", breed);
      formData.append("age", Number(age));
      formData.append("gender", gender);

      if (Platform.OS === "web" && fileInputRef.current?.files[0]) {
        formData.append("image", fileInputRef.current.files[0]);
      } else if (imageUri && Platform.OS !== "web") {
        const filename = imageUri.split("/").pop();
        const match = /\.(\w+)$/.exec(filename);
        const type = match ? `image/${match[1]}` : "image/jpeg";
        const uri =
          Platform.OS === "android" && !imageUri.startsWith("file://")
            ? "file://" + imageUri
            : imageUri;
        formData.append("image", { uri, name: filename, type });
      }

      const res = await fetch(`${apiBase}/api/pets`, {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        let errData;
        try {
          errData = await res.json();
        } catch (e) {
          errData = { message: "Server trả về lỗi không hợp lệ" };
        }
        throw new Error(errData.message || "Thêm thú cưng thất bại");
      }
      const newPet = await res.json();
      onAddPet(newPet);

      // Reset form
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
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={styles.title}>Thêm thú cưng mới</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            <TouchableOpacity onPress={pickImage}>
              {previewImage ? (
                <Image
                  source={{ uri: previewImage }}
                  style={styles.imageStyle}
                />
              ) : (
                <View style={styles.placeholder}>
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

            <FloatingLabelInput
              label="Tên thú cưng"
              value={name}
              onChangeText={setName}
            />
            <FloatingLabelInput
              label="Loài"
              value={species}
              onChangeText={setSpecies}
            />
            <FloatingLabelInput
              label="Giống"
              value={breed}
              onChangeText={setBreed}
            />
            <FloatingLabelInput
              label="Tuổi"
              value={age}
              onChangeText={setAge}
              keyboardType="numeric"
            />

            <View style={{ flexDirection: "row", gap: 10, marginBottom: 15 }}>
              <TouchableOpacity
                onPress={() => setGender("male")}
                style={[
                  styles.genderBtn,
                  gender === "male" && styles.genderActive,
                ]}
              >
                <Text>♂ Đực</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender("female")}
                style={[
                  styles.genderBtn,
                  gender === "female" && styles.genderActive,
                ]}
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
              <TouchableOpacity onPress={onClose} style={styles.cancelBtn}>
                <Text style={{ color: "#007AFF", fontWeight: "bold" }}>
                  Đóng
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAdd} style={styles.saveBtn}>
                <Text style={{ color: "#fff", fontWeight: "bold" }}>Thêm</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    padding: 20,
  },
  popup: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    elevation: 5,
    maxHeight: "85%",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    color: "#007AFF",
    textAlign: "center",
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#007AFF",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 14,
    position: "relative",
  },
  textInput: { fontSize: 16, color: "#333", padding: 0, margin: 0 },
  genderBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    alignItems: "center",
  },
  genderActive: {
    backgroundColor: "#d3e6ff",
    borderColor: "#007AFF",
    borderWidth: 1,
  },
  imageStyle: {
    width: "100%",
    height: 180,
    borderRadius: 16,
    marginBottom: 12,
  },
  placeholder: {
    width: "100%",
    height: 150,
    backgroundColor: "#d3e6ff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  saveBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#007AFF",
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 8,
  },
  cancelBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: "#eef4ff",
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
  },
});
