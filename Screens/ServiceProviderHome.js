import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";

const ServiceProviderHome = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Welcome to the Service Provider Home Page
      </Text>
      <Text style={styles.subtitle}>
        This is where you can manage your services and translations.
      </Text>
      <Button
        title="Go Back to Sign In"
        onPress={() => navigation.navigate("SignIn")}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
  },
});

export default ServiceProviderHome;
