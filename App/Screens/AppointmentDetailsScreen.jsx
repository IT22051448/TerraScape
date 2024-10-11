import React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
} from "react-native";
import { db } from "../utils/firebaseConfig";
import { doc, deleteDoc } from "firebase/firestore";
import Icon from "react-native-vector-icons/MaterialIcons";

const AppointmentDetails = ({ route, navigation }) => {
  const { appointment } = route.params;

  const handleDelete = async () => {
    Alert.alert(
      "Confirm Deletion",
      "Are you sure you want to reject this appointment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const appointmentDoc = doc(db, "appointments", appointment.id);
              await deleteDoc(appointmentDoc);
              console.log(`Deleted appointment: ${appointment.id}`);
              navigation.goBack();
            } catch (error) {
              console.error("Error deleting appointment: ", error);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleNavigate = () => {
    const latitude = appointment.latitude;
    const longitude = appointment.longitude;
    const url = `geo:${latitude},${longitude}?q=${latitude},${longitude}`;

    Linking.canOpenURL(url)
      .then((supported) => {
        if (!supported) {
          Alert.alert(
            "Error",
            "Google Maps is not available. Please make sure it is installed."
          );
        } else {
          return Linking.openURL(url);
        }
      })
      .catch((err) => console.error("An error occurred", err));
  };

  const handleStartJob = () => {
    navigation.navigate("JobDashboard", { appointment });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={30} color="#fff" />
      </TouchableOpacity>

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
    backgroundColor: "#f7f7f7",
    padding: 20,
  },
  backButton: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 50,
    padding: 10,
  },
  image: {
    width: "100%",
    height: 250,
    resizeMode: "cover",
    borderRadius: 10,
    marginBottom: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  date: {
    fontSize: 18,
    color: "gray",
    marginBottom: 5,
  },
  status: {
    fontSize: 18,
    color: "#007BFF",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#555",
    textAlign: "center",
    marginBottom: 25,
  },
  buttonContainer: {
    width: "100%",
  },
  navigateButton: {
    backgroundColor: "#5B8E55",
    borderRadius: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
  },
  startButton: {
    backgroundColor: "#007BFF",
    borderRadius: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "darkred",
    borderRadius: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default AppointmentDetails;
