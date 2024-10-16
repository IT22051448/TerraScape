import { useNavigation } from '@react-navigation/native';
import colors from 'constants/colors';
import { getDocs, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList } from 'react-native';

import CategoryItem from './CategoryItem';
import { db } from '../../firebase';

export default function Category() {
  const [categoryList, setCategoryList] = useState([]);

  const navigation = useNavigation();

  useEffect(() => {
    setCategoryList([]);
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'categories'));
      querySnapshot.forEach((doc) => {
        setCategoryList((prev) => [...prev, doc.data()]);
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
          marginTop: 15,
        }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Roboto-Bold',
          }}>
          Category
        </Text>
        <Text
          style={{
            color: colors.secondary,
          }}>
          View All
        </Text>
      </View>
      <FlatList
        data={categoryList}
        style={{
          marginLeft: 20,
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
        renderItem={({ item, index }) => (
          <CategoryItem
            category={item}
            key={index}
            onCategoryPress={() => navigation.navigate('BusinessList', { category: item.name })}
          />
        )}
      />
    </View>
  );
}
