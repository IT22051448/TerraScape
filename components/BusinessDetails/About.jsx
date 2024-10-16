import React from 'react';
import { View, Text, ScrollView } from 'react-native';

export default function About({ business }) {
  return (
    <ScrollView>
      <View
        style={{
          padding: 20,
          backgroundColor: '#fff',
          height: '100%',
        }}>
        <Text
          style={{
            fontFamily: 'Roboto-Bold',
            fontSize: 20,
          }}>
          About
        </Text>
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            lineHeight: 25,
          }}>
          {business.about}
        </Text>
      </View>
    </ScrollView>
  );
}
