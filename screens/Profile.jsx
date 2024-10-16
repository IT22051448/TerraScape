import { View, Text } from 'react-native';
import React, { useContext } from 'react';
import { AuthContext } from 'Providers/AuthContext';

export default function Profile() {
  const { user } = useContext(AuthContext);
  console.log(user);
  return (
    <View>
      <Text>Profile</Text>
    </View>
  );
}
