import { getDocs, collection } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet } from 'react-native';

import { db } from '../../firebase';

export default function Slider() {
  const [sliderImages, setSliderImages] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const querySnapshot = await getDocs(collection(db, 'slider'));
      querySnapshot.forEach((doc) => {
        setSliderImages((prev) => [...prev, doc.data()]);
      });
    };
    fetchData();
  }, []);

  return (
    <View>
      <Text
        style={{
          fontFamily: 'Roboto-Bold',
          fontSize: 20,
          paddingLeft: 20,
          paddingTop: 20,
          marginBottom: 5,
        }}>
        Special Offers
      </Text>
      <FlatList
        style={{
          paddingLeft: 20,
        }}
        data={sliderImages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Image source={{ uri: item.url }} style={styles.image} />}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontFamily: 'Roboto-Bold',
    fontSize: 20,
    marginBottom: 20,
  },
  image: {
    width: 300,
    height: 150,
    marginRight: 15,
    borderRadius: 15,
  },
});
