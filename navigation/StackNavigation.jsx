import { createStackNavigator } from '@react-navigation/stack';
import HomeDashboard from 'screens/Home/HomeDashboard';
import Profile from 'screens/Profile/Profile';

const Stack = createStackNavigator();

export default function HomeStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen" component={HomeDashboard} />
      <Stack.Screen name="ProfileScreen" component={Profile} />
    </Stack.Navigator>
  );
}
