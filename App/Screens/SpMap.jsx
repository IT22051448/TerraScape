import React from "react";
import { View, StyleSheet } from "react-native";
import Map from "./map";
import Header from "./header";

const SpMap = () => {
  return (
    <View>

    <View style={styles.headerContainer}>
      <Header />
    </View>
      
      <Map />
    </View>
  );
};
const styles = StyleSheet.create({
  headerContainer:{
    position: "absolute",
    zIndex: 10,
    padding: 10,
    width: "100%",
    paddingHorizontal: 20,

  }
});
export default SpMap;
