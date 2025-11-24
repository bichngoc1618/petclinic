import React, { useContext, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { Modal, View, Text, TouchableOpacity } from "react-native";
import { AuthContext } from "../context/AuthContext";

// Screens
import HomeOwner from "../screens/Owner/HomeOwner";
import PetListScreen from "../screens/Owner/PetListScreen";
import AppointmentScreen from "../screens/Owner/AppointmentScreen";
import ProfileScreen from "../screens/Owner/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function OwnerTabNavigator({ navigation }) {
  const { logout } = useContext(AuthContext);
  const [logoutVisible, setLogoutVisible] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      setLogoutVisible(false);
      navigation.reset({
        index: 0,
        routes: [{ name: "Login" }],
      });
    } catch (err) {
      console.log("Logout error:", err);
    }
  };

  const LogoutButton = () => (
    <TouchableOpacity
      onPress={() => setLogoutVisible(true)}
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
    >
      <Ionicons name="log-out-outline" size={24} color="#666" />
      <Text style={{ fontSize: 12, color: "#666" }}>Đăng xuất</Text>
    </TouchableOpacity>
  );

  return (
    <>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#1976D2",
          tabBarInactiveTintColor: "#666",
          tabBarStyle: { height: 60, paddingBottom: 5 },
        }}
      >
        <Tab.Screen
          name="HomeOwner"
          component={HomeOwner}
          options={{
            tabBarLabel: "Trang chủ",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="home-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Pets"
          component={PetListScreen}
          options={{
            tabBarLabel: "Thú cưng",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="paw-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Appointments"
          component={AppointmentScreen}
          options={{
            tabBarLabel: "Lịch khám",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="calendar-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            tabBarLabel: "Tài khoản",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" size={size} color={color} />
            ),
          }}
        />
        <Tab.Screen
          name="LogoutButton"
          component={HomeOwner} // dummy, không quan trọng
          options={{
            tabBarButton: () => <LogoutButton />,
          }}
        />
      </Tab.Navigator>

      <Modal
        visible={logoutVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setLogoutVisible(false)}
      >
        {/* Bấm ra ngoài modal để đóng */}
        <TouchableOpacity
          activeOpacity={1}
          onPressOut={() => setLogoutVisible(false)}
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
            padding: 20,
          }}
        >
          {/* Content modal, bấm bên trong không đóng */}
          <TouchableOpacity
            activeOpacity={1}
            style={{
              width: "100%",
              maxWidth: 300,
              backgroundColor: "#fff",
              padding: 20,
              borderRadius: 10,
              elevation: 5,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                marginBottom: 20,
                textAlign: "center",
              }}
            >
              Đăng xuất
            </Text>
            <Text style={{ marginBottom: 20, textAlign: "center" }}>
              Bạn có chắc muốn đăng xuất?
            </Text>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={() => setLogoutVisible(false)}
                style={{ padding: 10 }}
              >
                <Text style={{ color: "#1976D2", fontWeight: "bold" }}>
                  Hủy
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleLogout} style={{ padding: 10 }}>
                <Text style={{ color: "red", fontWeight: "bold" }}>
                  Đăng xuất
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}
