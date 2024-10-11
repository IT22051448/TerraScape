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
import UserProfile from './Screens/UserProfile'
import { Provider } from "react-redux";
import { store } from "./store/store";
import { SettingsProvider } from "./Components/SettingsContext";
import Icon from 'react-native-vector-icons/Feather';

// Stack Navigator for SignIn, SignUp, and other screens
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Bottom Tab Navigator with icons
const BottomTabNavigator = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === 'CustomerHome') {
          iconName = 'home';
        } else if (route.name === 'CustomerService') {
          iconName = 'list';
        } else if (route.name === 'UserProfile') {
          iconName = 'briefcase';
        }
        return <Icon name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#61B458',
      tabBarInactiveTintColor: 'gray',
    })}
  >
    <Tab.Screen name="CustomerHome" component={CustomerHome} options={{ headerShown: false }}  />
    <Tab.Screen name="CustomerService" component={CustomerServiceListings} options={{ headerShown: false }}  />
    <Tab.Screen name="UserProfile" component={UserProfile} options={{ headerShown: false }}/>
  </Tab.Navigator>
);

const MainStack = () => (
  <Provider store={store}>
    <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="ServiceProviderHome" component={ServiceProviderHome} />
      <Stack.Screen name="SignIn" component={SignIn} />
      <Stack.Screen name="SignUp" component={SignUp} />
      <Stack.Screen name="Main" component={BottomTabNavigator} />
      <Stack.Screen name="Listings" component={ListingPage} />
      <Stack.Screen name="AddListing" component={ListingForm} />
    </Stack.Navigator>
  </Provider>
);

export default function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate a loading period
    return () => clearTimeout(timer);
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
      <StatusBar style="auto"  />
      <NavigationContainer>
        <MainStack />
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
