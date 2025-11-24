// navigation/AdminDrawerNavigator.js
import React from "react";
import { TouchableOpacity } from "react-native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";

// Screens
import HomeAdmin from "../screens/Admin/HomeAdmin";
import UsersManagement from "../screens/Admin/UsersManagement";
import DoctorsManagement from "../screens/Admin/DoctorsManagement";
import StatsScreen from "../screens/Admin/StatsScreen";
import AppointmentsManagement from "../screens/Admin/AppointmentsManagement";
import DoctorViewScreen from "../screens/Admin/DoctorViewScreen";
import OwnerViewScreen from "../screens/Admin/OwnerViewScreen";

const Drawer = createDrawerNavigator();

export default function AdminDrawerNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={({ navigation }) => ({
        headerShown: true,
        drawerActiveTintColor: "#1976D2",
        drawerInactiveTintColor: "#333",
        drawerLabelStyle: { fontSize: 16 },

        // nút menu 3 gạch
        headerLeft: () => (
          <TouchableOpacity
            onPress={() => navigation.toggleDrawer()}
            style={{ marginLeft: 15 }}
          >
            <Ionicons name="menu-outline" size={28} color="#333" />
          </TouchableOpacity>
        ),
      })}
    >
      <Drawer.Screen
        name="HomeAdmin"
        component={HomeAdmin}
        options={{
          drawerLabel: "Trang chủ",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="UsersManagement"
        component={UsersManagement}
        options={{
          drawerLabel: "Quản lý người dùng",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="people-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="DoctorsManagement"
        component={DoctorsManagement}
        options={{
          drawerLabel: "Quản lý bác sĩ",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="medkit-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="StatsScreen"
        component={StatsScreen}
        options={{
          drawerLabel: "Xem thống kê",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="bar-chart-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="AppointmentsManagement"
        component={AppointmentsManagement}
        options={{
          drawerLabel: "Quản lý lịch hẹn",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="DoctorViewScreen"
        component={DoctorViewScreen}
        options={{
          drawerLabel: "Xem trang Doctor",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />

      <Drawer.Screen
        name="OwnerViewScreen"
        component={OwnerViewScreen}
        options={{
          drawerLabel: "Xem trang Owner",
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person-outline" size={size} color={color} />
          ),
        }}
      />
    </Drawer.Navigator>
  );
}
