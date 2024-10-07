import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  TouchableOpacity,
  Alert,
  Image,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { addService } from "../../utils/databases/firebaseDatabase";
import { useSelector } from "react-redux";
import { useNavigation } from "@react-navigation/native";

const ScheduleService = () => {
  const [images, setImages] = useState([]);
  const [serviceType, setServiceType] = useState("");
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [rateType, setRateType] = useState("hour");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedTime, setSelectedTime] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const navigation = useNavigation();

  // Retrieve email from the Redux store
  const { userData } = useSelector((state) => state.auth);
  const serviceProviderEmail = userData?.email;

  const handleImageSelect = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Permission to access the camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const validUris = result.assets
        ? result.assets.map((asset) => asset.uri).filter((uri) => uri)
        : [];
      setImages([...images, ...validUris]);
    }
  };

  const handleDateConfirm = (event, date) => {
    if (date) {
      setSelectedDate(date);
      setShowDatePicker(false);
    }
  };

  const handleTimeConfirm = (event, time) => {
    if (time) {
      setSelectedTime(time);
      setShowTimePicker(false);
    }
  };

  const handleSubmit = async () => {
    if (
      !serviceType ||
      !description ||
      !amount ||
      !selectedDate ||
      !selectedTime
    ) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    const serviceData = {
      images,
      serviceType,
      description,
      amount,
      rateType,
      date: selectedDate.toLocaleDateString(),
      time: selectedTime.toLocaleTimeString(),
      serviceProviderEmail,
    };

    try {
      await addService(serviceData);
      Alert.alert("Service scheduled successfully!");
      // Navigate to the ServiceConfirmation page with service data
      navigation.navigate("ServiceConfirmation", serviceData);

      // Reset state
      setImages([]);
      setServiceType("");
      setDescription("");
      setAmount("");
      setRateType("hour");
      setSelectedDate(new Date());
      setSelectedTime(new Date());
    } catch (error) {
      console.error("Submit error:", error);
      Alert.alert("Error scheduling service:", error.message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>{"<"}</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Schedule a Service</Text>
      </View>
      <Button title="Select Images" onPress={handleImageSelect} />
      <View style={styles.imageContainer}>
        {images.map((uri, index) => (
          <Image key={index} source={{ uri }} style={styles.image} />
        ))}
      </View>

      <TextInput
        placeholder="Service Type"
        value={serviceType}
        onChangeText={setServiceType}
        style={styles.input}
      />
      <TextInput
        placeholder="Description"
        value={description}
        onChangeText={setDescription}
        style={styles.input}
      />
      <TextInput
        placeholder="Amount"
        value={amount}
        onChangeText={setAmount}
        keyboardType="numeric"
        style={styles.input}
      />

      <Text style={styles.label}>Select Rate Type:</Text>
      <View style={styles.rateContainer}>
        <TouchableOpacity onPress={() => setRateType("hour")}>
          <Text
            style={rateType === "hour" ? styles.selected : styles.unselected}
          >
            Hourly
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setRateType("day")}>
          <Text
            style={rateType === "day" ? styles.selected : styles.unselected}
          >
            Daily
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Select Date:</Text>
      <Text style={styles.dateText}>{selectedDate.toLocaleDateString()}</Text>
      <Button title="Pick Date" onPress={() => setShowDatePicker(true)} />
      {showDatePicker && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateConfirm}
        />
      )}

      <Text style={styles.label}>Select Time:</Text>
      <Text style={styles.dateText}>{selectedTime.toLocaleTimeString()}</Text>
      <Button title="Pick Time" onPress={() => setShowTimePicker(true)} />
      {showTimePicker && (
        <DateTimePicker
          value={selectedTime}
          mode="time"
          display="default"
          onChange={handleTimeConfirm}
        />
      )}

      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f0f8ff",
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    fontSize: 24,
    color: "#2980b9",
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    textAlign: "center",
    color: "#2c3e50",
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: "#2980b9",
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
    backgroundColor: "#ffffff",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
    borderColor: "#2980b9",
    borderWidth: 1,
  },
  label: {
    fontWeight: "bold",
    marginBottom: 5,
    color: "#34495e",
  },
  rateContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
  },
  selected: {
    fontWeight: "bold",
    color: "#2980b9",
  },
  unselected: {
    color: "#34495e",
  },
  dateText: {
    fontSize: 16,
    marginBottom: 10,
    color: "#34495e",
  },
  submitButton: {
    backgroundColor: "#27ae60",
    padding: 15,
    borderRadius: 5,
    marginTop: 50,
    alignItems: "center",
  },
  submitButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default ScheduleService;
