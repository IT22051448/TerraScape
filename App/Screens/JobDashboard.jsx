// App/Components/JobDashboard.js
import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";

const JobDashboard = ({ route }) => {
  const { appointment } = route.params; // Receive appointment details
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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Job Dashboard</Text>
      <Text style={styles.timer}>{timer} seconds</Text>

      {/* Displaying appointment details */}
      <Text style={styles.appointmentTitle}>{appointment.title}</Text>
      <Text style={styles.appointmentDate}>{appointment.date}</Text>
      <Text style={styles.appointmentStatus}>{appointment.status}</Text>
      <Text style={styles.appointmentDescription}>
        {appointment.description}
      </Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.startButton} onPress={startTimer}>
          <Text style={styles.buttonText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.finishButton} onPress={finishTimer}>
          <Text style={styles.buttonText}>Finish</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 20,
  },
  timer: {
    fontSize: 24,
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
  },
  finishButton: {
    backgroundColor: "darkred",
    borderRadius: 25,
    padding: 15,
    marginVertical: 5,
    alignItems: "center",
    flex: 1,
    marginLeft: 5,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default JobDashboard;
