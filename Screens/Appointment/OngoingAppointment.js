import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
  Image,
  Modal,
  TextInput,
} from "react-native";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";
import {
  getAllAppointments,
  deleteAppointment,
  updateServiceNewFlag,
  updateAppointmentStatus,
} from "../../utils/databases/customerfirebaseDatabase";
import { getServiceBySid } from "../../utils/databases/firebaseDatabase";
import DateTimePicker from "@react-native-community/datetimepicker";

const OngoingAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [newDate, setNewDate] = useState(new Date());
  const [newTime, setNewTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
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
            value.customerEmail === customerEmail && value.status === "Accepted"
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

  const handleRescheduleAppointment = (appointmentId) => {
    setSelectedAppointment(appointmentId);
    setModalVisible(true);
  };

  const handleSubmitReschedule = async () => {
    const formattedDate = `${newDate.getDate().toString().padStart(2, "0")}/${(
      newDate.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}/${newDate.getFullYear()}`;
    const formattedTime = `${newTime
      .getHours()
      .toString()
      .padStart(2, "0")}:${newTime.getMinutes().toString().padStart(2, "0")}`;

    try {
      // Update the appointment status to "Pending"
      await updateAppointmentStatus(selectedAppointment, "Pending");

      // Optionally: Fetch updated appointments if needed
      const allAppointments = await getAllAppointments();
      const customerAppointments = Object.entries(allAppointments).filter(
        ([, value]) =>
          value.customerEmail === customerEmail && value.status === "Pending"
      );

      setAppointments(
        customerAppointments.map(([key, value]) => ({
          ...value,
          id: key,
          serviceId: value.serviceId,
        }))
      );

      setModalVisible(false);
      setNewDate(new Date());
      setNewTime(new Date());
      Alert.alert(
        "Success",
        `Appointment rescheduled to ${formattedDate} at ${formattedTime}.`
      );
    } catch (error) {
      Alert.alert("Error", "Failed to reschedule the appointment.");
      console.error("Error during rescheduling:", error);
    }
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
        onPress={() =>
          handleCancelAppointment(item.id, item.serviceId, item.sid)
        }
      >
        <Text style={styles.buttonText}>Cancel Appointment</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.rescheduleButton}
        onPress={() => handleRescheduleAppointment(item.id)}
      >
        <Text style={styles.buttonText}>Reschedule Appointment</Text>
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
      <Text style={styles.title}>Ongoing Appointments</Text>
      {appointments.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Image
            source={require("../../assets/images/noitems.png")}
            style={styles.emptyImage}
          />
          <Text style={styles.emptyText}>
            You currently do not have any ongoing appointments.
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

      {/* Modal for Rescheduling */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Reschedule Appointment</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)}>
              <Text style={styles.input}>
                {`New Date: ${newDate.getDate().toString().padStart(2, "0")}/${(
                  newDate.getMonth() + 1
                )
                  .toString()
                  .padStart(2, "0")}/${newDate.getFullYear()}`}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowTimePicker(true)}>
              <Text style={styles.input}>
                {`New Time: ${newTime
                  .getHours()
                  .toString()
                  .padStart(2, "0")}:${newTime
                  .getMinutes()
                  .toString()
                  .padStart(2, "0")}`}
              </Text>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={newDate}
                mode="date"
                display="default"
                onChange={(event, date) => {
                  setShowDatePicker(false);
                  if (date) setNewDate(date);
                }}
              />
            )}
            {showTimePicker && (
              <DateTimePicker
                value={newTime}
                mode="time"
                display="default"
                onChange={(event, time) => {
                  setShowTimePicker(false);
                  if (time) setNewTime(time);
                }}
              />
            )}

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handleSubmitReschedule}
            >
              <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.buttonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
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
  cancelButton: {
    backgroundColor: "#c0392b",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 5,
  },
  rescheduleButton: {
    backgroundColor: "#27ae60",
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#2980b9",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
    textAlign: "center",
    fontSize: 18,
  },
  submitButton: {
    backgroundColor: "#2980b9",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
});

export default OngoingAppointments;
