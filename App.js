import React, { useState, useEffect } from "react";
import { StatusBar, StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import SignIn from "./Screens/Login/SignIn";
import SignUp from "./Screens/Login/SignUp";
import CustomerHome from "./Screens/CustomerHome";
import ServiceProviderHome from "./Screens/ServiceProviderHome";
import { Provider } from "react-redux";
import { store } from "./store/store";
import { SettingsProvider } from "./Components/SettingsContext";
import ScheduleService from "./Screens/Schedule/ScheduleService";
import ServiceConfirmation from "./Screens/Schedule/ServiceConfirmation";
import ViewScheduledServices from "./Screens/Schedule/ViewScheduledServices";
import MakeAppointment from "./Screens/Appointment/MakeAppointment";
import RequestedAppointments from "./Screens/Appointment/RequestedAppointment";
import ListingPage from "./Screens/ServiceListing/ListingPage";
import ListingForm from "./Screens/ServiceListing/ListingForm";

const Stack = createStackNavigator();

const MainStack = () => (
  <Provider store={store}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Listings" component={ListingPage} />
      <Stack.Screen name="AddListing" component={ListingForm} />
      <Stack.Screen name="CustomerHome" component={CustomerHome} />
      <Stack.Screen
        name="ServiceProviderHome"
        component={ServiceProviderHome}
      />
      <Stack.Screen name="ScheduleService" component={ScheduleService} />
      <Stack.Screen
        name="ServiceConfirmation"
        component={ServiceConfirmation}
      />
      <Stack.Screen
        name="ViewScheduledServices"
        component={ViewScheduledServices}
      />
      <Stack.Screen name="MakeAppointment" component={MakeAppointment} />
      <Stack.Screen
        name="RequestedAppointments"
        component={RequestedAppointments}
      />
    </Stack.Navigator>
  </Provider>
);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate a loading period
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SettingsProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        <MainStack />
      </NavigationContainer>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
