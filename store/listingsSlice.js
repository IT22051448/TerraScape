import { createSlice } from '@reduxjs/toolkit';

const listingsSlice = createSlice({
  name: 'listings',
  initialState: {
    listings: [], // Holds all listings
    isLoading: false, // Handles loading state
    error: null, // To track errors
  },
  reducers: {
    // Set all listings when fetched from the server
    setListings: (state, action) => {
      state.listings = action.payload;
      state.isLoading = false;
      state.error = null;
    },
    
    // Add a new listing
    addListing: (state, action) => {
      state.listings.push(action.payload);
    },
    
    // Update an existing listing
    updateListing: (state, action) => {
      const index = state.listings.findIndex(listing => listing.id === action.payload.id);
      if (index !== -1) {
        state.listings[index] = { ...state.listings[index], ...action.payload };
      }
    },
    
    // Remove a listing
    deleteListing: (state, action) => {
      state.listings = state.listings.filter(listing => listing.id !== action.payload);
    },
    
    // Handle loading state
    setLoading: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    
    // Handle errors
    setError: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
  },
});

// Export actions to use in components
export const { setListings, addListing, updateListing, deleteListing, setLoading, setError } = listingsSlice.actions;

// Export the reducer to configure the store
export default listingsSlice.reducer;
