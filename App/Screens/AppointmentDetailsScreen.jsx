// App/Components/AppointmentDetails.js
import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

const AppointmentDetails = ({ route, navigation }) => {
  const { appointment } = route.params;

  const handleDelete = () => {
    console.log(`Deleting appointment: ${appointment.id}`);
  };

  const handleNavigate = () => {
    // Implement navigation logic
  };

  const handleStartJob = () => {
    navigation.navigate("JobDashboard", { appointment }); // Pass appointment details
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: appointment.imageUrl }} style={styles.image} />
      <Text style={styles.title}>{appointment.title}</Text>
      <Text style={styles.date}>{appointment.date}</Text>
      <Text style={styles.status}>{appointment.status}</Text>
      <Text style={styles.description}>{appointment.description}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.navigateButton}
          onPress={handleNavigate}
        >
          <Text style={styles.buttonText}>Navigate</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton} onPress={handleStartJob}>
          <Text style={styles.buttonText}>Start Job</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={handleDelete}>
          <Text style={styles.buttonText}>Reject Appointment</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
  },
  image: {
    width: "100%",
    height: 200,
    resizeMode: "cover",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 10,
  },
  date: {
    fontSize: 16,
    color: "gray",
    marginBottom: 10,
  },
  status: {
    fontSize: 16,
    color: "blue",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "black",
    marginBottom: 20,
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    width: "100%",
  },
  navigateButton: {
    backgroundColor: "#5B8E55",
    borderRadius: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    width: "100%",
  },
  startButton: {
    backgroundColor: "#5B8E55",
    borderRadius: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    width: "100%",
  },
  rejectButton: {
    backgroundColor: "darkred",
    borderRadius: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    width: "100%",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AppointmentDetails;
