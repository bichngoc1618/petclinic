import React, { useContext } from "react";
import { View, ActivityIndicator, Text } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeDoctor from "../screens/Doctor/HomeDoctor";
import OwnerTabNavigator from "./OwnerTabNavigator";
import AdminDrawerNavigator from "./AdminNavigator";
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user, initializing } = useContext(AuthContext);

  if (initializing) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text>Đang tải user...</Text>
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user.role === "admin" ? (
        <Stack.Screen name="AdminDrawer" component={AdminDrawerNavigator} />
      ) : user.role === "doctor" ? (
        <Stack.Screen name="HomeDoctor" component={HomeDoctor} />
      ) : (
        <Stack.Screen name="OwnerTabs" component={OwnerTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
