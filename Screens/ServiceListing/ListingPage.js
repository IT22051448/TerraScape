import React, { useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setListings, deleteListing, setLoading, setError } from '../../store/listingsSlice';

const ListingPage = ({ navigation }) => {
  const dispatch = useDispatch();
  const listings = useSelector(state => state.listings.listings);
  const isLoading = useSelector(state => state.listings.isLoading);
  const error = useSelector(state => state.listings.error);

  // Fetch listings from the server
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
      const response = await fetch(`https://terrascape-36ce0-default-rtdb.asia-southeast1.firebasedatabase.app/listings/${id}.json`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to delete the listing: ${errorMessage}`);
      }

      dispatch(deleteListing(id));
      Alert.alert('Success', 'Listing deleted successfully.');
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
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 16, backgroundColor: 'white', borderRadius: 8, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 8 }}>{item.title}</Text>
            <Text style={{ marginBottom: 8 }}>{item.description}</Text>
            <Text style={{ marginBottom: 8 }}>Price: ${item.servicePrice} USD</Text>
            <Text style={{ marginBottom: 8 }}>Payment Type: {item.payType}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{ padding: 10, backgroundColor: 'blue', borderRadius: 5, flex: 1, marginRight: 5 }}
                onPress={() => navigation.navigate('AddListing', { listing: item })}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 10, backgroundColor: 'red', borderRadius: 5, flex: 1 }}
                onPress={() => handleDelete(item.id)}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      <Button
        title="Add New Listing"
        onPress={() => navigation.navigate('AddListing')}
      />
    </View>
  );
};

export default ListingPage;
