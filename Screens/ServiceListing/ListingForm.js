import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import { useDispatch } from 'react-redux';
import { addListing, updateListing } from '../../store/listingsSlice'; // Update path if necessary

const ListingForm = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { listing } = route.params || {}; // Gets listing if it's in edit mode
  const [title, setTitle] = useState(listing ? listing.title : '');
  const [description, setDescription] = useState(listing ? listing.description : '');

  const handleSubmit = async () => {
    if (title === '' || description === '') {
      Alert.alert('Error', 'All fields are required.');
      return;
    }

    const newListing = { title, description };

    try {
      if (listing) {
        // Editing existing listing
        await fetch(`https://terrascape-36ce0-default-rtdb.asia-southeast1.firebasedatabase.app/listings/<listing_id>.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newListing),
        });
        dispatch(updateListing({ ...newListing, id: listing.id }));
      } else {
        // Adding new listing
        const response = await fetch('https://terrascape-36ce0-default-rtdb.asia-southeast1.firebasedatabase.app/listings.json', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newListing),
        });
        const data = await response.json();
        dispatch(addListing(data));
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'Could not save the listing.');
    }
  };

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        value={title}
        onChangeText={setTitle}
        placeholder="Listing Title"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <TextInput
        value={description}
        onChangeText={setDescription}
        placeholder="Listing Description"
        style={{ borderBottomWidth: 1, marginBottom: 20 }}
      />
      <Button
        title={listing ? 'Update Listing' : 'Add Listing'}
        onPress={handleSubmit}
      />
    </View>
  );
};

export default ListingForm;
