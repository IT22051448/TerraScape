import React from "react";
import { View, Text, StyleSheet, ImageBackground, TouchableOpacity,Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CustomerHome = () => {
  const navigation = useNavigation();

  return (
    <ImageBackground
    source={require("../assets/images/background1.jpg")}
    style={{ flex: 1 }}
    resizeMode="cover"
    >
      <View style={styles.overlay}>
      <View style={styles.profileSection}>
          <Image
            accessibilityLabel="Profile image"
            source={require('../assets/images/terrascape.png')}
            style={styles.profileImage}
          />
          <View style={styles.profileText}>
            <Text style={styles.profileTitle}>TerraScape</Text>
            
          </View>
         
        </View>
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to TerraScape</Text>
          <Text style={styles.subtitle}>
            TerraScape is your all-in-one platform for landscaping and gardening services.
          </Text>
          <Text style={styles.description}>
            Whether you are a customer looking for services or a service provider wanting to list your offerings, we have you covered! Explore our service listings or add your own and be part of our growing community.
          </Text>
          <TouchableOpacity
            style={styles.exploreButton}
            onPress={() => navigation.navigate("CustomerService")}
          >
            <Text style={styles.buttonText}>Explore Listings</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    
    
  },
  profileImage: {
    width: 47,
    height: 47,
    borderRadius: 24,
    marginRight: 10,
  },
  profileText: {
    flexDirection: 'column',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFF',
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 15,
    padding: 20,
    marginHorizontal: 20,
    width: "90%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#555",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 22,
  },
  exploreButton: {
    backgroundColor: "#008CBA",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
  },
  buttonText: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "600",
  },
});

export default CustomerHome;
