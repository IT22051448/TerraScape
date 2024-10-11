// App/Components/AppointmentList.js
import React from "react";
import Header from "./header"; 

import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";
import useAppointments from "../utils/fetchAppointments";

export default function AppointmentList({ navigation }) {
  const { appointments, loading } = useAppointments();

  // Function to determine the status text color
  const getStatusStyle = (status) => {
    switch (status) {
      case "Pending":
        return styles.pending;
      case "Done":
        return styles.done;
      default:
        return styles.default;
    }
  };

  const renderAppointmentCard = ({ item }) => {
    return (
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
  };

  if (loading) {
    return <Text>Loading appointments...</Text>;
  }

  return (
    <View style={styles.container}>
      {/* Add the Header component */}
      <Header title="Appointment List" />

      {/* FlatList to show the appointments */}
      <FlatList
        data={appointments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderAppointmentCard}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#f5f5f5", // Added background color for better styling
  },
  listContainer: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginTop: 10,
  },
  date: {
    fontSize: 14,
    color: "#888",
  },
  description: {
    fontSize: 16,
    marginTop: 5,
  },
  pending: {
    color: "orange",
  },
  done: {
    color: "green",
  },
  default: {
    color: "black",
  },
});
