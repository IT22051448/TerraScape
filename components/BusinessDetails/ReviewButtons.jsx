import { useNavigation } from '@react-navigation/native';
import colors from 'constants/colors';
import React from 'react';
import { View, Text } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

export default function ReviewButtons({ business }) {
  const navigation = useNavigation();

  return (
    <View
      style={{
        padding: 20,
        backgroundColor: '#fff',
        display: 'flex',
        alignItems: 'center',
      }}>
      <TouchableOpacity
        onPress={() => {
          console.log('Passing Value', business.id);
          navigation.navigate('FeedbackTab', {
            screen: 'RatingSelection',
            params: { id: business.id },
          });
        }}>
        <Text
          style={{
            fontFamily: 'Roboto-Bold',
            fontSize: 20,
            backgroundColor: colors.secondary,
            width: '100%',
            textAlign: 'center',
            color: '#fff',
            padding: 10,
            borderRadius: 10,
          }}>
          Add a Review
        </Text>
      </TouchableOpacity>
    </View>
  );
}
