import React from "react";
import { View, StyleSheet, Text, ActivityIndicator } from "react-native";
import Map from "./map";
import Header from "./header";
//import Searchbar from "./searchbar";
import useAppointments from "../utils/fetchAppointments";
import AppointmentListMap from "./appointmentListMap";

export const SpMap = () => {
  const { appointments, loading } = useAppointments();

  return (
    <View style={{ flex: 1 }}>
      <View style={styles.headerContainer}>
        <Header />
      </View>
      {loading ? ( // Show a loading indicator while appointments are loading
        <ActivityIndicator
          size="large"
          color="#0000ff"
          style={styles.loadingIndicator}
        />
      ) : appointments.length > 0 ? (
        <Map />
      ) : (
        <Text style={styles.appointmentsText}>No appointments available</Text>
      )}
      <View  style={styles.card}>
        <AppointmentListMap />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    position: "absolute",
    zIndex: 10,
    padding: 10,
    width: "100%",
    paddingHorizontal: 20,
  },
  appointmentsText: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 16,
    color: "black",
  },
  loadingIndicator: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    position: "absolute",
    bottom: 0,
    zIndex: 10,
    width: "100%",
  },
});

export default SpMap;
