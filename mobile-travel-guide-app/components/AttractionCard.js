import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Colors from '../constants/Colors';
import Styles from '../constants/Styles';

const AttractionCard = ({
  attraction,
  onPress,
  style = {},
  compact = false
}) => {
  const {
    name,
    description,
    imageUrl,
    rating,
    distance,
    type
  } = attraction;

  // Fallback image if the provided URL is invalid
  const fallbackImage = 'https://via.placeholder.com/300x200?text=No+Image+Available';

  const renderRatingStars = (rating) => {
    const stars = '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
    return (
      <Text style={styles.ratingText}>
        <Text style={styles.stars}>{stars}</Text> {rating.toFixed(1)}
      </Text>
    );
  };

  if (compact) {
    return (
      <TouchableOpacity
        style={[styles.compactContainer, style]}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Image
          source={{ uri: imageUrl || fallbackImage }}
          style={styles.compactImage}
          resizeMode="cover"
        />
        <View style={styles.compactContent}>
          <Text style={styles.compactTitle} numberOfLines={1}>{name}</Text>
          <Text style={styles.compactType}>{type}</Text>
          {rating && renderRatingStars(rating)}
          {distance && (
            <Text style={styles.compactDistance}>{distance}</Text>
          )}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: imageUrl || fallbackImage }}
        style={styles.image}
        resizeMode="cover"
      />
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{name}</Text>
          {distance && (
            <Text style={styles.distance}>{distance}</Text>
          )}
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.type}>{type}</Text>
          {rating && renderRatingStars(rating)}
        </View>

        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    ...Styles.card,
    marginVertical: 8,
  },
  image: {
    height: 200,
    width: '100%',
    borderRadius: 8,
  },
  content: {
    marginTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text.primary,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 4,
  },
  type: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  description: {
    fontSize: 14,
    color: Colors.text.secondary,
    marginTop: 8,
    lineHeight: 20,
  },
  distance: {
    fontSize: 14,
    color: Colors.primary,
    fontWeight: '500',
  },
  ratingText: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  stars: {
    color: Colors.warning,
  },

  // Compact styles
  compactContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.cardBackground,
    borderRadius: 8,
    marginVertical: 4,
    overflow: 'hidden',
    height: 100,
  },
  compactImage: {
    width: 100,
    height: '100%',
  },
  compactContent: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  compactTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text.primary,
  },
  compactType: {
    fontSize: 12,
    color: Colors.text.secondary,
    marginTop: 2,
  },
  compactDistance: {
    fontSize: 12,
    color: Colors.primary,
    marginTop: 4,
  },
});

export default AttractionCard;
