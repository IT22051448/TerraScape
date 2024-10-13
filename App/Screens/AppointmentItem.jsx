import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";

export default function AppointmentItem({ item }) {
  return (
    <View style={styles.container}>
      <Image
        source={{ uri: item.imageUrl }} 
        style={styles.image}
        resizeMode="cover" 
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
    width: 300, 
    position: "relative", 
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
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
    borderRadius: 10, 
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
