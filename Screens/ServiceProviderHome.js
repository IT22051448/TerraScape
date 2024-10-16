import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  Image,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";

const ServiceProviderHome = () => {
  const navigation = useNavigation();
  const route = useRoute();

  // Use optional chaining or default value for fullName
  const { fullName = "Service Provider" } = route.params;

  return (
    <ImageBackground
      source={require("../assets/images/background1.jpg")}
      style={styles.background}
      resizeMode="cover"
    >
      {/* Top right - Image and name with role */}
      <View style={styles.topRightContainer}>
        <Image
          source={require("../assets/images/profilepic.png")}
          style={styles.profileImage}
          
        />
        <Text style={styles.nameText}>{fullName}</Text>
        <Text style={styles.roleText}>(Service Provider)</Text>
      </View>

      {/* Top middle - TERRASCAPE title */}
      <Text style={styles.mainTitle}>TERRASCAPE</Text>

      {/* Middle - Welcome box */}
      <View style={styles.welcomeBox}>
        <Text style={styles.welcomeText}>Welcome to Terrascape</Text>
        <Text style={styles.readyText}>Ready to start your day?</Text>
      </View>

      {/* Buttons - Manage Services and Go Back */}
      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => navigation.navigate("Listings")}
      >
        <Text style={styles.buttonText}>Manage Listings</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => navigation.navigate("AddListing")}
      >
        <Text style={styles.buttonText}>Add New Listing</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.buttonPrimary}
        onPress={() => navigation.navigate("UserProfile")}
      >
        <Text style={styles.buttonText}>User Profile</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.buttonSecondary}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "flex-start", // Aligning elements at the top
    alignItems: "center",
  },
  topRightContainer: {
    position: "absolute",
    top: 20,
    right: 10,
    alignItems: "center",
  },

  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#fff",
  },
  nameText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginTop: 5,
  },
  roleText: {
    fontSize: 14,
    color: "#666",
  },
  mainTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 30,
    textAlign: "center",
  },
  welcomeBox: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
    marginTop: 100,
    width: "90%",
    alignItems: "center",
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    textDecorationLine: "underline",
    marginBottom: 10,
  },
  readyText: {
    fontSize: 18,
    color: "#666",
  },
  buttonPrimary: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: "90%",
    alignItems: "center",
  },
  buttonSecondary: {
    backgroundColor: "#7a7a7a",
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

export default ServiceProviderHome;
