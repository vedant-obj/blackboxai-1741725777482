import React, { useRef, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

const MapViewComponent = ({
  userLocation,
  attractions = [],
  onMarkerPress,
  initialRegion = null,
  style = {},
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    if (userLocation && mapRef.current) {
      mapRef.current.animateToRegion({
        latitude: userLocation.latitude,
        longitude: userLocation.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    }
  }, [userLocation]);

  const defaultRegion = {
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  };

  return (
    <View style={[styles.container, style]}>
      <MapView
        ref={mapRef}
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={initialRegion || defaultRegion}
        showsUserLocation={true}
        showsMyLocationButton={true}
        showsCompass={true}
        rotateEnabled={true}
        zoomEnabled={true}
      >
        {/* User's current location marker */}
        {userLocation && (
          <Marker
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            title="You are here"
            pinColor={Colors.primary}
          />
        )}

        {/* Attraction markers */}
        {attractions.map((attraction, index) => (
          <Marker
            key={`attraction-${index}`}
            coordinate={{
              latitude: attraction.latitude,
              longitude: attraction.longitude,
            }}
            title={attraction.name}
            description={attraction.description}
            onPress={() => onMarkerPress && onMarkerPress(attraction)}
          >
            {/* Custom marker view can be added here if needed */}
          </Marker>
        ))}
      </MapView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '50%',
    width: '100%',
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});

export default MapViewComponent;
