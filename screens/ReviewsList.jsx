import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';

import ReviewItem from '../components/ReviewList/ReviewItem'; // Importing the ReviewItem component
import colors from 'constants/colors';

const ReviewsList = () => {
  // Sample data for reviews
  const reviews = [
    {
      id: '1',
      title: '876 Green town',
      location: 'Rosaville',
      rating: 4.9,
      comment: 'Rosav ilfsdgsdfh hfgjfjsjjhjg jkleghfhd gssssdf fhshfh hshfh fhshsh',
      image: 'https://via.placeholder.com/150', // Example image URL
    },
    {
      id: '2',
      title: '876 Green town',
      location: 'Rosaville',
      rating: 4.5,
      comment: 'Rosav ilfsdgsdfh hfgjfjsjjhjg jkleghfhd gssssdf fhshfh hshfh fhshsh',
      image: 'https://via.placeholder.com/150',
    },
    {
      id: '3',
      title: '876 Green town',
      location: 'Rosaville',
      rating: 4.7,
      comment: 'Rosav ilfsdgsdfh hfgjfjsjjhjg jkleghfhd gssssdf fhshfh hshfh fhshsh',
      image: 'https://via.placeholder.com/150',
    },
  ];

  return (
    <View>
      <View
        style={{
          display: 'flex',
          alignItems: 'cetner',
          backgroundColor: colors.primary,
        }}>
        <Text
          style={{
            fontSize: 24,
            textAlign: 'center',
            marginVertical: 60,
            color: '#4CAF50',
          }}>
          Review History
        </Text>
      </View>

      <View
        style={{
          marginTop: -20,
          backgroundColor: '#fff',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}>
        <FlatList
          styles={{
            marginTop: 20,
          }}
          data={reviews}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ReviewItem review={item} />}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    textAlign: 'center',
    marginVertical: 20,
    color: '#4CAF50',
  },
  listContainer: {
    paddingHorizontal: 10,
  },
});

export default ReviewsList;
