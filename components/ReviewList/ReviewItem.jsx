import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const ReviewItem = ({ review }) => {
  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={20}
          color={i <= rating ? '#FFD700' : '#ccc'}
        />
      );
    }
    return stars;
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: review.image }} style={styles.image} />
      <View style={styles.infoContainer}>
        <Text style={styles.title}>{review.title}</Text>
        <Text style={styles.location}>{review.location}</Text>
        <Text style={styles.rating}>⭐ {review.rating.toFixed(1)}</Text>
        <Text style={styles.comment}>{review.comment}</Text>
        <View style={styles.starContainer}>{renderStars(review.rating)}</View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  image: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
  infoContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  location: {
    fontSize: 14,
    color: '#666',
  },
  rating: {
    fontSize: 14,
    marginVertical: 5,
  },
  comment: {
    fontSize: 13,
    color: '#666',
    marginBottom: 5,
  },
  starContainer: {
    flexDirection: 'row',
  },
});

export default ReviewItem;
