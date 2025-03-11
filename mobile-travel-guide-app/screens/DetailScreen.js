import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';
import MapViewComponent from '../components/MapViewComponent';
import LocationService from '../services/LocationService';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

const DetailScreen = ({ route, navigation }) => {
  const { attraction } = route.params;
  const [userLocation, setUserLocation] = useState(null);
  const [distance, setDistance] = useState(null);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const location = await LocationService.getCurrentLocation();
      setUserLocation(location);
      
      const distanceKm = LocationService.calculateDistance(
        location.latitude,
        location.longitude,
        attraction.latitude,
        attraction.longitude
      );
      setDistance(LocationService.formatDistance(distanceKm));
    } catch (error) {
      console.error('Error getting location:', error);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out ${attraction.name}! ${attraction.description}`,
        title: attraction.name,
      });
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleGetDirections = () => {
    const scheme = Platform.select({
      ios: 'maps:',
      android: 'geo:',
    });
    const url = Platform.select({
      ios: `${scheme}?q=${attraction.latitude},${attraction.longitude}`,
      android: `${scheme}${attraction.latitude},${attraction.longitude}`,
    });

    Linking.openURL(url).catch((err) =>
      console.error('Error opening maps:', err)
    );
  };

  const renderActionButton = (icon, label, onPress) => (
    <TouchableOpacity style={styles.actionButton} onPress={onPress}>
      <FontAwesome name={icon} size={24} color={Colors.primary} />
      <Text style={styles.actionButtonText}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView bounces={false}>
        {/* Header Image */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: attraction.imageUrl }}
            style={styles.image}
            resizeMode="cover"
          />
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <FontAwesome name="arrow-left" size={24} color={Colors.text.light} />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Title Section */}
          <View style={styles.titleSection}>
            <Text style={styles.title}>{attraction.name}</Text>
            <View style={styles.infoRow}>
              <Text style={styles.type}>{attraction.type}</Text>
              {distance && (
                <Text style={styles.distance}>{distance} away</Text>
              )}
            </View>
          </View>

          {/* Rating Section */}
          {attraction.rating && (
            <View style={styles.ratingSection}>
              <Text style={styles.ratingText}>
                {'★'.repeat(Math.floor(attraction.rating))}
                {'☆'.repeat(5 - Math.floor(attraction.rating))}
                {' ' + attraction.rating.toFixed(1)}
              </Text>
            </View>
          )}

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {renderActionButton('map-marker', 'Directions', handleGetDirections)}
            {renderActionButton('share', 'Share', handleShare)}
            {renderActionButton('bookmark', 'Save', () => {})}
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About</Text>
            <Text style={styles.description}>{attraction.description}</Text>
          </View>

          {/* Map */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Location</Text>
            <MapViewComponent
              style={styles.map}
              userLocation={userLocation}
              attractions={[attraction]}
              initialRegion={{
                latitude: attraction.latitude,
                longitude: attraction.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  imageContainer: {
    height: 300,
    width: '100%',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  backButton: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 16,
  },
  titleSection: {
    marginBottom: 16,
  },
  title: {
    ...Styles.title,
    marginBottom: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  type: {
    fontSize: 16,
    color: Colors.text.secondary,
  },
  distance: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '500',
  },
  ratingSection: {
    marginBottom: 16,
  },
  ratingText: {
    fontSize: 18,
    color: Colors.warning,
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 24,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  actionButton: {
    alignItems: 'center',
    padding: 8,
  },
  actionButtonText: {
    marginTop: 4,
    fontSize: 14,
    color: Colors.text.secondary,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text.primary,
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text.secondary,
  },
  map: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

export default DetailScreen;
