import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, Image, TextInput } from 'react-native';

import profilepic from '../../assets/profilepic.png';
import colors from '../../constants/colors';

export default function Header() {
  return (
    <View
      style={{
        padding: 20,
        paddingTop: 40,
        backgroundColor: colors.primary,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
      }}>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
        }}>
        <Image
          source={profilepic}
          style={{
            width: 45,
            height: 45,
            borderRadius: 99,
          }}
        />
        <View>
          <Text>Welcome</Text>
          <Text
            style={{
              fontSize: 19,
              fontFamily: 'grotesque-bold',
            }}>
            Manilka
          </Text>
        </View>
      </View>
      <View
        style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10,
          backgroundColor: 'white',
          padding: 10,
          marginVertical: 10,
          marginTop: 15,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.secondary,
        }}>
        <Ionicons name="search-outline" size={24} color={colors.secondary} />
        <TextInput
          placeholder="Search..."
          style={{
            fontSize: 16,
            fontFamily: 'grotesque-regular',
          }}
        />
      </View>
    </View>
  );
}
