import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  FlatList,
  Image,
} from "react-native";
import { updateService } from "../../utils/databases/firebaseDatabase";
import { useRoute, useNavigation } from "@react-navigation/native";
import * as ImagePicker from "expo-image-picker"; // Updated import
import DateTimePicker from "@react-native-community/datetimepicker";
import { Picker } from "@react-native-picker/picker";

const UpdateService = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { serviceId, serviceDetails } = route.params;

  const parseDate = (dateStr) => {
    const parts = dateStr.split("/");
    return new Date(`${parts[2]}-${parts[1]}-${parts[0]}`);
  };

  const parseTime = (timeStr) => {
    const [hours, minutes] = timeStr.split(":");
    return new Date(`1970-01-01T${hours}:${minutes}:00`);
  };

  const [serviceType, setServiceType] = useState(serviceDetails.serviceType);
  const [description, setDescription] = useState(serviceDetails.description);
  const [amount, setAmount] = useState(serviceDetails.amount);
  const [rateType, setRateType] = useState(serviceDetails.rateType || "day");
  const [date, setDate] = useState(parseDate(serviceDetails.date));
  const [time, setTime] = useState(parseTime(serviceDetails.time));
  const [images, setImages] = useState(serviceDetails.imageUrls || []);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const handleUpdate = async () => {
    try {
      const formattedDate = `${String(date.getDate()).padStart(
        2,
        "0"
      )}/${String(date.getMonth() + 1).padStart(2, "0")}/${date.getFullYear()}`;
      const hours = String(time.getHours()).padStart(2, "0");
      const minutes = String(time.getMinutes()).padStart(2, "0");
      const formattedTime = `${hours}:${minutes}:00`;

      await updateService(serviceId, {
        serviceType,
        description,
        amount,
        rateType,
        date: formattedDate,
        time: formattedTime,
        imageUrls: images,
      });

      Alert.alert("Success", "Service updated successfully", [
        {
          text: "OK",
          onPress: () => {
            navigation.navigate("ViewScheduledServices", { refresh: true });
          },
        },
      ]);
    } catch (error) {
      console.error("Error updating service:", error);
      Alert.alert("Error", "There was an issue updating the service.");
    }
  };

  const addImage = async () => {
    Alert.alert(
      "Sorry Under Maintenance",
      "Adding images is temporarily under maintenance."
    );
  };

  const removeImage = (uri) => {
    setImages(images.filter((image) => image !== uri));
  };

  const onChangeDate = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const onChangeTime = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      setTime(selectedTime);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backButtonText}>{"< Back"}</Text>
      </TouchableOpacity>

      <Text style={styles.heading}>Update Your Service</Text>

      <Text style={styles.label}>Service Type</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter service type"
        value={serviceType}
        onChangeText={setServiceType}
      />

      <Text style={styles.label}>Description</Text>
      <TextInput
        style={styles.input}
        placeholder="Detailed Description"
        value={description}
        onChangeText={setDescription}
        multiline
        numberOfLines={4}
      />

      <Text style={styles.label}>Amount ($)</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Rate Type</Text>
      <Picker
        selectedValue={rateType}
        style={styles.picker}
        onValueChange={(itemValue) => setRateType(itemValue)}
      >
        <Picker.Item label="By Hour" value="hour" />
        <Picker.Item label="By Day" value="day" />
      </Picker>

      <Text style={styles.label}>Date</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        <Text style={styles.placeholderText}>{`Selected Date: ${String(
          date.getDate()
        ).padStart(2, "0")}/${String(date.getMonth() + 1).padStart(
          2,
          "0"
        )}/${date.getFullYear()}`}</Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={date}
          mode="date"
          display="default"
          onChange={onChangeDate}
          minimumDate={new Date()} // Prevent past dates
        />
      )}

      <Text style={styles.label}>Time</Text>
      <TouchableOpacity
        onPress={() => setShowTimePicker(true)}
        style={styles.input}
      >
        <Text
          style={styles.placeholderText}
        >{`Selected Time: ${time.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })}`}</Text>
      </TouchableOpacity>
      {showTimePicker && (
        <DateTimePicker
          value={time}
          mode="time"
          display="default"
          onChange={onChangeTime}
        />
      )}

      <TouchableOpacity style={styles.imageButton} onPress={addImage}>
        <Text style={styles.buttonText}>Add Images</Text>
      </TouchableOpacity>

      <FlatList
        data={images}
        keyExtractor={(item) => item}
        renderItem={({ item }) => (
          <View style={styles.imageContainer}>
            <Image source={{ uri: item }} style={styles.image} />
            <TouchableOpacity
              onPress={() => removeImage(item)}
              style={styles.removeButton}
            >
              <Text style={styles.buttonText}>Remove</Text>
            </TouchableOpacity>
          </View>
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.updateButton} onPress={handleUpdate}>
        <Text style={styles.buttonText}>Update Service</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#e9f5fb",
    flex: 1,
    borderRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 3,
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
    fontSize: 26,
    fontWeight: "bold",
    color: "#34495e",
    marginBottom: 20,
    textAlign: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#34495e",
  },
  input: {
    borderWidth: 1,
    borderColor: "#2980b9",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  placeholderText: {
    color: "#7f8c8d",
  },
  picker: {
    borderWidth: 1,
    borderColor: "#2980b9",
    borderRadius: 5,
    marginBottom: 10,
  },
  imageButton: {
    backgroundColor: "#2980b9",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginBottom: 10,
  },
  updateButton: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },
  imageContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 5,
    marginRight: 10,
  },
  removeButton: {
    backgroundColor: "#c0392b",
    padding: 5,
    borderRadius: 5,
  },
});

export default UpdateService;
