import React, { useState } from 'react';
import { View, TextInput, Alert, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useDispatch } from 'react-redux';
import { addListing, updateListing } from '../../store/listingsSlice';
import { db } from '../../utils/firebaseHelper'; // Import the db instance
import { ref, set, push } from "firebase/database";
import { Picker } from '@react-native-picker/picker';

const ListingForm = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { listing } = route.params || {};
  const [title, setTitle] = useState(listing ? listing.title : '');
  const [description, setDescription] = useState(listing ? listing.description : '');
  const [servicePrice, setServicePrice] = useState(listing ? listing.servicePrice : '');
  const [payType, setPayType] = useState(listing ? listing.payType : '');
  const [category, setCategory] = useState(listing ? listing.category : ''); // New state for category
  const [termsAccepted, setTermsAccepted] = useState(false);

  const handleSubmit = async () => {
    if (title === '' || description === '' || servicePrice === '' || !category || !termsAccepted) {
      Alert.alert('Error', 'All fields are required and terms must be accepted.');
      return;
    }

    const newListing = { title, description, servicePrice, payType, category }; // Include category in listing

    try {
      if (listing) {
        // Editing existing listing
        const listingRef = ref(db, `listings/${listing.id}`);
        await set(listingRef, newListing);
        dispatch(updateListing({ ...newListing, id: listing.id }));
      } else {
        // Adding new listing
        const newListingRef = ref(db, 'listings');
        const newListingKey = push(newListingRef).key;

        await set(ref(db, `listings/${newListingKey}`), newListing);
        dispatch(addListing({ ...newListing, id: newListingKey }));
      }
      navigation.goBack();
    } catch (error) {
      console.error("Error saving listing:", error);
      Alert.alert('Error', 'Could not save the listing.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{listing ? 'Update Service Listing' : 'Add Service Listing'}</Text>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Listing Title"
        style={styles.input}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Listing Description"
        style={styles.input}
      />
      <View style={styles.priceContainer}>
        <Text style={styles.priceSymbol}>$</Text>
        <TextInput
          value={servicePrice}
          onChangeText={setServicePrice}
          placeholder="Service Price"
          keyboardType="numeric"
          style={styles.priceInput}
        />
      </View>
      
      {/* Category Dropdown */}
      <Text style={styles.label}>Category</Text>
      <Picker
        selectedValue={category}
        style={styles.picker}
        onValueChange={(itemValue) => setCategory(itemValue)}
      >
        <Picker.Item label="Select a Category" value="" />
        <Picker.Item label="Garden Design" value="Garden Design" />
        <Picker.Item label="Lawn Care" value="Lawn Care" />
        <Picker.Item label="Hardscaping" value="Hardscaping" />
        <Picker.Item label="Water Services" value="Water Services" />
      </Picker>

      <Text style={styles.label}>Payment Type</Text>
      <Picker
        selectedValue={payType}
        style={styles.picker}
        onValueChange={(itemValue) => setPayType(itemValue)}
      >
        <Picker.Item label="Per hour" value="Per hour" />
        <Picker.Item label="Per service" value="Per service" />
      </Picker>
      <View style={styles.termsContainer}>
        <TouchableOpacity
          style={styles.checkboxContainer}
          onPress={() => setTermsAccepted(!termsAccepted)}
        >
          <Text style={termsAccepted ? styles.checkboxChecked : styles.checkboxUnchecked}>☑</Text>
          <Text style={styles.termsText}>I agree with the terms and conditions</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>{listing ? 'Update Listing' : 'Add Listing'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  input: {
    borderWidth: 2,
    borderColor: '#ccc', // Optional: color of the border
    marginBottom: 20,
    padding: 10,
    borderRadius: 10, // Rounded corners
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ccc', // Optional: color of the border
    borderRadius: 10,
  },
  priceSymbol: {
    fontSize: 18,
    marginRight: 5,
    position: 'absolute',
    left: 10,
  },
  priceInput: {
    padding: 10,
    flex: 1,
    paddingLeft: 30,
    borderRadius: 10, // Rounded corners
  },
  label: {
    marginBottom: 10,
    fontWeight: 'bold',
  },
  picker: {
    height: 50,
    width: '100%',
    marginBottom: 20,
    borderRadius: 10, // Rounded corners
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkboxChecked: {
    fontSize: 18,
    marginRight: 10,
  },
  checkboxUnchecked: {
    fontSize: 18,
    marginRight: 10,
    opacity: 0.5,
  },
  termsText: {
    fontSize: 14,
  },
  button: {
    backgroundColor: '#007bff',
    padding: 15,
    borderRadius: 10, // Rounded corners for the button
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ListingForm;
