import React from "react";
import { Text, View } from "react-native";

import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";

export default function Searchbar() {
  return (
    <View>
      <GooglePlacesAutocomplete
        placeholder="Search Locations"
        fetchDetails={true}
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true
          console.log(data, details);
          searchedLocation (details.geometry.location);
        }}
        query={{
          key: "AIzaSyDdeC17BaIvNS58KZMMXboiW0SF9jzo8Us",
          language: "en",
        }}
      />
    </View>
  );
}
