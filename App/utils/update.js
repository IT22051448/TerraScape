import { db } from "./firebaseConfig"; // Adjust the import path as needed
import { doc, updateDoc } from "firebase/firestore";

const updateAppointmentStatus = async (appointmentId, newStatus) => {
  try {
    // Reference to the appointment document
    const appointmentDoc = doc(db, "appointments", appointmentId);

    // Update the status field of the appointment
    await updateDoc(appointmentDoc, { status: newStatus });

    console.log("Appointment status updated successfully!");
  } catch (error) {
    console.error("Error updating appointment status: ", error);
  }
};

export default updateAppointmentStatus;
