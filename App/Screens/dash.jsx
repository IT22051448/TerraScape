import React, { useState, useEffect } from "react";
import Header from "./header";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import useAppointments from "../utils/fetchAppointments";

export default function AppointmentList({ navigation }) {
  const { appointments, loading } = useAppointments();

  const [completed, setCompleted] = useState([]);
  const [inProgress, setInProgress] = useState([]);
  const [pending, setPending] = useState([]);

  // Organize appointments by status
  useEffect(() => {
    if (appointments) {
      setCompleted(
        appointments.filter((appointment) => appointment.status === "Done")
      );
      setInProgress(
        appointments.filter(
          (appointment) => appointment.status === "In Progress"
        )
      );
      setPending(
        appointments.filter((appointment) => appointment.status === "Pending")
      );
    }
  }, [appointments]);

  const renderAppointmentCard = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        navigation.navigate("AppointmentDetails", { appointment: item })
      } // Navigate to details screen
    >
      <Image
        source={{ uri: item.imageUrl }}
        style={styles.image}
        resizeMode="cover"
      />
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={[styles.description, getStatusStyle(item.status)]}>
        {item.status}
      </Text>
    </TouchableOpacity>
  );

  // Function to determine the status text color
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return styles.pending;
      case "Done":
        return styles.done;
      case "In Progress":
        return styles.inProgress; // Add this style if needed
      default:
        return styles.default;
    }
  };

  if (loading) {
    return <Text>Loading appointments...</Text>;
  }

  return (
    <ScrollView style={styles.container}>
      <Header title="Appointment List" />

      {/* Completed Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Completed Appointments</Text>
        {completed.length > 0 ? (
          completed.map((appointment) => (
            <View key={appointment.id} style={styles.card}>
              <Text style={styles.cardTitle}>{appointment.title}</Text>
              <Text style={styles.cardStatus}>{appointment.status}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No Completed Appointments</Text>
        )}
      </View>

      {/* In Progress Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>In Progress Appointments</Text>
        {inProgress.length > 0 ? (
          inProgress.map((appointment) => (
            <View key={appointment.id} style={styles.card}>
              <Text style={styles.cardTitle}>{appointment.title}</Text>
              <Text style={styles.cardStatus}>{appointment.status}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No In Progress Appointments</Text>
        )}
      </View>

      {/* Pending Appointments */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Pending Appointments</Text>
        {pending.length > 0 ? (
          pending.map((appointment) => (
            <View key={appointment.id} style={styles.card}>
              <Text style={styles.cardTitle}>{appointment.title}</Text>
              <Text style={styles.cardStatus}>{appointment.status}</Text>
            </View>
          ))
        ) : (
          <Text style={styles.emptyText}>No Pending Appointments</Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5",
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#007BFF",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  cardStatus: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  emptyText: {
    fontSize: 14,
    color: "#888",
    fontStyle: "italic",
  },
  // Add any additional styles for the status colors if needed
  pending: {
    color: "orange",
  },
  done: {
    color: "green",
  },
  inProgress: {
    color: "blue",
  },
});
