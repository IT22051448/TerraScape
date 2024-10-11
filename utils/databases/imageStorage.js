import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getFirebaseApp } from "../firebaseHelper";

// Initialize Firebase Storage
const storage = getStorage(getFirebaseApp());

export const uploadImage = async (uri) => {
  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error("Failed to fetch the image");
    }
    const blob = await response.blob();
    const filename = uri.substring(uri.lastIndexOf("/") + 1);
    const imageRef = ref(storage, `images/${filename}`);

    await uploadBytes(imageRef, blob);
    const downloadURL = await getDownloadURL(imageRef);
    console.log("Image uploaded successfully:", downloadURL); // Log the URL
    return downloadURL;
  } catch (error) {
    console.error("Error uploading image:", error); // Log the error
    throw new Error("Error uploading image: " + error.message);
  }
};
