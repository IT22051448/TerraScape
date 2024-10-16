import { useNavigation, useRoute } from '@react-navigation/native';
import BusinessListCard from 'components/BusinessList/BusinessListCard';
import colors from 'constants/colors';
import { getDocs, collection, where, query } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, FlatList } from 'react-native';

import { db } from '../firebase';

export default function BusinessList() {
  const navigation = useNavigation();
  const route = useRoute();
  const { category } = route.params;

  const [businessList, setBusinessList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({ headerShown: true, title: category });
  });

  const fetchData = async () => {
    setBusinessList([]);
    const q = query(collection(db, 'BusinessList'), where('category', '==', category));
    setIsLoading(true);
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      console.log(doc.id, doc.data());
      setBusinessList((prev) => [...prev, { id: doc?.id, ...doc.data() }]);
    });
    setIsLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);
  return (
    <View>
      {businessList?.length > 0 && isLoading === false ? (
        <FlatList
          onRefresh={fetchData}
          refreshing={isLoading}
          data={businessList}
          renderItem={({ item, index }) => <BusinessListCard business={item} key={index} />}
        />
      ) : isLoading ? (
        <ActivityIndicator size="large" color={colors.primary} style={{ marginTop: '60%' }} />
      ) : (
        <Text
          style={{ fontSize: 20, fontFamily: 'Roboto-Bold', textAlign: 'center', marginTop: 20 }}>
          No Service Proviers Found
        </Text>
      )}
    </View>
  );
}
