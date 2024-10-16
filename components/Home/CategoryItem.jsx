import colors from 'constants/colors';
import React from 'react';
import { View, Image, Text, TouchableOpacity } from 'react-native';

export default function CategoryItem({ category, onCategoryPress }) {
  console.log(category);
  return (
    <TouchableOpacity onPress={onCategoryPress}>
      <View>
        <View
          style={{
            padding: 10,
            backgroundColor: colors.iconbg,
            borderRadius: 99,
            marginRight: 15,
          }}>
          <Image source={{ uri: category.url }} style={{ width: 50, height: 50 }} />
        </View>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Roboto-Medium',
            marginLeft: 10,
            marginTop: 5,
          }}>
          {category.name}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
