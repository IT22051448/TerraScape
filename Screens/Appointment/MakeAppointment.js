import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
  Modal,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
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
  const [address, setAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("Cash");
  const [selectedService, setSelectedService] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const { userData } = useSelector((state) => state.auth);
  const customerEmail = userData?.email;
  const customerName = userData?.fullName;

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const allServices = await getAllServices();
        const availableServices = Object.entries(allServices)
          .filter(([key, service]) => service.newService === true)
          .map(([key, service]) => ({ ...service, id: key }));

        setServices(availableServices);
      } catch (error) {
        console.error("Error fetching services:", error);
      }
    };

    fetchServices();
  }, []);

  const handleMakeAppointment = (service) => {
    if (!address) {
      Alert.alert("Error", "Please enter your address.");
      return;
    }

    setSelectedService(service);
    setModalVisible(true);
  };

  const confirmAppointment = async () => {
    const appointmentData = {
      sid: selectedService.sid,
      serviceType: selectedService.serviceType,
      description: selectedService.description,
      amount: selectedService.amount,
      rateType: selectedService.rateType,
      date: selectedService.date,
      time: selectedService.time,
      serviceProviderEmail: selectedService.serviceProviderEmail,
      customerEmail: customerEmail,
      customerName: customerName,
      status: "Pending",
      paymentMethod: paymentMethod,
      paymentStatus: "Pending",
      createdAt: Date.now(),
      location: address,
    };

    try {
      await requestAppointment(appointmentData);
      await updateServiceNewFlag(selectedService.id, false);

      const updatedServices = await getAllServices();
      const availableServices = Object.entries(updatedServices)
        .filter(([key, service]) => service.newService === true)
        .map(([key, service]) => ({ ...service, id: key }));

      setServices(availableServices);
      setModalVisible(false);

      Alert.alert(
        "Appointment Created",
        `You have made an appointment for ${selectedService.serviceType}.`
      );
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
      <Text style={styles.serviceRate}>Cost based on: {item.rateType}</Text>
      <Text style={styles.serviceDate}>Date: {item.date}</Text>
      <Text style={styles.serviceTime}>Time: {item.time}</Text>
      <Text style={styles.serviceProviderEmail}>
        Provider: {item.serviceProviderEmail}
      </Text>

      {item.imageUrls && item.imageUrls.length > 0 ? (
        <FlatList
          data={item.imageUrls}
          renderItem={({ item: imageUrl }) => (
            <Image source={{ uri: imageUrl }} style={styles.serviceImage} />
          )}
          keyExtractor={(imageUrl) => imageUrl}
          horizontal
        />
      ) : (
        <Text style={styles.noImageText}>No images available</Text>
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

      <Text style={styles.title}>Available Services</Text>

      <TextInput
        style={styles.input}
        placeholder="Enter your address"
        value={address}
        onChangeText={(text) => setAddress(text)}
      />

      {services.length === 0 ? (
        <Text style={styles.noServicesText}>
          No services available at this time.
        </Text>
      ) : (
        <FlatList
          data={services}
          renderItem={renderServiceItem}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Modal for payment method */}
      {selectedService && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>Select Payment Method</Text>
              <View style={styles.pickerContainer}>
                <Picker
                  selectedValue={paymentMethod}
                  onValueChange={(itemValue) => setPaymentMethod(itemValue)}
                  style={styles.picker}
                  itemStyle={styles.pickerItem} // Apply style to Picker items
                >
                  <Picker.Item label="Cash" value="Cash" />
                  <Picker.Item label="Bank Transfer" value="Bank Transfer" />
                </Picker>
              </View>
              <View style={styles.modalButtons}>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.buttonConfirm]}
                  onPress={confirmAppointment}
                >
                  <Text style={styles.textStyle}>Confirm</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    fontSize: 20,
    color: "#34495e",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50",
  },
  input: {
    height: 45,
    borderColor: "#95a5a6",
    borderWidth: 1,
    marginBottom: 20,
    paddingHorizontal: 10,
    borderRadius: 8,
    backgroundColor: "#ffffff",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  serviceTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1abc9c",
  },
  serviceDescription: {
    marginBottom: 8,
    color: "#7f8c8d",
  },
  serviceAmount: {
    marginBottom: 5,
    fontSize: 16,
    color: "#34495e",
  },
  serviceRate: {
    marginBottom: 5,
    fontSize: 16,
    color: "#34495e",
  },
  serviceDate: {
    marginBottom: 5,
    fontSize: 16,
    color: "#34495e",
  },
  serviceTime: {
    marginBottom: 5,
    fontSize: 16,
    color: "#34495e",
  },
  serviceProviderEmail: {
    marginBottom: 10,
    fontSize: 14,
    color: "#95a5a6",
  },
  serviceImage: {
    width: 120, // Adjust width as needed
    height: 120, // Keep height consistent
    borderRadius: 10,
    marginRight: 10, // Space between images
  },
  appointmentButton: {
    backgroundColor: "#27ae60",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  noImageText: {
    color: "#e74c3c",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
    fontSize: 20,
    fontWeight: "bold",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#95a5a6",
    borderRadius: 8,
    marginBottom: 20,
    width: "100%",
    overflow: "hidden",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  pickerItem: {
    height: 60,
    fontSize: 18,
    backgroundColor: "#f5f5f5",
  },
  modalButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: "#e74c3c",
    marginRight: 10,
    flex: 1,
  },
  buttonConfirm: {
    backgroundColor: "#27ae60",
    flex: 1,
  },
  textStyle: {
    color: "white",
    textAlign: "center",
    fontSize: 16,
  },
  noServicesText: {
    textAlign: "center",
    color: "#e74c3c",
  },
});

export default MakeAppointment;
