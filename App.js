import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigations/TabNavigation"; // Adjust the path as needed
import * as Location from "expo-location"; // Use expo-location for location access
import UserLocation from "./App/context/userLocation"; // Context for user location
import "react-native-get-random-values"; // Needed for generating random values

export default function App() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const getLocation = async () => {
      // Request permission to access location
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }

      // Get the initial location
      const initialLocation = await Location.getCurrentPositionAsync({});
      setLocation(initialLocation.coords);
      console.log("Current Location:", initialLocation.coords);

      // Watch for location updates
      const subscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High, // Use high accuracy
          distanceInterval: 10, // Meters
          timeInterval: 10000, // 10 seconds
        },
        (newLocation) => {
          setLocation(newLocation.coords); // Update location with new coordinates
          console.log("Updated location:", newLocation.coords);
        }
      );

      return subscription; // Return the subscription object for cleanup
    };

    const subscriptionPromise = getLocation(); // Save the subscription promise

    // Cleanup function to remove the subscription
    return () => {
      subscriptionPromise.then((subscription) => {
        if (subscription?.remove) {
          subscription.remove(); // Remove subscription if it exists
        }
      });
    };
  }, []);

  return (
    <UserLocation.Provider value={{ location, setLocation }}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
        <NavigationContainer>
          <TabNavigation />
        </NavigationContainer>
      </SafeAreaView>
    </UserLocation.Provider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
});
