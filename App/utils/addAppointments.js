// AddAppointments.js

import React, { useEffect } from "react";
import { db } from "./firebaseConfig"; // Adjust the import path as needed
import { collection, addDoc } from "firebase/firestore";

const AddAppointments = () => {
  useEffect(() => {
    const addDummyAppointments = async () => {
      try {
        const appointmentsCollection = collection(db, "appointments");

        // Add dummy data with status and imageUrl
        const dummyData = [
          {
            title: "Gardening Appointment",
            location: { latitude: 37.78825, longitude: -122.4324 },
            date: "2024-10-15",
            status: "Pending",
            imageUrl: "https://example.com/gardening.jpg",
          },
          {
            title: "Landscaping Consultation",
            location: { latitude: 37.78815, longitude: -122.432 },
            date: "2024-10-20",
            status: "Completed",
            imageUrl: "https://example.com/landscaping.jpg",
          },
          {
            title: "Tree Trimming Service",
            location: { latitude: 37.78805, longitude: -122.4315 },
            date: "2024-10-25",
            status: "Cancelled",
            imageUrl: "https://example.com/tree-trimming.jpg",
          },
        ];

        // Add each dummy appointment to Firestore
        for (const appointment of dummyData) {
          await addDoc(appointmentsCollection, appointment);
        }

        console.log("Dummy appointments added successfully!");
      } catch (error) {
        console.error("Error adding dummy appointments: ", error);
      }
    };

    addDummyAppointments();
  }, []);

  return null; // This component doesn't need to render anything
};

export default AddAppointments;
