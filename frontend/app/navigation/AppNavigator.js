import React, { useContext } from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import RegisterScreen from "../screens/RegisterScreen";
import HomeAdmin from "../screens/Admin/HomeAdmin";
import HomeDoctor from "../screens/Doctor/HomeDoctor";
import OwnerTabNavigator from "./OwnerTabNavigator";
import { AuthContext } from "../context/AuthContext";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      ) : user.role === "admin" ? (
        <Stack.Screen name="HomeAdmin" component={HomeAdmin} />
      ) : user.role === "doctor" ? (
        <Stack.Screen name="HomeDoctor" component={HomeDoctor} />
      ) : (
        // ✅ Ở đây dùng OwnerTabNavigator, mặc định tab đầu là HomeOwner
        <Stack.Screen name="OwnerTabs" component={OwnerTabNavigator} />
      )}
    </Stack.Navigator>
  );
}
