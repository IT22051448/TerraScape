import Category from 'components/Home/Category';
import Header from 'components/Home/Header';
import PopularBusiness from 'components/Home/PopularBusiness';
import Slider from 'components/Home/Slider';
import React from 'react';
import { View, ScrollView } from 'react-native';

export default function Home() {
  return (
    <ScrollView>
      <View>
        {/* Header */}
        <Header />
        {/* Slider */}
        <Slider />
        {/* Categories */}
        <Category />
        {/* Popular Service Providers */}
        <PopularBusiness />
      </View>
      <View style={{ height: 150 }} />
    </ScrollView>
  );
}
