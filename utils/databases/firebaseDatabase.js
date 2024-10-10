import {
  getDatabase,
  ref,
  set,
  get,
  query,
  orderByChild,
  equalTo,
  remove,
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

export const getUserServices = async (email) => {
  try {
    const servicesRef = ref(dbRealtime, "services");
    const servicesQuery = query(
      servicesRef,
      orderByChild("serviceProviderEmail"),
      equalTo(email)
    );

    const snapshot = await get(servicesQuery);

    if (snapshot.exists()) {
      // Filter to only include services with newService: true
      const services = snapshot.val();
      const filteredServices = Object.entries(services)
        .filter(([key, value]) => value.newService === true)
        .reduce((acc, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});

      return filteredServices;
    } else {
      throw new Error("No services found for this user.");
    }
  } catch (error) {
    console.error("Error fetching user services:", error);
    throw error;
  }
};

// Delete service
export const deleteService = async (serviceId) => {
  try {
    const serviceRef = ref(dbRealtime, `services/${serviceId}`);
    await remove(serviceRef);
    console.log("Service deleted successfully.");
  } catch (error) {
    console.error("Error deleting service:", error);
    throw new Error("Error deleting service: " + error.message);
  }
};

// Update service
export const updateService = async (serviceId, updatedData) => {
  try {
    const serviceRef = ref(dbRealtime, `services/${serviceId}`);
    await set(serviceRef, updatedData);
    console.log("Service updated successfully.");
  } catch (error) {
    console.error("Error updating service:", error);
    throw new Error("Error updating service: " + error.message);
  }
};

export const getAllServices = async () => {
  try {
    const servicesRef = ref(dbRealtime, "services");
    const snapshot = await get(servicesRef);

    if (snapshot.exists()) {
      const services = snapshot.val();
      return services;
    } else {
      throw new Error("No services found.");
    }
  } catch (error) {
    console.error("Error fetching services:", error);
    throw error;
  }
};

export const getServiceBySid = async (sid) => {
  try {
    const servicesRef = ref(dbRealtime, "services");
    const servicesQuery = query(servicesRef, orderByChild("sid"), equalTo(sid));
    const snapshot = await get(servicesQuery);

    if (snapshot.exists()) {
      const services = snapshot.val();
      // Since sid is expected to be unique, we can return the first matched service
      const serviceKey = Object.keys(services)[0]; // Get the first key
      return { id: serviceKey, ...services[serviceKey] }; // Return the service object along with its ID
    } else {
      throw new Error("No service found with the provided SID.");
    }
  } catch (error) {
    console.error("Error fetching service by SID:", error);
    throw error;
  }
};
