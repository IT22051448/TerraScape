import { getDatabase, ref, get, set, update, remove } from "firebase/database";
import { getFirebaseApp } from "../firebaseHelper";

// Initialize Realtime Database
const dbRealtime = getDatabase(getFirebaseApp());

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

// Function to request an appointment
export const requestAppointment = async (appointmentData) => {
  try {
    const appointmentsRef = ref(dbRealtime, "appointments/" + Date.now());
    await set(appointmentsRef, appointmentData);
    console.log("Appointment requested successfully.");
    return appointmentsRef.key; // Return the key of the new appointment
  } catch (error) {
    console.error("Error requesting appointment:", error);
    throw new Error("Error requesting appointment: " + error.message);
  }
};

// Function to fetch all appointments
export const getAllAppointments = async () => {
  try {
    const appointmentsRef = ref(dbRealtime, "appointments");
    const snapshot = await get(appointmentsRef);

    if (snapshot.exists()) {
      const appointments = snapshot.val();
      return appointments;
    } else {
      throw new Error("No appointments found.");
    }
  } catch (error) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

// Function to update the status of an appointment
export const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    const appointmentRef = ref(dbRealtime, `appointments/${appointmentId}`);
    await update(appointmentRef, { status: newStatus });
    console.log("Appointment status updated successfully.");
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw new Error("Error updating appointment status: " + error.message);
  }
};

// Function to delete an appointment (if needed)
export const deleteAppointment = async (appointmentId) => {
  try {
    const appointmentRef = ref(dbRealtime, `appointments/${appointmentId}`);
    await remove(appointmentRef);
    console.log("Appointment deleted successfully.");
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw new Error("Error deleting appointment: " + error.message);
  }
};

export const updateServiceNewFlag = async (serviceId, newService) => {
  try {
    const serviceRef = ref(dbRealtime, `services/${serviceId}`);
    await update(serviceRef, { newService });
    console.log(
      `Service ${serviceId} updated: newService set to ${newService}`
    );
  } catch (error) {
    console.error("Error updating service new flag:", error);
    throw new Error("Error updating service new flag: " + error.message);
  }
};
