import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons'; // Adjusted import for Ionicons

const getCategoryImage = (category) => {
    switch (category) {
      case 'Garden Design':
        return 'https://i.pinimg.com/originals/c5/67/1b/c5671b90dbbd368ea0bcf6ef03a92272.jpg'; // Example image for Garden Design
      case 'Lawn Care':
        return 'https://media.istockphoto.com/id/475958716/photo/lawn-mower.jpg?s=612x612&w=0&k=20&c=TIGBHDkXS9IJbq84NHtfsFIPp_aqy6APWni2r_oS2NQ='; // Example image for Lawn Care
      case 'Hardscaping':
        return 'https://brennanslandscaping.com/wp-content/uploads/2019/06/What-is-Hardscape-Design_Manassas-VA.jpg'; // Example image for Hardscaping
      case 'Water Services':
        return 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRmxzdtlJxXbAeov1AZJyy26QabKCvgK1CbNQ&s'; // Example image for Water Services
      default:
        return 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'; // Default fallback image
    }
  };


const ListingDetail = ({ route, navigation }) => {
  const { listing } = route.params; // Receive the listing data from the previous screen

  return (
    <View style={styles.container}>
        <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
        <Text style={styles.title}>Listing Details</Text>
      </View>
      <View style={styles.imageContainer}>
      <Image
                        source={{ uri: listing.image || getCategoryImage(listing.category) }}
                        style={styles.image}
                        resizeMode="cover"
                      />
          </View>
    <View style={styles.cardWrapper}>
     <View style={styles.cardContainer}>
      <View style={styles.detailContent}>
        <Text style={styles.title}>{listing.title}</Text>
        <Text style={styles.category}>{listing.category}</Text>
        <Text style={styles.description}>{listing.description}</Text>
        <Text style={styles.price}>Price: ${listing.servicePrice} / {listing.payType}</Text>
      </View>
     </View>
    </View>
      <TouchableOpacity 
          style={styles.button1} 
          onPress={() => navigation.navigate('MakeAppointment', { listing })}
        >
          <Text style={styles.buttonText}>Make an Appointment</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.button2} 
          onPress={() => navigation.navigate('MakeAppointment', { listing })}
        >
          <Text style={styles.buttonText}>Add to Wishlist</Text>
        </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f3f4f4',
    },
    image: {
      width: '100%',
      height: 250,
      borderRadius: 10,
      marginBottom: 40,
      marginTop: 30,
    },
    detailContent: {
      padding: 10,
      flexGrow: 1, // Makes the detail content take up the available space
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginTop: 10,
      marginBottom: 10,
      color: '#333',
    },
    category: {
      fontSize: 16,
      color: '#333',
      marginBottom: 10,
    },
    description: {
      fontSize: 15,
      color: '#333',
      marginBottom: 20,
    },
    price: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 0, // Adds some space between the price and the bottom of the container
      color: '#000',
      alignSelf: 'flex-bottom', // Aligns the price at the bottom
    },
    button1: {
      marginTop: 20,
      backgroundColor: '#5B8E55',
      padding: 15,
      borderRadius: 10,
      alignItems: 'center',
    },
    button2: {
        marginTop: 20,
        backgroundColor: '#7a7a7a',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
      },
    buttonText: {
      color: '#fff',
      fontSize: 16,
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
      height: 250,
    },
  });
  
  export default ListingDetail;
  
