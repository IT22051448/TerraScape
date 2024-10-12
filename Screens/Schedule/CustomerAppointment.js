import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  getAllAppointments,
  updateAppointmentStatus,
  updateServiceNewFlag,
} from "../../utils/databases/customerfirebaseDatabase";
import { getServiceBySid } from "../../utils/databases/firebaseDatabase";

const CustomerAppointment = () => {
  const [appointments, setAppointments] = useState([]);
  const { userData } = useSelector((state) => state.auth);
  const serviceProviderEmail = userData?.email;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const allAppointments = await getAllAppointments();

        if (!allAppointments || Object.keys(allAppointments).length === 0) {
          setAppointments([]);
          return;
        }

        const filteredAppointments = Object.entries(allAppointments)
          .filter(
            ([id, appointment]) =>
              appointment.serviceProviderEmail === serviceProviderEmail &&
              appointment.status !== "Rejected" // Exclude rejected appointments
          )
          .map(([id, appointment]) => ({ ...appointment, id }));

        setAppointments(filteredAppointments);
      } catch (error) {
        Alert.alert("Error", "Failed to fetch appointments.");
      }
    };

    fetchAppointments();
  }, [serviceProviderEmail]);

  const handleAcceptAppointment = async (appointmentId) => {
    try {
      await updateAppointmentStatus(appointmentId, "Accepted");
      Alert.alert("Appointment Accepted", "You have accepted the appointment.");
      setAppointments((prev) =>
        prev.map((appt) =>
          appt.id === appointmentId ? { ...appt, status: "Accepted" } : appt
        )
      );
    } catch (error) {
      Alert.alert("Error", "Failed to accept appointment.");
    }
  };

  const handleCancelAppointment = async (appointmentId, sid) => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to cancel this appointment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const service = await getServiceBySid(sid);
              if (service) {
                await updateAppointmentStatus(appointmentId, "Cancelled");
                await updateServiceNewFlag(service.id, true);
                setAppointments((prev) =>
                  prev.filter((item) => item.id !== appointmentId)
                );
                Alert.alert("Appointment cancelled successfully.");
              } else {
                Alert.alert("Error", "Service not found for the provided SID.");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to cancel the appointment.");
            }
          },
        },
      ]
    );
  };

  const handleRejectAppointment = async (appointmentId, sid) => {
    Alert.alert(
      "Are you sure?",
      "Do you really want to reject this appointment?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "OK",
          onPress: async () => {
            try {
              const service = await getServiceBySid(sid);
              if (service) {
                await updateAppointmentStatus(appointmentId, "Rejected");
                await updateServiceNewFlag(service.id, true);
                Alert.alert(
                  "Appointment Rejected",
                  "You have rejected the appointment."
                );

                // Immediately remove the rejected appointment from the state
                setAppointments((prev) =>
                  prev.filter((appt) => appt.id !== appointmentId)
                );
              } else {
                Alert.alert("Error", "Service not found for the provided SID.");
              }
            } catch (error) {
              Alert.alert("Error", "Failed to reject appointment.");
            }
          },
        },
      ]
    );
  };

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.appointmentTitle}>{item.serviceType}</Text>
      <Text style={styles.appointmentDescription}>{item.description}</Text>
      <Text style={styles.infoText}>Status: {item.status}</Text>
      <Text style={styles.infoText}>Date: {item.date}</Text>
      <Text style={styles.infoText}>Time: {item.time}</Text>
      <Text style={styles.infoText}>
        Customer: {item.customerName} ({item.customerEmail})
      </Text>
      <Text style={styles.infoText}>Amount: {item.amount}</Text>
      <Text style={styles.infoText}>
        Payment Method: {item.paymentMethod || "Not provided"}
      </Text>
      <Text style={styles.infoText}>
        Location: {item.location || "Not provided"}
      </Text>
      <View style={styles.buttonContainer}>
        {item.status === "Pending" && (
          <>
            <TouchableOpacity
              style={styles.acceptButton}
              onPress={() => handleAcceptAppointment(item.id)}
            >
              <Text style={styles.buttonText}>Accept</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => handleRejectAppointment(item.id, item.sid)} // Pass sid
            >
              <Text style={styles.buttonText}>Reject</Text>
            </TouchableOpacity>
          </>
        )}
        {item.status === "Accepted" && (
          <>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => handleCancelAppointment(item.id, item.sid)} // Pass sid
            >
              <Text style={styles.buttonText}>Cancel Appointment</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.trackButton}
              onPress={() =>
                Alert.alert(
                  "Track Feature",
                  "This feature is not implemented yet."
                )
              }
            >
              <Text style={styles.buttonText}>Track</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.title}>My Appointments</Text>

      {appointments.length === 0 ? (
        <Text style={styles.noAppointmentsText}>No appointments found.</Text>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#eef7d7",
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#2980b9",
    fontWeight: "bold",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#34495e",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  appointmentTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#27ae60",
  },
  appointmentDescription: {
    marginBottom: 10,
    color: "#34495e",
    fontStyle: "italic",
  },
  infoText: {
    color: "#34495e",
    marginBottom: 5,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  acceptButton: {
    backgroundColor: "#27ae60",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  rejectButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 5,
    width: "48%",
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#c0392b",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    width: "48%",
  },
  trackButton: {
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
    width: "48%",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  noAppointmentsText: {
    fontSize: 18,
    color: "#e74c3c",
    textAlign: "center",
    marginTop: 20,
  },
});

export default CustomerAppointment;
