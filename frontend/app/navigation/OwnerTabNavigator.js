// navigation/OwnerTabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

// Các screen
import HomeOwner from "../screens/Owner/HomeOwner";
import PetListScreen from "../screens/Owner/PetListScreen";
import AppointmentScreen from "../screens/Owner/AppointmentScreen";
import PaymentScreen from "../screens/Owner/PaymentScreen";
import ProfileScreen from "../screens/Owner/ProfileScreen";

const Tab = createBottomTabNavigator();

export default function OwnerTabNavigator() {
  return (
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
        name="Payments"
        component={PaymentScreen}
        options={{
          tabBarLabel: "Thanh toán",
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="card-outline" size={size} color={color} />
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
    </Tab.Navigator>
  );
}
