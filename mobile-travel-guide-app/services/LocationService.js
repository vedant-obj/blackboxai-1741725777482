import * as Location from 'expo-location';

class LocationService {
  static async requestLocationPermission() {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        throw new Error('Location permission denied');
      }
      return true;
    } catch (error) {
      console.error('Error requesting location permission:', error);
      throw error;
    }
  }

  static async getCurrentLocation() {
    try {
      // Ensure permission is granted before getting location
      await this.requestLocationPermission();

      // Get current location with high accuracy
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      return {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        accuracy: location.coords.accuracy,
        timestamp: location.timestamp,
      };
    } catch (error) {
      console.error('Error getting current location:', error);
      throw error;
    }
  }

  static async watchLocation(callback) {
    try {
      await this.requestLocationPermission();

      // Start watching location with moderate accuracy to save battery
      const locationSubscription = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.Balanced,
          timeInterval: 5000,    // Update every 5 seconds
          distanceInterval: 10,  // Update every 10 meters
        },
        (location) => {
          callback({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            accuracy: location.coords.accuracy,
            timestamp: location.timestamp,
          });
        }
      );

      return locationSubscription;
    } catch (error) {
      console.error('Error watching location:', error);
      throw error;
    }
  }

  static async getLocationAddress(latitude, longitude) {
    try {
      const addressArray = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (addressArray.length > 0) {
        return addressArray[0];
      }
      throw new Error('No address found for these coordinates');
    } catch (error) {
      console.error('Error getting location address:', error);
      throw error;
    }
  }

  // Helper method to calculate distance between two coordinates in kilometers
  static calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  static deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  // Method to check if a location is within a certain radius (in kilometers)
  static isLocationNearby(userLat, userLon, targetLat, targetLon, radiusKm = 5) {
    const distance = this.calculateDistance(userLat, userLon, targetLat, targetLon);
    return distance <= radiusKm;
  }

  // Format distance for display
  static formatDistance(distanceKm) {
    if (distanceKm < 1) {
      return `${Math.round(distanceKm * 1000)}m`;
    }
    return `${distanceKm.toFixed(1)}km`;
  }
}
