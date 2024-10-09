import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, TextInput,Button } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setListings, setLoading, setError } from '../../store/listingsSlice';
import Icon from 'react-native-vector-icons/Feather';

const CustomerServiceListings = ({ navigation }) => {
  const dispatch = useDispatch();
  const listings = useSelector(state => state.listings.listings);
  const isLoading = useSelector(state => state.listings.isLoading);
  const error = useSelector(state => state.listings.error);

  // State to store search query and filtered listings
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState([]);
  

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

  useEffect(() => {
    // If search query is empty, display all listings
    if (searchQuery.trim() === '') {
      setFilteredListings(listings);
    } else {
      // Filter the listings based on the search query if there's a search term
      const filtered = listings.filter(item =>
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredListings(filtered);
    }
  }, [searchQuery, listings]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
    <View style={{ padding: 20 }}>
      {/* Profile Section */}
      <View style={styles.profileSection}>
        <Image
          accessibilityLabel="Profile image"
          source={require('../../assets/images/terrascape.png')}
          style={styles.profileImage}
        />
        <View style={styles.profileText}>
          <Text style={styles.profileTitle}>TerraScape</Text>
          <Text style={styles.profileSubtitle}>Service Listings</Text>
        </View>
        <TouchableOpacity onPress={() => navigation.openDrawer('Filters')} style={styles.hamburgerIcon}>
        <Icon name="menu" size={30} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search services..."
        value={searchQuery}
        onChangeText={text => setSearchQuery(text)}
      />

      {/* Listings */}
      <FlatList
        data={filteredListings}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.cardWrapper}>
            <View style={styles.cardContainer}>
              {/* Image Section */}
              <View style={styles.imageContainer}>
                <Image
                  source={{
                    uri: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
                  }}
                  style={styles.image}
                  resizeMode="cover"
                />
              </View>

              {/* Content Section */}
              <View style={styles.cardContent}>
                <Text style={styles.titleText}>{item.title}</Text>
                <Text style={styles.descriptionText}>{item.description}</Text>
                <Text style={styles.priceText}>Price: ${item.servicePrice} / {item.payType}</Text>

                <TouchableOpacity
                  style={styles.button}
                  onPress={() => navigation.navigate('AddListing', { listing: item })}
                >
                  <Text style={styles.buttonText}>Schedule Appointment</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 47,
    height: 47,
    borderRadius: 24,
    marginRight: 10,
  },
  profileText: {
    flexDirection: 'column',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  profileSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  searchBar: {
    marginBottom: 20,
    padding: 10,
    borderRadius: 8,
    borderColor: '#007BFF',
    borderWidth: 1,
  },
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
  },
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
  },
  imageContainer: {
    width: '35%',
    height: 120,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
    overflow: 'hidden',
    marginTop: 25,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  cardContent: {
    flex: 1,
    padding: 16,
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 14,
    marginBottom: 8,
    color: '#4A5568',
  },
  priceText: {
    fontSize: 16,
    marginBottom: 8,
    color: '#2D3748',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: '#007BFF',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 10,
  },
  hamburgerIcon: {
    position: 'absolute', 
    top: 10,              
    right: 20,            
  },
});

export default CustomerServiceListings;
