import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ActivityIndicator, FlatList, TextInput, Animated, Easing } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { setListings, setLoading, setError } from '../../store/listingsSlice';
import Icon from 'react-native-vector-icons/Feather';
import { Picker } from '@react-native-picker/picker';
import MapWithSlider from './MapWithSlider'; // Import the MapWithSlider component

const CustomerServiceListings = ({ navigation }) => {
  const dispatch = useDispatch();
  const listings = useSelector(state => state.listings.listings);
  const isLoading = useSelector(state => state.listings.isLoading);
  const error = useSelector(state => state.listings.error);

  const [searchQuery, setSearchQuery] = useState('');
  const [filteredListings, setFilteredListings] = useState([]);
  const [sortOption, setSortOption] = useState('none');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showMap, setShowMap] = useState(false); // State for showing map
  const [filterRadius, setFilterRadius] = useState(1000); // Default radius

  const sidebarWidth = useRef(new Animated.Value(0)).current;

  const openSidebar = () => {
    Animated.timing(sidebarWidth, {
      toValue: 250,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

  const closeSidebar = () => {
    Animated.timing(sidebarWidth, {
      toValue: 0,
      duration: 300,
      easing: Easing.ease,
      useNativeDriver: false,
    }).start();
  };

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
    let updatedListings = listings.filter(item =>
      (item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase())) &&
      (selectedCategory === '' || selectedCategory === 'All' || item.category === selectedCategory)
    );

    // Apply sorting based on the selected sort option
    if (sortOption === 'priceLowToHigh') {
      updatedListings = updatedListings.sort((a, b) => parseFloat(a.servicePrice) - parseFloat(b.servicePrice));
    } else if (sortOption === 'priceHighToLow') {
      updatedListings = updatedListings.sort((a, b) => parseFloat(b.servicePrice) - parseFloat(a.servicePrice));
    } else if (sortOption === 'alphabetical') {
      updatedListings = updatedListings.sort((a, b) => a.title.localeCompare(b.title));
    }

    setFilteredListings(updatedListings);
  }, [searchQuery, listings, sortOption, selectedCategory]);

  if (isLoading) {
    return <ActivityIndicator size="large" color="#0000ff" />;
  }

  return (
  <View style={styles.container}>
    <View style={{ flex: 1 }}>
      <Animated.View style={[styles.sidebar, { width: sidebarWidth }]}>
        <TouchableOpacity onPress={closeSidebar} style={styles.closeButton}>
          <Icon name="x" size={30} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.sidebarText}>Filters</Text>
        <Picker
          selectedValue={sortOption}
          onValueChange={(itemValue) => setSortOption(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Sort by" value="none" />
          <Picker.Item label="Price: Low to High" value="priceLowToHigh" />
          <Picker.Item label="Price: High to Low" value="priceHighToLow" />
          <Picker.Item label="Alphabetical" value="alphabetical" />
        </Picker>
        <Picker
          selectedValue={selectedCategory}
          onValueChange={(itemValue) => setSelectedCategory(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select a Category" value="All" />
          <Picker.Item label="Garden Design" value="Garden Design" />
          <Picker.Item label="Lawn Care" value="Lawn Care" />
          <Picker.Item label="Hardscaping" value="Hardscaping" />
          <Picker.Item label="Water Services" value="Water Services" />
        </Picker>

        {/* New Button to Open Map with Slider */}
        <TouchableOpacity 
          style={styles.filterButton} 
          onPress={() => setShowMap(true)}>
          <Text style={styles.filterButtonText}>Increase Filter Radius</Text>
        </TouchableOpacity>
      </Animated.View>

      {showMap && (
        <MapWithSlider 
          initialRadius={filterRadius} 
          onClose={() => setShowMap(false)} 
        />
      )}

      <View style={{ flex: 1, padding: 20 }}>
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
          <TouchableOpacity onPress={openSidebar} style={styles.hamburgerIcon}>
            <Icon name="menu" size={30} color="#000" />
          </TouchableOpacity>
        </View>

        <TextInput
          style={styles.searchBar}
          placeholder="Search services..."
          value={searchQuery}
          onChangeText={text => setSearchQuery(text)}
        />

<FlatList
  data={filteredListings}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ListingDetail', { listing: item })} // Navigate to ListingDetail
    >
      <View style={styles.cardWrapper}>
        <View style={styles.cardContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: item.image || 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1471&q=80',
              }}
              style={styles.image}
              resizeMode="cover"
            />
          </View>

          <View style={styles.cardContent}>
            <Text style={styles.titleText}>{item.title}</Text>
            <Text style={styles.descriptionText}>Category: {item.category}</Text>
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
    </TouchableOpacity>
  )}
/>
      </View>
    </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container:{
    flex: 1,
    
    backgroundColor: '#f3f4f4',

  },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    backgroundColor: '#7a7a7a',
    zIndex: 2,
    paddingTop: 50,
  },
  closeButton: {
    padding: 10,
    alignSelf: 'flex-end',
  },
  sidebarText: {
    color: '#fff',
    padding: 20,
    fontSize: 18,
  },
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
    borderColor: '#5B8E55',
    borderWidth: 1,
  },
  cardWrapper: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 4,
    width: '100%',
  },
  cardContainer: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    height: 170,
  },
  imageContainer: {
    width: '30%',
    height: 170, // Maintain height for image
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
  },
  descriptionText: {
    fontSize: 14,
    marginBottom: 0,
    color: '#2D3748',
  },
  priceText: {
    fontSize: 13,
    marginBottom: 8,
    color: '#2D3748',
    fontWeight: 'bold'
  },
  button: {
    paddingVertical: 10,
    backgroundColor: '#5B8E55',
    borderRadius: 15,
  },
  buttonText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 10,
    borderRadius:10,
  },
  filterButton: {
    padding: 10,
    backgroundColor: '#5B8E55',
    borderRadius: 5,
    margin: 10,
    alignItems: 'center',
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  hamburgerIcon: {
    position: 'absolute',
    top: 10,
    right: 20,
  },
  picker: {
    color: '#fff',
    backgroundColor: '#666',
    margin: 10,
    borderRadius:5,
  },
});

export default CustomerServiceListings;
