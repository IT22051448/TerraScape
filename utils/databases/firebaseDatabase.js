import {
  getDatabase,
  ref,
  set,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";

// Initialize Realtime Database
const dbRealtime = getDatabase(getFirebaseApp());

// Realtime Database Functions
export const getUserByEmail = async (email) => {
  try {
    const userRef = ref(dbRealtime, "user");
    const userQuery = query(userRef, orderByChild("email"), equalTo(email));
    const snapshot = await get(userQuery);

    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      throw new Error("No user found");
    }
  } catch (error) {
    console.error("Error fetching user by email:", error);
    throw error;
  }
};

export const addService = async (serviceData) => {
  try {
    console.log("Attempting to add service data:", serviceData);

    // Create a unique key for each service
    const newServiceRef = ref(dbRealtime, "services/" + Date.now());

    // Add newService: true to the service data
    const updatedServiceData = {
      ...serviceData,
      newService: true,
    };

    await set(newServiceRef, updatedServiceData);

    console.log("Service added successfully.");
    return newServiceRef.key;
  } catch (error) {
    console.error("Error adding service:", error);
    throw new Error("Error adding service: " + error.message);
  }
};
