import React, { useState, useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import TabNavigation from "./App/Navigations/TabNavigation"; 
import * as Location from "expo-location"; 
import UserLocation from "./App/context/userLocation"; 
import "react-native-get-random-values";

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

      return subscription; 
    };

    const subscriptionPromise = getLocation(); 

    // Cleanup function to remove the subscription
    return () => {
      subscriptionPromise.then((subscription) => {
        if (subscription?.remove) {
          subscription.remove(); 
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
