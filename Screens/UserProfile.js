import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Image, ActivityIndicator, Button } from "react-native";
import { useSelector } from "react-redux"; // If you're using Redux to manage state
import { getUserByEmail } from "../utils/databases/firebaseDatabase"; // Adjust the import path as needed
import { useNavigation } from "@react-navigation/native";

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const email = useSelector((state) => state.auth.userData.email); // Assuming you store user data in Redux
  const navigation = useNavigation();

  useEffect(() => {
    const loadUserProfile = async () => {
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

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: 'https://w7.pngwing.com/pngs/954/328/png-transparent-computer-icons-user-profile-avatar-heroes-head-recruiter-thumbnail.png' }} // Replace with your dummy image URL
        style={styles.profileImage}
      />
      {userData && (
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{userData.fullName}</Text>
          <Text style={styles.userEmail}>{userData.email}</Text>
          <Text style={styles.userId}>User ID: {userData.uid}</Text>
        </View>
      )}
      <Button
        title="Logout"
        onPress={() => navigation.navigate("SignIn")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
  },
  userInfo: {
    alignItems: "center",
  },
  userName: {
    fontSize: 20,
    fontWeight: "bold",
  },
  userEmail: {
    fontSize: 16,
    color: "gray",
  },
  userId: {
    fontSize: 14,
    color: "gray",
  },
});

export default UserProfile;
