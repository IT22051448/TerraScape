import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import AppointmentList from "/Users/dulakshasiriwardana/Documents/GitHub/TerraScape/App/Screens/appointmentList.jsx";
import AppointmentDetails from "/Users/dulakshasiriwardana/Documents/GitHub/TerraScape/App/Screens/AppointmentDetailsScreen.jsx";
import JobDashboard from "../Screens/JobDashboard";
import SpMap from "../Screens/SpMap";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const AppointmentStack = () => (
  <Stack.Navigator>
    <Stack.Screen name="AppointmentList" component={AppointmentList} />
    <Stack.Screen name="AppointmentDetails" component={AppointmentDetails} />
    <Stack.Screen name="JobDashboard" component={JobDashboard} />
  </Stack.Navigator>
);

export default function TabNavigation() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Map Page" component={SpMap} />
      <Tab.Screen name="Appointments" component={AppointmentStack} />
    </Tab.Navigator>
  );
}
