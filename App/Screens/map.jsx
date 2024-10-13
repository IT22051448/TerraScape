import React, { useContext, useState, useEffect } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import UserLocationContext from "../context/userLocation";
import useAppointments from "../utils/fetchAppointments";

export default function Map() {
  const { location } = useContext(UserLocationContext); 
  const { appointments, loading } = useAppointments(); 
  const [mapRegion, setMapRegion] = useState(null); 

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
        >
          <Image
            source={require("/Users/dulakshasiriwardana/Documents/GitHub/TerraScape/assets/man.png")}
          />
        </Marker>

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
                title={`Task: ${appointment.title} - Date: ${appointment.date}`}
              />
            );
          } else {
            console.warn(
              `Invalid coordinates for appointment ID: ${appointment.id}`
            );
            return null; 
          }
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 400, 
    height: 600, 
    alignSelf: "center", 
  },
  map: {
    flex: 1, 
  },
});
