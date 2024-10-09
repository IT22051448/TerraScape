import React, { useState, useEffect } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { updateService } from "../utils/databases/customerfirebaseDatabase"; // Import the updateService function

const EditService = ({ serviceId, initialData, onClose }) => {
  const [serviceType, setServiceType] = useState(initialData.serviceType);
  const [description, setDescription] = useState(initialData.description);
  const [amount, setAmount] = useState(initialData.amount);
  const [date, setDate] = useState(initialData.date);
  const [time, setTime] = useState(initialData.time);

  const handleUpdate = async () => {
    try {
      const updatedData = {
        serviceType,
        description,
        amount,
        date,
        time,
        newService: true, // Ensure this remains true if necessary
      };
      await updateService(serviceId, updatedData);
      Alert.alert("Success", "Service updated successfully!");
      onClose(); // Close the edit modal or navigate back
    } catch (error) {
      Alert.alert("Error", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Service Type:</Text>
      <TextInput
        style={styles.input}
        value={serviceType}
        onChangeText={setServiceType}
      />
      <Text style={styles.label}>Description:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.label}>Amount:</Text>
      <TextInput
        style={styles.input}
        value={amount}
        keyboardType="numeric"
        onChangeText={setAmount}
      />
      <Text style={styles.label}>Date:</Text>
      <TextInput style={styles.input} value={date} onChangeText={setDate} />
      <Text style={styles.label}>Time:</Text>
      <TextInput style={styles.input} value={time} onChangeText={setTime} />
      <Button title="Update Service" onPress={handleUpdate} />
      <Button title="Cancel" onPress={onClose} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 5,
    elevation: 2,
  },
  label: {
    fontWeight: "bold",
    marginVertical: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
  },
});

export default EditService;
