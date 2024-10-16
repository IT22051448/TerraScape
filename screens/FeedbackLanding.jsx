import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const FeedbackLanding = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Job Completed Successfully</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('RatingSelection')}>
        <Text style={styles.buttonText}>Share us your thoughts</Text>
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
  heading: {
    fontSize: 24,
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

export default FeedbackLanding;
