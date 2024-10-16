import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ReviewConfirmation = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.message}>Your Review Added Successfully</Text>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('ReviewsList')}>
        <Text style={styles.buttonText}>View Reviews</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#E0F7E1',
  },
  message: {
    fontSize: 20,
    marginBottom: 20,
    color: '#4CAF50',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ReviewConfirmation;
