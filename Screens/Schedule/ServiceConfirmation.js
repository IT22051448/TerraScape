import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const ServiceConfirmation = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Destructure the parameters passed to this screen
  const { serviceType, description, amount, rateType, date, time } =
    route.params;

  const handleContinue = () => {
    // Navigate to ServiceProviderHome
    navigation.navigate("ServiceProviderHome");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Confirmation</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Service Type:</Text>
        <Text style={styles.value}>{serviceType}</Text>

        <Text style={styles.label}>Description:</Text>
        <Text style={styles.value}>{description}</Text>

        <Text style={styles.label}>Amount:</Text>
        <Text style={styles.value}>{amount}</Text>

        <Text style={styles.label}>Rate Type:</Text>
        <Text style={styles.value}>{rateType}</Text>

        <Text style={styles.label}>Date:</Text>
        <Text style={styles.value}>{date}</Text>

        <Text style={styles.label}>Time:</Text>
        <Text style={styles.value}>{time}</Text>
      </View>

      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueButtonText}>Continue</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e0f7fa", // Light cyan background
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#2c3e50", // Darker text color for contrast
  },
  card: {
    backgroundColor: "#ffffff", // White background for the card
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Add elevation for Android
    marginBottom: 20,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#27ae60", // Green color for labels
  },
  value: {
    marginBottom: 15,
    fontSize: 18,
    color: "#34495e", // Dark color for value text
  },
  continueButton: {
    backgroundColor: "#27ae60", // Green background for button
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  continueButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ServiceConfirmation;
