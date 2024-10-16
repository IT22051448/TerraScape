import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ActionButton({ business }) {
  const actionButtonMenu = [
    {
      id: 1,
      title: 'call',
      icon: 'call',
      url: `tel:${business.phone}`,
    },
    {
      id: 2,
      title: 'Location',
      icon: 'location',
      url: `tel:${business.phone}`,
    },
    {
      id: 3,
      title: 'Website',
      icon: 'globe',
      url: `https://${business.website}`,
    },
    {
      id: 4,
      title: 'Schedule',
      icon: 'calendar',
      url: `tel:${business.phone}`,
    },
  ];
  return (
    <View
      style={{
        backgroundColor: '#fff',
        padding: 20,
      }}>
      <FlatList
        data={actionButtonMenu}
        numColumns={4}
        columnWrapperStyle={{ justifyContent: 'space-between' }}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => console.log(item.url)}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginVertical: 10 }}>
              <Ionicons name={item.icon} size={35} color="#000000" />
            </View>
            <Text
              style={{
                fontFamily: 'Roboto-Medium',
                textAlign: 'center',
                marginTop: 2,
              }}>
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
