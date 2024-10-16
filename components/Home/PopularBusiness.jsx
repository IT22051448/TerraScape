import colors from 'constants/colors';
import { getDocs, collection, limit } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

import PopularBusinessCard from './PopularBusinessCard';
import { db } from '../../firebase';

export default function PopularBusiness() {
  const [popularBusiness, setPopularBusiness] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'BusinessList'), limit(10));
      querySnapshot.forEach((doc) => {
        console.log(doc.data());
        setPopularBusiness((prev) => [...prev, doc.data()]);
      });
    };
    fetchData();
  }, []);
  return (
    <View>
      <View
        style={{
          padding: 20,
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginTop: 5,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Roboto-Bold',
          }}>
          Popular Businesses
        </Text>
        <Text
          style={{
            color: colors.secondary,
          }}>
          View All
        </Text>
      </View>
      <FlatList
        data={popularBusiness}
        style={{
          marginLeft: 20,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => <PopularBusinessCard business={item} key={index} />}
      />
    </View>
  );
}
