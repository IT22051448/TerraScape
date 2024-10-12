import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  getAllAppointments,
  deleteAppointment,
  updateServiceNewFlag,
} from "../../utils/databases/customerfirebaseDatabase";
import { getServiceBySid } from "../../utils/databases/firebaseDatabase";

const RequestedAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const { userData } = useSelector((state) => state.auth);
  const customerEmail = userData?.email;
  const navigation = useNavigation();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const allAppointments = await getAllAppointments();
        if (!allAppointments || Object.keys(allAppointments).length === 0) {
          setAppointments([]);
          return;
        }

        const customerAppointments = Object.entries(allAppointments).filter(
          ([, value]) =>
            value.customerEmail === customerEmail && value.status !== "Accepted" // Exclude accepted appointments
        );

        setAppointments(
          customerAppointments.map(([key, value]) => ({
            ...value,
            id: key,
            serviceId: value.serviceId,
          }))
        );
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [customerEmail]);

  const handleRemoveAppointment = async (appointmentId) => {
    try {
      await deleteAppointment(appointmentId);
      setAppointments((prev) =>
        prev.filter((item) => item.id !== appointmentId)
      );
      Alert.alert("Appointment removed successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to remove the appointment.");
      console.error("Error during removal:", error);
    }
  };

  const handleCancelAppointment = async (
    appointmentId,
    serviceId,
    appointmentSid
  ) => {
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
              const service = await getServiceBySid(appointmentSid);
              if (service) {
                await deleteAppointment(appointmentId);
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
      <Text style={styles.paymentMethod}>
        Payment Method: {item.paymentMethod}
      </Text>
      <Text style={styles.paymentStatus}>
        Payment Status: {item.paymentStatus}
      </Text>
      {item.imageUrl && (
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
      )}
      {item.status === "Rejected" ? (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleRemoveAppointment(item.id)}
        >
          <Text style={styles.buttonText}>Remove Appointment</Text>
        </TouchableOpacity>
      ) : item.status === "Pending" || item.status === "Accepted" ? (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() =>
            handleCancelAppointment(item.id, item.serviceId, item.sid)
          }
        >
          <Text style={styles.buttonText}>Cancel Appointment</Text>
        </TouchableOpacity>
      ) : item.status === "Cancelled" ? (
        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => handleRemoveAppointment(item.id)}
        >
          <Text style={styles.buttonText}>Remove Appointment</Text>
        </TouchableOpacity>
      ) : null}
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
      <Text style={styles.title}>Your Appointments</Text>
      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/images/noitems.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>
            You currently do not have any appointments pending.
          </Text>
        </View>
      ) : (
        <FlatList
          data={appointments}
          renderItem={renderAppointmentItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.flatListContainer}
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
    fontSize: 18,
    color: "#2980b9",
  },
  title: {
    fontSize: 32,
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
    fontSize: 22,
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
  paymentMethod: {
    marginBottom: 5,
    color: "#2980b9",
  },
  paymentStatus: {
    marginBottom: 10,
    color: "#e74c3c",
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    marginVertical: 20,
  },
  emptyImage: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  emptyText: {
    fontSize: 20,
    color: "#7f8c8d",
    textAlign: "center",
    marginBottom: 20,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
});

export default RequestedAppointments;
