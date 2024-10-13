import React from "react";
import { Text, View, FlatList, StyleSheet } from "react-native";
import useAppointments from "../utils/fetchAppointments";
import AppointmentItem from "./AppointmentItem";


export default function AppointmentListMap() {
  const { appointments, loading } = useAppointments(); 

  if (loading) {
    return <Text>Loading appointments...</Text>; // Show loading state
  }

  return (
    <View style={styles.container}>
      
      {appointments.length > 0 ? (
        <FlatList
          data={appointments}
          horizontal={true}
          renderItem={({ item }) => (
            <View style={styles.appointmentItem}>
              <AppointmentItem item={item}></AppointmentItem>
            
            </View>
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text>No appointments available</Text> 
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  appointmentItem: {
    marginBottom: 50,
    padding: 10,
    backgroundColor: "#f9f9f9",
    borderRadius: 5,
  },
  title: {
    fontWeight: "bold",
  },
});
