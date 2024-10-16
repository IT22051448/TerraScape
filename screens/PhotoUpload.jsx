import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

import photo from '../assets/photo.png';
import { storage, db } from '../firebase';

const PhotoUpload = ({ navigation, route }) => {
  const [photos, setPhotos] = useState([]);
  const { rating, comment } = route.params;

  const handlePickImage = async () => {
    try {
      // Request permission to access media library
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
        return;
      }

      console.log('uploading');

      // Open image picker
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        const response = await fetch(uri);
        const blob = await response.blob();

        const storageRef = ref(
          storage,
          `images/${Date.now()}-${Math.random().toString(36).substring(7)}`
        );
        await uploadBytes(storageRef, blob);

        const downloadURL = await getDownloadURL(storageRef);
        console.log(downloadURL);

        await addDoc(collection(db, 'photos'), {
          url: downloadURL,
          createdAt: new Date(),
        });

        setPhotos([...photos, downloadURL]);
      }
    } catch (error) {
      console.error('Error picking image:', error);
    }
  };

  const handleSubmit = () => {
    try {
      // Save the rating in Firestore
      addDoc(collection(db, 'ratings'), {
        rating,
        comment,
        photos,
        createdAt: new Date(),
      });
      console.log('Submitted');
      navigation.navigate('ReviewConfirmation');
    } catch (error) {
      console.error('Error saving rating:', error);
      Alert.alert('Error', 'There was an error saving your rating. Please try again.');
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
      <Text style={styles.heading}>Showcase your Garden's Transformation</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.container}>
          <Image
            source={photo}
            style={{
              width: '100%',
              resizeMode: 'contain',
            }}
          />
          <View style={styles.photoContainer}>
            <TouchableOpacity
              style={{
                padding: 15,
              }}>
              <Ionicons
                name="cloud-upload-outline"
                size={40}
                color="#47B357"
                onPress={handlePickImage}
              />
            </TouchableOpacity>
            <View style={styles.photoBox}>
              {photos.map((uri, index) => (
                <Image key={index} source={{ uri }} style={styles.photo} />
              ))}
            </View>
          </View>

          <View style={styles.buttonContainer}>
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
    marginTop: 5,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  heading: {
    marginTop: 70,
    fontSize: 20,
    textAlign: 'center',
    marginBottom: 20,
    color: '#4CAF50',
    paddingHorizontal: 20,
  },
  uploadButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  uploadText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  photoContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#989898',
    height: 150,
  },
  cameraButton: {
    alignSelf: 'center',
    marginBottom: 10,
  },
  photoBox: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    gap: 10,
  },
  photo: {
    width: 50,
    height: 50,
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'column',
    gap: 10,
  },
  submitButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PhotoUpload;
