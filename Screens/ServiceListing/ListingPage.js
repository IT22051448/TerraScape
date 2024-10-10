import React, { useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setListings, deleteListing, setLoading, setError } from '../../store/listingsSlice'; // Update path if necessary

const ListingPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const listings = useSelector(state => state.listings.listings);
  const isLoading = useSelector(state => state.listings.isLoading);
  const error = useSelector(state => state.listings.error);

  // Fetch listings from the server (use your API)
  useEffect(() => {
    const fetchListings = async () => {
      dispatch(setLoading());
      try {
        const response = await fetch('https://terrascape-36ce0-default-rtdb.asia-southeast1.firebasedatabase.app/listings.json');
        const data = await response.json();
        dispatch(setListings(data));
      } catch (error) {
        dispatch(setError('Failed to fetch listings'));
      }
    };

    fetchListings();
  }, [dispatch]);

  const handleDelete = async (id) => {
    try {
      await fetch(`https://terrascape-36ce0-default-rtdb.asia-southeast1.firebasedatabase.app/listings/<listing_id>.json`, {
        method: 'DELETE',
      });
      dispatch(deleteListing(id));
    } catch (error) {
      Alert.alert('Error', 'Could not delete the listing.');
    }
  };

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  if (error) {
    return (
      <View>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ padding: 20 }}>
      <Button
        title="Add New Listing"
        onPress={() => navigation.navigate('AddListing')}
      />

      <FlatList
        data={listings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10, borderBottomWidth: 1, borderColor: '#ccc' }}>
            <Text style={{ fontSize: 18 }}>{item.title}</Text>
            <Text>{item.description}</Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('AddListing', { listing: item })}
            >
              <Text>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)}>
              <Text style={{ color: 'red' }}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ListingPage;
