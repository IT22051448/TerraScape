import React, { useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Alert, ActivityIndicator,StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setListings, deleteListing, setLoading, setError } from '../../store/listingsSlice';
import { Ionicons } from 'react-native-vector-icons';

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

  // Function to confirm deletion
  const confirmDelete = (id) => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete this listing?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: () => handleDelete(id) }
      ],
      { cancelable: true }
    );
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
    <View style={{ flex: 1, padding: 20 }}>
      <View style={styles.header}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        </View>
      <Text style={styles.title}>All listings</Text>
      <View style={styles.divider}></View>
      <FlatList
        data={listings}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 80, }} // Adjust this value to create space for the button
        renderItem={({ item }) => (
          <View style={{ padding: 16, backgroundColor: 'white', borderRadius: 10, marginBottom: 16, elevation: 2 }}>
            <Text style={{ fontSize: 19, fontWeight: 'bold', marginBottom:5}}>{item.title}</Text>
            <Text style={{ marginBottom: 4 }}>Category: {item.category}</Text>
            
            <Text style={{ marginBottom: 4 }}>Price: ${item.servicePrice} USD</Text>
            <Text style={{ marginBottom: 4 }}>Payment Type: {item.payType}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <TouchableOpacity
                style={{ padding: 10, backgroundColor: '#5B8E55', borderRadius: 8, flex: 1, marginRight: 5 }}
                onPress={() => navigation.navigate('AddListing', { listing: item })}
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={{ padding: 10, backgroundColor: 'red', borderRadius: 8, flex: 1 }}
                onPress={() => confirmDelete(item.id)} // Call the confirmDelete function
              >
                <Text style={{ color: 'white', textAlign: 'center' }}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
      
      <TouchableOpacity
        style={{ padding: 10, backgroundColor: '#5B8E55', borderRadius: 8, position: 'absolute', bottom: 20, left: 20, right: 20 }}
        onPress={() => navigation.navigate('AddListing')} // Call the confirmDelete function
      >
        <Text style={{ color: 'white', textAlign: 'center' }}>Add New Listing</Text>
      </TouchableOpacity>
    </View>
  );
};

export default ListingPage;

const styles = StyleSheet.create({
  title: {
    fontSize: 24, // Increase the font size for the title
    fontWeight: 'bold', // Make the title bold
    marginBottom: 10, // Space below the title
    marginBottom:20, // Allow title to take available space
    textAlign: 'center', // Center the title
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10, // Space below the header
  },
  divider: {
    height: 2, // Height of the divider
    backgroundColor: '#ccc', // Color of the divider
    marginBottom: 20, // Space below the divider
  },
})
