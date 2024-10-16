import { Ionicons } from '@expo/vector-icons';
import colors from 'constants/colors';
import React from 'react';
import { View, Text, Image } from 'react-native';

export default function PopularBusinessCard({ business }) {
  console.log(business.category);
  return (
    <View
      style={{
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 15,
        marginRight: 10,
      }}>
      <Image
        source={{ uri: business.imageUrl }}
        style={{
          width: 200,
          height: 130,
          borderRadius: 15,
        }}
      />
      <View style={{ marginTop: 7 }}>
        <Text
          style={{
            fontFamily: 'Roboto-Bold',
            fontSize: 15,
          }}>
          {business.name}
        </Text>
        <Text
          style={{
            fontFamily: 'Roboto-Regular',
            fontSize: 12,
            color: '#666',
          }}>
          {business.address}
        </Text>
        <View
          style={{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 5,
            }}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={{ fontFamily: 'Roboto-Regular' }}>4.5</Text>
          </View>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              backgroundColor: colors.secondary,
              padding: 3,
              color: '#fff',
              fontSize: 10,
              borderRadius: 5,
            }}>
            {business.category}
          </Text>
        </View>
      </View>
    </View>
  );
}
