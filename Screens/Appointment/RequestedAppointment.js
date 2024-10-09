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
  deleteAppointment,
  updateServiceNewFlag,
} from "../../utils/databases/customerfirebaseDatabase";

const RequestedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { userData } = useSelector((state) => state.auth);
  const customerEmail = userData?.email;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const allAppointments = await getAllAppointments();
        const customerAppointments = Object.entries(allAppointments).filter(
          ([, value]) => value.customerEmail === customerEmail
        );

        setAppointments(
          customerAppointments.map(([key, value]) => ({
            ...value,
            id: key,
            serviceId: value.serviceId, // Ensure this line correctly maps the serviceId
          }))
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [customerEmail]);

  const handleCancelAppointment = async (appointmentId, serviceId) => {
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
              await deleteAppointment(appointmentId);
              console.log("Cancelling appointment:", appointmentId);

              // Check if serviceId is defined before updating
              if (serviceId) {
                console.log("Updating serviceId to newService: true");
                await updateServiceNewFlag(serviceId, true); // Ensure serviceId is valid
              } else {
                console.error("Service ID is undefined.");
                Alert.alert("Error", "Service ID is not available.");
              }

              setAppointments((prev) =>
                prev.filter((item) => item.id !== appointmentId)
              );
              Alert.alert("Appointment cancelled successfully.");
            } catch (error) {
              Alert.alert("Error", "Failed to cancel the appointment.");
              console.error("Error during cancellation:", error);
            }
          },
        },
      ]
    );
  };

  const renderAppointmentItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.serviceTitle}>{item.serviceType}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <Text style={styles.serviceAmount}>Amount: ${item.amount}</Text>
      <Text style={styles.serviceRate}>Rate Type: {item.rateType}</Text>
      <Text style={styles.serviceDate}>Date: {item.date}</Text>
      <Text style={styles.serviceTime}>Time: {item.time}</Text>
      <Text style={styles.appointmentStatus}>Status: {item.status}</Text>
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => handleCancelAppointment(item.id, item.serviceId)}
      >
        <Text style={styles.buttonText}>Cancel Appointment</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>&lt; Back</Text>
      </TouchableOpacity>
      <FlatList
        data={appointments}
        renderItem={renderAppointmentItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <Text style={styles.title}>Your Appointments</Text>
        }
        contentContainerStyle={styles.flatListContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e0f7fa",
  },
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: "#2c3e50",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  flatListContainer: {
    paddingBottom: 20,
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
  serviceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#27ae60",
  },
  serviceDescription: {
    marginBottom: 10,
    color: "#34495e",
  },
  serviceAmount: {
    marginBottom: 5,
    color: "#34495e",
  },
  serviceRate: {
    marginBottom: 5,
    color: "#34495e",
  },
  serviceDate: {
    marginBottom: 5,
    color: "#34495e",
  },
  serviceTime: {
    marginBottom: 10,
    color: "#34495e",
  },
  appointmentStatus: {
    marginBottom: 10,
    color: "#d35400",
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#c0392b",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default RequestedAppointments;
