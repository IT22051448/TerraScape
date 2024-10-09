import React, { useContext, useState, useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import UserLocationContext from "../context/userLocation";
import useAppointments from "../utils/fetchAppointments"; // Import the fetchAppointments hook

export default function Map() {
  const { location } = useContext(UserLocationContext); // Get user location from context
  const { appointments, loading } = useAppointments(); // Fetch appointments from Firestore
  const [mapRegion, setMapRegion] = useState(null); // State to hold the map region

  useEffect(() => {
    if (loading) {
      console.log("Loading appointments...");
    } else {
      console.log("Appointments loaded:", appointments);

      // Update the map region based on user's location and appointments
      if (appointments.length > 0) {
        const allLatitudes = appointments.map(
          (appointment) => appointment.location.latitude
        );
        const allLongitudes = appointments.map(
          (appointment) => appointment.location.longitude
        );

        // Calculate the bounds of the map
        const minLat = Math.min(...allLatitudes);
        const maxLat = Math.max(...allLatitudes);
        const minLng = Math.min(...allLongitudes);
        const maxLng = Math.max(...allLongitudes);

        // Set the region to fit all markers
        setMapRegion({
          latitude: (minLat + maxLat) / 2,
          longitude: (minLng + maxLng) / 2,
          latitudeDelta: Math.abs(maxLat - minLat) + 0.1,
          longitudeDelta: Math.abs(maxLng - minLng) + 0.1,
        });
      } else {
        // If no appointments, center the map on the user's location
        setMapRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.0422,
          longitudeDelta: 0.0421,
        });
      }
    }
  }, [loading, appointments, location]);

  // Handle loading state
  if (loading) {
    return <Text>Loading appointments...</Text>;
  }

  // Ensure the user's location is available
  if (!location?.latitude || !location?.longitude) {
    return <Text>Fetching location...</Text>;
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        showsUserLocation={true}
        region={mapRegion} // Use calculated map region
      >
        {/* Show marker for user's location */}
        <Marker
          coordinate={{
            latitude: location.latitude,
            longitude: location.longitude,
          }}
          title="You are here"
        />

        {/* Add markers for each appointment */}
        {appointments.map((appointment) => {
          const { latitude, longitude } = appointment.location; // Destructure coordinates

          // Check if latitude and longitude are valid numbers
          if (typeof latitude === "number" && typeof longitude === "number") {
            return (
              <Marker
                key={appointment.id}
                coordinate={{
                  latitude,
                  longitude,
                }}
                title={`Appointment ID: ${appointment.id}`}
              />
            );
          } else {
            console.warn(
              `Invalid coordinates for appointment ID: ${appointment.id}`
            );
            return null; // Skip rendering marker for this appointment
          }
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400, // Set a specific width
    height: 600, // Set a specific height
    alignSelf: "center", // Center the map horizontally
  },
  map: {
    flex: 1, // Ensure the map takes all the space in the container
  },
});
