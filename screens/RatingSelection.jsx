import { Ionicons } from '@expo/vector-icons';
import { collection, addDoc } from 'firebase/firestore';
import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';

import { db } from '../firebase';
import { useRoute } from '@react-navigation/native';
import { AuthContext } from 'Providers/AuthContext';

const RatingSelection = ({ navigation }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const { user } = useContext(AuthContext);

  const route = useRoute();
  const { id } = route.params;
  console.log(id);

  const handleSubmit = async () => {
    if (rating > 0) {
      try {
        // Save the rating in Firestore
        await addDoc(collection(db, 'ratings'), {
          user: user.email,
          business: id,
          rating,
          comment,
          createdAt: new Date(),
        });
        console.log('Submitted');
        navigation.navigate('ReviewConfirmation');
      } catch (error) {
        console.error('Error saving rating:', error);
        Alert.alert('Error', 'There was an error saving your rating. Please try again.');
      }
    } else {
      Alert.alert('Please select a rating');
    }
  };

  const handlePhotos = () => {
    if (rating > 0) {
      navigation.navigate('PhotoUpload', { rating, comment });
    } else {
      alert('Please select a rating');
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.outerContainer}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={80}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="chevron-back-circle" size={45} color="#fff" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Text style={styles.heading}>How’s my service?</Text>
          <Text style={styles.subheading}>
            Your input is valuable in helping us better understand your needs and tailor our service
            accordingly.
          </Text>
          <View style={styles.starContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <TouchableOpacity key={star} onPress={() => setRating(star)}>
                <Ionicons
                  name={star <= rating ? 'star' : 'star-outline'}
                  size={40}
                  color="#FFB700"
                />
              </TouchableOpacity>
            ))}
          </View>
          <TextInput
            style={styles.commentBox}
            placeholder="Add a Comment..."
            value={comment}
            onChangeText={(text) => setComment(text)}
            multiline
          />
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.addButton} onPress={handlePhotos}>
              <Text style={styles.submitText}>Add Photos</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitText}>Submit Review</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  outerContainer: {
    flex: 1,
    backgroundColor: '#B0F092',
  },
  backButton: {
    position: 'absolute',
    top: 54,
    left: 20,
    zIndex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
    marginTop: 150,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  container: {
    flex: 1,
    marginTop: 20,
  },
  heading: {
    fontSize: 36,
    textAlign: 'center',
    color: '#017A13',
  },
  subheading: {
    textAlign: 'center',
    marginVertical: 15,
    color: '#525252',
  },
  starContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 20,
    backgroundColor: '#F4F0F0',
    padding: 5,
    elevation: 5,
    borderRadius: 20,
    // Drop shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  commentBox: {
    height: 100,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    backgroundColor: '#fff',
    marginBottom: 20,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  addButton: {
    backgroundColor: '#FFB700',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default RatingSelection;
