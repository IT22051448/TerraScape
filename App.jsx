import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { useFonts } from 'expo-font';
import BusinessDetails from 'screens/BusinessDetails';
import Home from 'screens/Home';
import LoginScreen from 'screens/LoginScreen';

import { AuthContext, AuthProvider } from './Providers/AuthContext';
import BusinessList from './screens/BusinessList';
import FeedbackLanding from './screens/FeedbackLanding';
import PhotoUpload from './screens/PhotoUpload';
import RatingSelection from './screens/RatingSelection';
import ReviewConfirmation from './screens/ReviewConfirmation';
import ReviewsList from './screens/ReviewsList';
import { useContext } from 'react';
import Profile from 'screens/Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Stack Navigator
const StackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="RatingSelection">
      <Stack.Screen
        name="RatingSelection"
        component={RatingSelection}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="FeedbackLanding"
        component={FeedbackLanding}
        options={{ headerShown: false }}
      />

      <Stack.Screen name="PhotoUpload" component={PhotoUpload} options={{ headerShown: false }} />
      <Stack.Screen
        name="ReviewConfirmation"
        component={ReviewConfirmation}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="ReviewsList" component={ReviewsList} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
};

const HomeStack = () => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen name="Home" component={Home} options={{ headerShown: false }} />
      <Stack.Screen name="BusinessList" component={BusinessList} options={{ headerShown: false }} />
      <Stack.Screen
        name="BusinessDetails"
        component={BusinessDetails}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

const getTabBarVisibility = (route) => {
  const routeName = getFocusedRouteNameFromRoute(route) ?? 'Home';
  if (routeName === 'BusinessList' || routeName === 'BusinessDetails') {
    return { display: 'none' };
  }
};

// Bottom Tab Navigator
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'HomeTab') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ReviewsTab') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'FeedbackTab') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          }
          // Return the icon component based on the route name
          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4CAF50', // Active color for icons
        tabBarInactiveTintColor: 'gray', // Inactive color for icons
        headerShown: false, // Hide the header
        tabBarStyle: getTabBarVisibility(route),
      })}>
      <Tab.Screen
        name="HomeTab"
        component={HomeStack}
        options={({ route }) => ({
          title: 'Home',
        })}
      />
      <Tab.Screen
        name="FeedbackTab"
        component={StackNavigator}
        options={{ title: 'Feedback' }} // Title for the tab
      />
      <Tab.Screen
        name="ReviewsTab"
        component={ReviewsList} // Direct access to ReviewsList screen
        options={{ title: 'Review History' }} // Title for the tab
      />
      <Tab.Screen name="ProfileTab" component={Profile} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
};

const AuthStack = createStackNavigator();

const AuthNavigator = () => {
  return (
    <AuthStack.Navigator initialRouteName="Login">
      <AuthStack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
    </AuthStack.Navigator>
  );
};

const App = () => {
  const { user } = useContext(AuthContext);

  useFonts({
    'grotesque-regular': require('assets/fonts/BricolageGrotesque-Regular.ttf'),
    'grotesque-medium': require('assets/fonts/BricolageGrotesque-Medium.ttf'),
    'grotesque-bold': require('assets/fonts/BricolageGrotesque-SemiBold.ttf'),
    'Roboto-Regular': require('assets/fonts/Roboto-Regular.ttf'),
    'Roboto-Medium': require('assets/fonts/Roboto-Medium.ttf'),
    'Roboto-Bold': require('assets/fonts/Roboto-Bold.ttf'),
  });

  return <NavigationContainer>{user ? <TabNavigator /> : <AuthNavigator />}</NavigationContainer>;
};

export default () => (
  <AuthProvider>
    <App />
  </AuthProvider>
);
