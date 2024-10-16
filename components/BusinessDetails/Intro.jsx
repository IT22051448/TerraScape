import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function Intro({ business }) {
  const navigation = useNavigation();
  return (
    <View>
      <View
        style={{
          position: 'absolute',
          zIndex: 10,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: 40,
          padding: 20,
        }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back-circle" size={40} color="#fff" />
        </TouchableOpacity>

        <Ionicons name="heart" size={40} color="#fff" />
      </View>
      <Image
        source={{ uri: business.imageUrl }}
        style={{
          width: '100%',
          height: 340,
        }}
      />
      <View
        style={{
          padding: 20,
          marginTop: -20,
          backgroundColor: '#fff',
          borderTopRightRadius: 20,
          borderTopLeftRadius: 20,
        }}>
        <Text
          style={{
            fontSize: 26,
            fontFamily: 'Roboto-Bold',
          }}>
          {business.name}
        </Text>
        <Text
          style={{
            fontSize: 16,
            fontFamily: 'Roboto-Regular',
            color: '#666',
          }}>
          {business.address}
        </Text>
      </View>
    </View>
  );
}
