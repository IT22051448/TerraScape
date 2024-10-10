import { configureStore } from '@reduxjs/toolkit'; // Correct import path
import authSlice from './authSlice'; // Ensure this path is correct
import listingsSlice from './listingsSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        listings: listingsSlice
    }
    
});
