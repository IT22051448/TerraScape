import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SpMap from "../Screens/SpMap";
import AppointmentList from "../Screens/appointmentList";

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { position: "absolute", bottom: 0 }, // Optional: Ensure the tab is at the bottom
      }}
    >
      <Tab.Screen name="Home" component={SpMap} />
      <Tab.Screen name="Appointments" component={AppointmentList} />
    </Tab.Navigator>
  );
}
