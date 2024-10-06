// firebaseDatabase.js
import {
  getDatabase,
  ref,
  get,
  query,
  orderByChild,
  equalTo,
} from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";

const db = getDatabase(getFirebaseApp());

export const getUserByEmail = async (email) => {
  try {
    const userRef = ref(db, "user");
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
