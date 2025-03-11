import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import MapViewComponent from '../components/MapViewComponent';
import AttractionCard from '../components/AttractionCard';
import LocationService from '../services/LocationService';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

// Mock data - In a real app, this would come from an API
const mockAttractions = [
  {
    id: '1',
    name: 'Eiffel Tower',
    description: 'Iconic iron lattice tower on the Champ de Mars in Paris, France.',
    imageUrl: 'https://images.pexels.com/photos/699466/pexels-photo-699466.jpeg',
    rating: 4.8,
    type: 'Landmark',
    latitude: 48.8584,
    longitude: 2.2945,
  },
  {
    id: '2',
    name: 'Louvre Museum',
    description: 'World\'s largest art museum and a historic monument in Paris, France.',
    imageUrl: 'https://images.pexels.com/photos/2363/france-landmark-lights-night.jpg',
    rating: 4.7,
    type: 'Museum',
    latitude: 48.8606,
    longitude: 2.3376,
  },
  // Add more mock attractions as needed
];

const HomeScreen = ({ navigation }) => {
  const [userLocation, setUserLocation] = useState(null);
  const [attractions, setAttractions] = useState(mockAttractions);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    initializeLocation();
  }, []);

  const initializeLocation = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);
      
      // In a real app, you would fetch nearby attractions based on location
      // For now, we'll just add distance to our mock data
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
      setLoading(false);
    } catch (err) {
      setError('Failed to get location. Please enable location services.');
      setLoading(false);
    }
  };

  const handleSearch = (text) => {
    setSearchQuery(text);
    if (text) {
      const filtered = mockAttractions.filter(
        attraction => attraction.name.toLowerCase().includes(text.toLowerCase())
      );
      setAttractions(filtered);
    } else {
      setAttractions(mockAttractions);
    }
  };

  const handleAttractionPress = (attraction) => {
    navigation.navigate('Detail', { attraction });
  };

  const handleMarkerPress = (attraction) => {
    navigation.navigate('Detail', { attraction });
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={initializeLocation}
        >
          <Text style={styles.retryButtonText}>Retry</Text>
        </TouchableOpacity>
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

      {/* Map View */}
      <MapViewComponent
        userLocation={userLocation}
        attractions={attractions}
        onMarkerPress={handleMarkerPress}
      />

      {/* Attractions List */}
      <View style={styles.listContainer}>
        <Text style={styles.sectionTitle}>Nearby Attractions</Text>
        <FlatList
          data={attractions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AttractionCard
              attraction={item}
              onPress={() => handleAttractionPress(item)}
              compact={true}
            />
          )}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
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
  listContainer: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  sectionTitle: {
    ...Styles.title,
    padding: 16,
  },
  listContent: {
    padding: 16,
  },
  errorText: {
    color: Colors.error,
    textAlign: 'center',
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.text.light,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HomeScreen;
