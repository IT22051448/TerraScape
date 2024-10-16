import { useRoute } from '@react-navigation/native';
import About from 'components/BusinessDetails/About';
import ActionButton from 'components/BusinessDetails/ActionButton';
import Intro from 'components/BusinessDetails/Intro';
import ReviewButtons from 'components/BusinessDetails/ReviewButtons';
import colors from 'constants/colors';
import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { db } from '../firebase';

export default function BusinessDetails() {
  const route = useRoute();
  const { id } = route.params;

  const [businessDetails, setBusinessDetails] = useState({});
  const [loading, setIsLoading] = useState(false);

  const getBusinessDetails = async (id) => {
    setIsLoading(true);
    const docRef = doc(db, 'BusinessList', id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      console.log('Document data:', docSnap.data());
      setBusinessDetails({ id, ...docSnap.data() });
    } else {
      console.log('No such document!');
    }
    setIsLoading(false);
    return docSnap.data();
  };

  useEffect(() => {
    getBusinessDetails(id);
  }, []);

  console.log(id);
  return (
    <View>
      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.secondary}
          style={{
            marginTop: '60%',
          }}
        />
      ) : (
        <View>
          {/* Intro */}
          <Intro business={businessDetails} />

          {/* Action Buttons */}
          <ActionButton business={businessDetails} />
          {/* About Section */}
          <About business={businessDetails} />

          {/* Review Buttons */}
          <ReviewButtons business={businessDetails} />
        </View>
      )}
    </View>
  );
}
