import React from "react";
import { Text, View, Image, StyleSheet } from "react-native";

export default function Header() {
  return (
    <View styles={styles.container}>
      
      <Image
        source={require("/Users/dulakshasiriwardana/Documents/GitHub/TerraScape/assets/logo.png")}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
