import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function BusinessListCard({ business }) {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate('BusinessDetails', { id: business.id })}>
      <View
        style={{
          padding: 10,
          margin: 10,
          borderRadius: 10,
          backgroundColor: '#fff',
          display: 'flex',
          flexDirection: 'row',
          gap: 10,
        }}>
        <Image
          source={{ uri: business?.imageUrl }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 15,
          }}
        />
        <View style={{ flex: 1, gap: 7 }}>
          <Text
            style={{
              fontFamily: 'Roboto-Bold',
              fontSize: 18,
            }}>
            {business.name}
          </Text>
          <Text
            style={{
              fontFamily: 'Roboto-Regular',
              color: '#666',
              fontSize: 13,
            }}>
            {business.address}
          </Text>
          <View
            style={{
              display: 'flex',
              flexDirection: 'row',
              gap: 5,
            }}>
            <Ionicons name="star" size={20} color="#FFD700" />
            <Text style={{ fontFamily: 'Roboto-Regular' }}>4.5</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}
