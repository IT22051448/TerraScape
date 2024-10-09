// Import the necessary functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDZ7EU061KNDPWak-B8u4EM0xCvi-rR9vk",
  authDomain: "terrascape-234a7.firebaseapp.com",
  projectId: "terrascape-234a7",
  storageBucket: "terrascape-234a7.appspot.com",
  messagingSenderId: "242988064408",
  appId: "1:242988064408:web:7d31fd9fea36f62e963aed",
  measurementId: "G-MMSKWF4XLQ",
};

// Initialize Firebase app
export const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
