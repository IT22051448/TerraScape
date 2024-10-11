import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from "react-native";
import { useSelector } from "react-redux"; // If you're using Redux to manage state
import { getUserByEmail } from "../utils/databases/firebaseDatabase"; // Adjust the import path as needed
import { useNavigation } from "@react-navigation/native";
import Ionicons from 'react-native-vector-icons/Ionicons'; // Adjusted import for Ionicons

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = useSelector((state) => state.auth.userData?.email); // Safely access email
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserProfile = async () => {
      if (!email) {
        // Handle the case when email is null
        navigation.navigate('SignIn');
        return; // Optionally redirect or show a message
      }

      try {
        const data = await getUserByEmail(email);
        setUserData(data ? Object.values(data)[0] : null); // Get the first user object
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, [email]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorMessage}>User data not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Render back button only if the role is service provider */}
      {userData.role === 'ServiceProvider' && (
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('ServiceProviderHome')}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
      )}
      
      <Image
        source={{ uri: 'https://w7.pngwing.com/pngs/954/328/png-transparent-computer-icons-user-profile-avatar-heroes-head-recruiter-thumbnail.png' }} // Replace with your dummy image URL
        style={styles.profileImage}
      />

      <View style={styles.profileCard}>
        <View style={styles.profileHeader}>
          <Text style={styles.profileHeaderTitle}>User Profile</Text>
          <Text style={styles.profileHeaderSubtitle}>This is some information about the user.</Text>
        </View>
        <View style={styles.profileInfo}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Full name:</Text>
            <Text style={styles.infoValue}>         {userData.fullName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email address:</Text>
            <Text style={styles.infoValue}> {userData.email}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Phone number:</Text>
            <Text style={styles.infoValue}>(123) 456-7890</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Address:</Text>
            <Text style={styles.infoValue}>            123 Main St{'\n'}            Anytown, USA 12345</Text>
          </View>
        </View>
      </View>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("SignIn")}
      >
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorMessage: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
  profileImage: {
    width: 200,
    height: 200,
    borderRadius: 50,
    marginBottom: 20,
    alignSelf: "center",
    marginTop:100,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    zIndex: 1,
  },
  profileCard: {
    backgroundColor: "white",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e2e2",
    paddingBottom: 20,
    marginTop:30,
  },
  profileHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  profileHeaderTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  profileHeaderSubtitle: {
    marginTop: 5,
    fontSize: 14,
    color: "gray",
  },
  profileInfo: {
    borderTopWidth: 1,
    borderTopColor: "#e2e2e2",
    paddingHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "gray",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    flex: 1,
    flexWrap: "wrap",
    marginLeft: 10,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 14,
  },
  button: {
    marginTop:30,
    paddingVertical: 10,
    backgroundColor: '#7a7a7a',
    borderRadius: 8,
  },
});

export default UserProfile;
