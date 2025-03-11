import React, { useState, useEffect } from 'react';
import {
  View,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import AttractionCard from '../components/AttractionCard';
import LocationService from '../services/LocationService';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

// Mock data categories - In a real app, these would come from an API
const categories = [
  'All',
  'Landmarks',
  'Museums',
  'Parks',
  'Restaurants',
  'Shopping',
];

const ListScreen = ({ navigation, route }) => {
  const [attractions, setAttractions] = useState([]);
  const [filteredAttractions, setFilteredAttractions] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);

      // In a real app, fetch attractions from an API
      // For now, using mock data
      const mockAttractions = [
        {
          id: '1',
          name: 'Eiffel Tower',
          description: 'Iconic iron lattice tower on the Champ de Mars in Paris, France.',
          imageUrl: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg',
          rating: 4.8,
          type: 'Landmarks',
          latitude: 48.8584,
          longitude: 2.2945,
        },
        {
          id: '2',
          name: 'Louvre Museum',
          description: 'World\'s largest art museum and a historic monument in Paris, France.',
          imageUrl: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg',
          rating: 4.7,
          type: 'Museums',
          latitude: 48.8606,
          longitude: 2.3376,
        },
        {
          id: '3',
          name: 'Luxembourg Gardens',
          description: 'Beautiful park in the heart of Paris with fountains and flowers.',
          imageUrl: 'https://images.pexels.com/photos/262780/pexels-photo-262780.jpeg',
          rating: 4.5,
          type: 'Parks',
          latitude: 48.8462,
          longitude: 2.3371,
        },
        // Add more mock attractions as needed
      ];

      // Add distance to attractions
      const attractionsWithDistance = mockAttractions.map(attraction => ({
        ...attraction,
        distance: LocationService.formatDistance(
          LocationService.calculateDistance(
            location.latitude,
            location.longitude,
            attraction.latitude,
            attraction.longitude
          )
        )
      }));

      setAttractions(attractionsWithDistance);
      setFilteredAttractions(attractionsWithDistance);
      setLoading(false);
    } catch (error) {
      console.error('Error initializing data:', error);
      setLoading(false);
    }
  };

  const filterAttractions = (query = searchQuery, category = selectedCategory) => {
    let filtered = [...attractions];

    // Apply category filter
    if (category !== 'All') {
      filtered = filtered.filter(item => item.type === category);
    }

    // Apply search filter
    if (query) {
      filtered = filtered.filter(item =>
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.description.toLowerCase().includes(query.toLowerCase())
      );
    }

    setFilteredAttractions(filtered);
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    filterAttractions(text, selectedCategory);
  };

  const handleCategoryPress = (category) => {
    setSelectedCategory(category);
    filterAttractions(searchQuery, category);
  };

  const renderCategoryChip = (category) => (
    <TouchableOpacity
      key={category}
      style={[
        styles.categoryChip,
        selectedCategory === category && styles.selectedCategoryChip,
      ]}
      onPress={() => handleCategoryPress(category)}
    >
      <Text
        style={[
          styles.categoryText,
          selectedCategory === category && styles.selectedCategoryText,
        ]}
      >
        {category}
      </Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <FontAwesome name="search" size={20} color={Colors.text.secondary} />
        <TextInput
          style={styles.searchInput}
          placeholder="Search attractions..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor={Colors.text.secondary}
        />
      </View>

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          data={categories}
          renderItem={({ item }) => renderCategoryChip(item)}
          keyExtractor={(item) => item}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesList}
        />
      </View>

      {/* Attractions List */}
      <FlatList
        data={filteredAttractions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AttractionCard
            attraction={item}
            onPress={() => navigation.navigate('Detail', { attraction: item })}
          />
        )}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No attractions found</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    ...Styles.searchBar,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.text.primary,
  },
  categoriesContainer: {
    marginVertical: 8,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    marginRight: 8,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategoryChip: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  categoryText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  selectedCategoryText: {
    color: Colors.text.light,
    fontWeight: '500',
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
});

export default ListScreen;
