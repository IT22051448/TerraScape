import React, { useState } from 'react';
import { View, Text, Button, Slider, CheckBox, StyleSheet } from 'react-native';

const FilterScreen = ({ navigation }) => {
  const [priceRange, setPriceRange] = useState([10, 100]);
  const [isCategoryChecked, setIsCategoryChecked] = useState(false);

  const applyFilters = () => {
    // Apply the filter logic
    navigation.navigate('Listings', { priceRange, isCategoryChecked });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.filterTitle}>Filters</Text>

      {/* Price Range Filter */}
      <Text>Price Range: {priceRange[0]} - {priceRange[1]}</Text>
      <Slider
        minimumValue={0}
        maximumValue={200}
        step={10}
        value={priceRange}
        onValueChange={setPriceRange}
      />

      {/* Category Filter */}
      <View style={styles.filterItem}>
        <CheckBox
          value={isCategoryChecked}
          onValueChange={setIsCategoryChecked}
        />
        <Text>Category Filter</Text>
      </View>

      {/* Apply Filter Button */}
      <Button title="Apply Filters" onPress={applyFilters} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  filterTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  filterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
});

export default FilterScreen;
