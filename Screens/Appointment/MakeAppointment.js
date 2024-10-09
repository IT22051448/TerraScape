import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import {
  getAllServices,
  requestAppointment,
  updateServiceNewFlag,
} from "../../utils/databases/customerfirebaseDatabase";

const MakeAppointment = () => {
  const navigation = useNavigation();
  const [services, setServices] = useState([]);

  // Get user data from Redux store
  const { userData } = useSelector((state) => state.auth);
  const customerEmail = userData?.email;
  const customerName = userData?.fullName;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const allServices = await getAllServices();
        // Assuming each service has a unique ID (e.g., the key from Firebase)
        const availableServices = Object.entries(allServices)
          .filter(([key, service]) => service.newService === true)
          .map(([key, service]) => ({ ...service, id: key })); // Add the key as id

        setServices(availableServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleMakeAppointment = async (service) => {
    console.log("Selected service:", service);

    // Prepare appointment data
    const appointmentData = {
      serviceType: service.serviceType,
      description: service.description,
      amount: service.amount,
      rateType: service.rateType,
      date: service.date,
      time: service.time,
      serviceProviderEmail: service.serviceProviderEmail,
      customerEmail: customerEmail,
      customerName: customerName,
      status: "Pending",
      createdAt: Date.now(),
    };

    try {
      // Request the appointment
      await requestAppointment(appointmentData);

      // Attempt to update the service
      console.log(
        `Attempting to update service ${service.id} to newService: false`
      );
      await updateServiceNewFlag(service.id, false);

      // Fetch updated services after the update
      const updatedServices = await getAllServices();
      console.log("Updated services:", updatedServices);
      const updatedService = updatedServices[service.id]; // Access the specific service by ID
      console.log("After update, service data:", updatedService);

      // Check if the update was successful
      if (updatedService && updatedService.newService === false) {
        Alert.alert(
          "Appointment Created",
          `You have made an appointment for ${service.serviceType}.`
        );
      } else {
        Alert.alert("Error", "Failed to update service. Please try again.");
      }

      // Navigate back after creating the appointment
      navigation.goBack();
    } catch (error) {
      console.error("Error creating appointment:", error);
      Alert.alert("Error", "Failed to create appointment: " + error.message);
    }
  };

  const renderServiceItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.serviceTitle}>{item.serviceType}</Text>
      <Text style={styles.serviceDescription}>{item.description}</Text>
      <Text style={styles.serviceAmount}>Amount: ${item.amount}</Text>
      <Text style={styles.serviceRate}>Rate Type: {item.rateType}</Text>
      <Text style={styles.serviceDate}>Date: {item.date}</Text>
      <Text style={styles.serviceTime}>Time: {item.time}</Text>
      <Text style={styles.serviceProviderEmail}>
        Provider: {item.serviceProviderEmail}
      </Text>
      {item.images.length > 0 && (
        <Image source={{ uri: item.images[0] }} style={styles.serviceImage} />
      )}
      <TouchableOpacity
        style={styles.appointmentButton}
        onPress={() => handleMakeAppointment(item)}
      >
        <Text style={styles.buttonText}>Make Appointment</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.navigate("CustomerHome")}
      >
        <Text style={styles.backButtonText}>{"< back"}</Text>
      </TouchableOpacity>
      <FlatList
        data={services}
        renderItem={renderServiceItem}
        keyExtractor={(item) => item.serviceType + item.date + item.time}
        ListHeaderComponent={
          <Text style={styles.title}>Available Services</Text>
        }
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
    padding: 8,
  },
  backButtonText: {
    fontSize: 24,
    color: "#2c3e50",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
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
  serviceProviderEmail: {
    marginBottom: 10,
    color: "#34495e",
    fontStyle: "italic",
  },
  serviceImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  appointmentButton: {
    backgroundColor: "#27ae60",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
});

export default MakeAppointment;
