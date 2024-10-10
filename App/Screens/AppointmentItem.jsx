import React from "react";
import { Text, View, Image } from "react-native";

export default function AppointmentItem({ item }) {
  return (
    <View
      style={{
        with: 300,
      }}
    >
      <Image
        source={require("/Users/dulakshasiriwardana/Documents/GitHub/TerraScape/assets/leaves.jpg")}
        style={{ width: "100%", borderRadius: 10, height: 130 }}
      />
    </View>
  );
}
