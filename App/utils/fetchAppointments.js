import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore"; // Correct imports
import { db } from "./firebaseConfig"; // Firestore instance from firebaseConfig.js

const useAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentCollection = collection(db, "appointments"); // Reference to "appointments" collection
        const snapshot = await getDocs(appointmentCollection); // Fetch the documents from the collection
        const fetchedAppointments = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        setAppointments(fetchedAppointments);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      }
    };

    fetchAppointments();
  }, []);

  return { appointments, loading };
};

export default useAppointments;
