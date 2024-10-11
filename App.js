import React, { useState, useEffect } from "react";
import { StatusBar, StyleSheet, View, ActivityIndicator } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import SignIn from "./Screens/Login/SignIn";
import SignUp from "./Screens/Login/SignUp";
import CustomerHome from "./Screens/CustomerHome";
import ServiceProviderHome from "./Screens/ServiceProviderHome";
import CustomerServiceListings from "./Screens/ServiceListing/CustomerServiceListings";
import ListingPage from './Screens/ServiceListing/ListingPage';
import ListingForm from './Screens/ServiceListing/ListingForm';
import UserProfile from './Screens/UserProfile';
import { Provider } from "react-redux";
import { store } from "./store/store";
import { SettingsProvider } from "./Components/SettingsContext";
import Icon from 'react-native-vector-icons/Feather';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ListingDetail from './Screens/ServiceListing/ListingDetail';


// Stack Navigator for SignIn, SignUp, and other screens
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator for Customer
const CustomerBottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'CustomerHome') {
          iconName = 'home';
        } else if (route.name === 'CustomerService') {
          iconName = 'list';
        } else if (route.name === 'UserProfile') {
          iconName = 'user';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#61B458',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="CustomerHome" component={CustomerHome} options={{ headerShown: false }} />
    <Tab.Screen name="CustomerService" component={CustomerServiceListings} options={{ headerShown: false }} />
    <Tab.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
  </Tab.Navigator>
);

// Bottom Tab Navigator for Service Provider
const ServiceProviderBottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'ServiceProviderHome') {
          iconName = 'home';
        } else if (route.name === 'AddListing') {
          iconName = 'plus';
        } else if (route.name === 'UserProfile') {
          iconName = 'user';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#61B458',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="ServiceProviderHome" component={ServiceProviderHome} options={{ headerShown: false }} />
    <Tab.Screen name="AddListing" component={ListingForm} options={{ headerShown: false }} />
    <Tab.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }} />
  </Tab.Navigator>
);

// Main stack
const MainStack = ({ userRole }) => (
  <Provider store={store}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="UserProfile" component={UserProfile} />
    <Stack.Screen name="CustomerService" component={CustomerServiceListings}  />
      <Stack.Screen name="ServiceProviderHome" component={ServiceProviderHome}  />
      <Stack.Screen name="ListingDetail" component={ListingDetail} options={{ title: 'Listing Details' }}/>
      <Tab.Screen name="AddListing" component={ListingForm}  />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      {/* Render the correct tab navigator based on user role */}
      <Stack.Screen name="Main" component={userRole === "customer" ? CustomerBottomTabNavigator : ServiceProviderBottomTabNavigator} />
      <Stack.Screen name="Listings" component={ListingPage} />
    </Stack.Navigator>
  </Provider>
);

// Function to get user role from AsyncStorage
const getUserRoleFromStorage = async () => {
  try {
    // Simulate fetching from AsyncStorage (you could replace this with API call)
    const role = await AsyncStorage.getItem('userRole');
    return role ? role : null; // Return null if no role found
  } catch (error) {
    console.error('Error fetching user role:', error);
    return null;
  }
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null); // Role: 'customer' or 'serviceProvider'

  useEffect(() => {
    // Fetch the user role from async storage or API
    const fetchUserRole = async () => {
      try {
        const role = await getUserRoleFromStorage(); // Fetch role from storage or API
        setUserRole(role || 'customer'); // Default to customer if no role is found
      } catch (error) {
        console.error('Error in fetching user role:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SettingsProvider>
      <StatusBar style="auto" />
      <NavigationContainer>
        {/* Pass the userRole to the MainStack */}
        <MainStack userRole={userRole} />
      </NavigationContainer>
    </SettingsProvider>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
