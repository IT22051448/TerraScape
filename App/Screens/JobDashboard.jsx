// App/Components/JobDashboard.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { db } from "../utils/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import Header from "./header";

const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    const appointmentDoc = doc(db, "appointments", appointmentId);
    await updateDoc(appointmentDoc, { status: newStatus });
    console.log("Appointment status updated successfully!");
  } catch (error) {
    console.error("Error updating appointment status: ", error);
  }
};

const JobDashboard = ({ route }) => {
  const { appointment } = route.params;
  const navigation = useNavigation();
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let interval = null;
    if (isRunning) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1);
      }, 1000);
    } else if (!isRunning && timer !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isRunning, timer]);

  const startTimer = () => {
    setIsRunning(true);
  };

  const finishTimer = () => {
    setIsRunning(false);
  };

  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  const completeTask = () => {
    const timeSpent = formatTime(timer); // Get the formatted time

    Alert.alert(
      "Confirm Completion",
      `Are you sure you want to complete this task?\n\nTime Spent: ${timeSpent}`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            await updateAppointmentStatus(appointment.id, "Done");
            Alert.alert(
              "Job Completed!",
              `The appointment status has been updated to Done.\n\nTotal Time Spent: ${timeSpent}`,
              [
                {
                  text: "OK",
                  onPress: () => navigation.goBack(),
                },
              ]
            );
          },
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <Header title="Job Dashboard" />
      <Text style={styles.title}>Job Dashboard</Text>
      <View style={styles.timerContainer}>
        <Text style={styles.timer}>{formatTime(timer)}</Text>
      </View>
      <View style={styles.card}>
        <Text style={styles.appointmentTitle}>{appointment.title}</Text>
        <Text style={styles.appointmentDate}>{appointment.date}</Text>
        <Text style={styles.appointmentStatus}>{appointment.status}</Text>
        <Text style={styles.appointmentDescription}>
          {appointment.description}
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={startTimer}>
          <MaterialIcons name="play-arrow" size={20} color="white" />
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishButton} onPress={finishTimer}>
          <MaterialIcons name="stop" size={20} color="white" />
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        style={styles.completeTaskButton}
        onPress={completeTask}
      >
        <Text style={styles.buttonText}>Complete Task</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#f0f4f8",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  timerContainer: {
    padding: 10,
    backgroundColor: "#e3f2fd",
    borderRadius: 10,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  timer: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1976d2",
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 10,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    marginBottom: 20,
  },
  appointmentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  appointmentDate: {
    fontSize: 16,
    color: "gray",
    marginBottom: 5,
  },
  appointmentStatus: {
    fontSize: 16,
    color: "blue",
    marginBottom: 5,
  },
  appointmentDescription: {
    fontSize: 16,
    color: "black",
    textAlign: "center",
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  startButton: {
    backgroundColor: "#5B8E55",
    borderRadius: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    flex: 1,
    marginRight: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  finishButton: {
    backgroundColor: "darkred",
    borderRadius: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
    flexDirection: "row",
    justifyContent: "center",
  },
  completeTaskButton: {
    backgroundColor: "#007BFF",
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
    marginLeft: 5,
  },
});

export default JobDashboard;
