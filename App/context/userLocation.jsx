import React, { createContext } from "react";

// Create the UserLocation context
const UserLocationContext = createContext();

// Export the context and its provider
export const UserLocationProvider = UserLocationContext.Provider;
export default UserLocationContext;
