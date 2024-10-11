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

const ViewScheduledServices = ({ navigation, route }) => {
  const { userData } = useSelector((state) => state.auth);
  const serviceProviderEmail = userData?.email;
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    if (route.params?.refresh) {
      const fetchServices = async () => {
        try {
          const userServices = await getUserServices(serviceProviderEmail);
          setServices(userServices);
        } catch (error) {
          console.error(error);
        }
      };

      fetchServices();
    }
  }, [route.params]);

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
      <Text style={styles.serviceDescription}>{item[1].description}</Text>
      <View style={styles.detailsContainer}>
        <Text style={styles.detailsText}>Amount: {item[1].amount}</Text>
        <Text style={styles.detailsText}>Date: {item[1].date}</Text>
        <Text style={styles.detailsText}>Time: {item[1].time}</Text>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.editButton}
          onPress={() =>
            navigation.navigate("UpdateService", {
              serviceId: item[0],
              serviceDetails: item[1],
            })
          }
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

  if (loading) {
    return <Text style={styles.loadingText}>Loading services...</Text>;
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>
      <Text style={styles.heading}>Your Scheduled Services</Text>

      {Object.keys(services).length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No scheduled services found.</Text>
        </View>
      ) : (
        <FlatList
          data={Object.entries(services)}
          keyExtractor={(item) => item[0]} // Using service ID as key
          renderItem={renderService}
          showsVerticalScrollIndicator={false}
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
  backButton: {
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#2980b9",
    fontWeight: "bold",
  },
  heading: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 20,
    textAlign: "center",
  },
  serviceCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  serviceTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 5,
  },
  serviceDescription: {
    fontSize: 16,
    color: "#555",
    marginBottom: 10,
  },
  detailsContainer: {
    marginBottom: 10,
  },
  detailsText: {
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
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
