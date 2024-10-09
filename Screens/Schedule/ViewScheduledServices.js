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
import {
  getUserServices,
  deleteService,
} from "../../utils/databases/firebaseDatabase";
import EditService from "../../Components/EditService";

const ViewScheduledServices = () => {
  const { userData } = useSelector((state) => state.auth);
  const serviceProviderEmail = userData?.email;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const userServices = await getUserServices(serviceProviderEmail);
        setServices(userServices);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [serviceProviderEmail]);

  const handleDelete = async (serviceId) => {
    try {
      await deleteService(serviceId);
      setServices((prevServices) => {
        const newServices = { ...prevServices };
        delete newServices[serviceId];
        return newServices;
      });
    } catch (error) {
      console.error("Error deleting service:", error);
    }
  };

  const renderService = ({ item }) => (
    <View style={styles.serviceCard}>
      <Text style={styles.serviceTitle}>{item[1].serviceType}</Text>
      <Text>{item[1].description}</Text>
      <Text>Amount: {item[1].amount}</Text>
      <Text>Date: {item[1].date}</Text>
      <Text>Time: {item[1].time}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() => setEditingService({ id: item[0], data: item[1] })} // Set the service for editing
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() =>
            Alert.alert(
              "Confirm Delete",
              "Are you sure you want to delete this service?",
              [
                { text: "Cancel", style: "cancel" },
                { text: "OK", onPress: () => handleDelete(item[0]) },
              ]
            )
          }
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const closeEdit = () => setEditingService(null); // Close edit modal

  if (loading) {
    return <Text style={styles.loadingText}>Loading services...</Text>;
  }

  if (Object.keys(services).length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No scheduled services found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={Object.entries(services)}
        keyExtractor={(item) => item[0]} // Using service ID as key
        renderItem={renderService}
      />
      {editingService && (
        <EditService
          serviceId={editingService.id}
          initialData={editingService.data}
          onClose={closeEdit}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f8ff",
    flex: 1,
  },
  serviceCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    elevation: 2,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  editButton: {
    backgroundColor: "#4caf50",
    padding: 10,
    borderRadius: 5,
    width: "48%",
  },
  deleteButton: {
    backgroundColor: "#f44336",
    padding: 10,
    borderRadius: 5,
    width: "48%",
  },
  buttonText: {
    color: "#ffffff",
    textAlign: "center",
  },
  loadingText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    fontSize: 18,
    color: "#555",
  },
});

export default ViewScheduledServices;
