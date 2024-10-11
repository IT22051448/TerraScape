import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import Ionicons from "react-native-vector-icons/Ionicons";

import AppointmentList from "/Users/dulakshasiriwardana/Documents/GitHub/TerraScape/App/Screens/appointmentList.jsx";
import AppointmentDetails from "/Users/dulakshasiriwardana/Documents/GitHub/TerraScape/App/Screens/AppointmentDetailsScreen.jsx";
import JobDashboard from "../Screens/JobDashboard";
import SpMap from "../Screens/SpMap";
import Dash from "../Screens/dash"; // Dashboard component

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppointmentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="AppointmentList" component={AppointmentList} />
    <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} />
    <Stack.Screen name="JobDashboard" component={JobDashboard} />
  </Stack.Navigator>
);

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === "Map Page") {
            iconName = focused ? "map" : "map-outline";
          } else if (route.name === "Appointments") {
            iconName = focused ? "calendar" : "calendar-outline";
          } else if (route.name === "Dashboard") {
            iconName = focused ? "grid" : "grid-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: "tomato",
        tabBarInactiveTintColor: "gray",
      })}
    >
      <Tab.Screen
        name="Map Page"
        component={SpMap}
        options={{ headerShown: false }} // Hide header for the map page
      />
      <Tab.Screen
        name="Appointments"
        component={AppointmentStack}
        options={{ headerShown: false }} // Hide header for appointments stack
      />
      <Tab.Screen
        name="Dashboard"
        component={Dash}
        options={{ headerShown: false }} // Hide header for dashboard
      />
    </Tab.Navigator>
  );
}
