// Import the functions you need from the SDKs you need
import AsyncStorage from '@react-native-async-storage/async-storage';
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: 'AIzaSyCKQEfTUheatJp5Fs3hAqxCNnBDynTXSbk',
  authDomain: 'teratest-374b8.firebaseapp.com',
  projectId: 'teratest-374b8',
  storageBucket: 'teratest-374b8.appspot.com',
  messagingSenderId: '486263872135',
  appId: '1:486263872135:web:2db45f1e0bee344f037622',
  measurementId: 'G-8Q0M21K1Q6',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

const db = getFirestore(app);
const rDb = getDatabase(app);
const storage = getStorage(app);

export { db, rDb, storage, auth };
