import { getApp, getApps, initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

let firebaseApp;

export const getFirebaseApp = () => {
  if (firebaseApp) {
    return firebaseApp;
  }

  const firebaseConfig = {
    apiKey: "AIzaSyB0Rxb0Od5iBZb3EOnIrZns6WRwmgLVVD8",
    authDomain: "terrascape-36ce0.firebaseapp.com",
    projectId: "terrascape-36ce0",
    databaseURL:
      "https://terrascape-36ce0-default-rtdb.asia-southeast1.firebasedatabase.app",
    storageBucket: "terrascape-36ce0.appspot.com",
    messagingSenderId: "70901660727",
    appId: "1:70901660727:web:5f6961777d477bb94753b2",
    measurementId: "G-LD4D3EBLR1",
  };

  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

  initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage),
  });

  firebaseApp = app;

  return app;
};

const db = getDatabase(getFirebaseApp()); // Call the app getter
export { db };
