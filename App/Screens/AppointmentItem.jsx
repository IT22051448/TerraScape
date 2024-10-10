import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";

export default function AppointmentItem({ item }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.imageUrl }} // Ensure it's wrapped in an object with 'uri'
        style={styles.image}
        resizeMode="cover" // Optional: Adjusts how the image should be resized to fit its container
      />
      <View style={styles.overlay}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.status}>STATUS: {item.status}</Text>
        <Text style={styles.date}>{item.date}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 300, // Set the desired width
    position: "relative", // To position text absolutely within this container
  },
  image: {
    width: "100%",
    height: 130,
    borderRadius: 10,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Optional: add a semi-transparent background for better text visibility
    borderRadius: 10, // Match the image border radius
  },
  title: {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: 16,
  },
  status: {
    color: "#ffffff",
    fontSize: 14,
  },
  date: {
    color: "#ffffff",
    fontSize: 12,
  },
});
