import React, { useContext } from "react";
import { Text, View, StyleSheet ,Image} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import UserLocationContext from "../context/userLocation";

export default function Map() {
  const { location, setLocation } = useContext(UserLocationContext);

  return (
    location?.latitude && (
      <View>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showsUserLocation={true}
          region={{
            latitude: location.latitude,
            longitude: location.longitude,
            latitudeDelta: 0.0422,
            longitudeDelta: 0.0421,
          }}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          >
            {/* 
<Image
  source={require("/Users/dulakshasiriwardana/Documents/GitHub/TerraScape/assets/gardnerIconn.png")}
/>
*/}
          </Marker>
        </MapView>
      </View>
    )
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});
