import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import { clearAuth } from "../store/authSlice";

const CustomerHome = () => {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const { userData } = useSelector((state) => state.auth);
  const fullName = userData?.fullName;
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // Handle sign out
  const handleSignOut = () => {
    dispatch(clearAuth());
    navigation.navigate("SignIn");
  };

  return (
    <ImageBackground
      source={require("../assets/images/background1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay} />

      {/* Top right - Image and name with role */}
      <View style={styles.topRightContainer}>
        <TouchableOpacity onPress={() => setDropdownVisible(!dropdownVisible)}>
          <Image
            source={require("../assets/images/profilepic.png")}
            style={styles.profileImage}
          />
        </TouchableOpacity>
        <Text style={styles.nameText}>{fullName}</Text>
        <Text style={styles.roleText}>(Customer)</Text>

        {/* Dropdown for Sign Out */}
        {dropdownVisible && (
          <View style={styles.dropdown}>
            <TouchableOpacity
              style={styles.dropdownItem}
              onPress={handleSignOut}
            >
              <Text style={styles.dropdownText}>Sign Out</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Top middle - TERRASCAPE title */}
      <Text style={styles.mainTitle}>TERRASCAPE</Text>

      {/* Middle - Welcome box */}
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeText}>Welcome to Terrascape</Text>
        <Text style={styles.readyText}>Find a Service you desire</Text>
      </View>

      {/* Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("MakeAppointment")}
        >
          <Text style={styles.buttonText}>Make an Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("temp")}
        >
          <Text style={styles.buttonText}>Ongoing Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("RequestedAppointments")}
        >
          <Text style={styles.buttonText}>View Requested Appointments</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("FeedbackReviews")}
        >
          <Text style={styles.buttonText}>Feedback and Reviews</Text>
        </TouchableOpacity>
      </View>
      {/* Sign Out Button */}
      <TouchableOpacity style={styles.buttonSecondary} onPress={handleSignOut}>
        <Text style={styles.buttonText}>Sign Out</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Dark overlay for better text visibility
  },
  topRightContainer: {
    position: "absolute",
    top: 20,
    right: 10,
    alignItems: "center",
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 35,
    borderWidth: 2,
    borderColor: "#fff",
  },
  nameText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000000",
    marginTop: 5,
  },
  roleText: {
    fontSize: 15,
    color: "#000000",
  },
  dropdown: {
    backgroundColor: "#fff",
    borderRadius: 8,
    marginTop: 70,
    padding: 5,
    elevation: 5,
    position: "absolute",
    right: 0,
    width: 120,
  },
  dropdownItem: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  dropdownText: {
    color: "#D32F2F", // Red color for sign out
    fontWeight: "bold",
    textAlign: "center",
  },
  mainTitle: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    marginTop: 30,
    marginBottom: 20,
    marginRight: 40,
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 10,
  },
  welcomeBox: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 30,
    borderRadius: 15,
    marginBottom: 30,
    marginTop: 100,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 26,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 10,
    color: "#333",
  },
  readyText: {
    fontSize: 20,
    color: "#666",
  },
  buttonContainer: {
    width: "90%",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#D2B48C",
    borderColor: "#8B4513",
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "100%",
    alignItems: "center",
    transitionDuration: "0.2s",
  },
  buttonSecondary: {
    backgroundColor: "#D2B48C",
    borderColor: "#8B4513",
    borderWidth: 2,
    padding: 15,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CustomerHome;
