import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import RampMap from '../components/RampMap';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { getLocation } from '../services/locationService';
import { addReview, subscribeToReviews } from '../services/reviewService';
import { colors } from '../theme/colors';
import { ratingOptions } from '../utils/constants';
import { calculateAccessibilityScore } from '../utils/scoring';

export default function LocationDetailsScreen({ route }) {
  const { currentUser } = useAuth();
  const { id } = route.params;
  const [location, setLocation] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [review, setReview] = useState({ rating: 5, comment: '' });

  useEffect(() => {
    getLocation(id).then(setLocation);
    return subscribeToReviews(id, setReviews);
  }, [id]);

  async function submitReview() {
    try {
      await addReview({ locationId: id, user: currentUser, ...review });
      setReview({ rating: 5, comment: '' });
      Alert.alert('Review posted', 'Thank you for improving this accessibility record.');
    } catch (error) {
      Alert.alert('Review failed', error.message);
    }
  }

  if (!location) {
    return (
      <Screen>
        <Text style={styles.title}>Loading location...</Text>
      </Screen>
    );
  }

  const coordinate = { latitude: Number(location.latitude), longitude: Number(location.longitude) };

  return (
    <Screen>
      <Text style={styles.title}>{location.placeName}</Text>
      <Text style={styles.address}>{location.address}</Text>
      <View style={styles.scoreBox}>
        <Text style={styles.scoreLabel}>Accessibility Score</Text>
        <Text style={styles.score}>{calculateAccessibilityScore(location)}</Text>
      </View>
      <Text style={styles.description}>{location.description}</Text>

      <RampMap
        style={styles.map}
        region={{ ...coordinate, latitudeDelta: 0.01, longitudeDelta: 0.01 }}
        markers={[{ id: location.id, coordinate, title: location.placeName, description: location.address }]}
      />

      {location.photos?.length > 0 && (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photos}>
          {location.photos.map((photo) => <Image key={photo} source={{ uri: photo }} style={styles.photo} />)}
        </ScrollView>
      )}

      <Text style={styles.sectionTitle}>Ratings and Reviews</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
        {ratingOptions.map((option) => (
          <Text
            key={option.value}
            onPress={() => setReview((current) => ({ ...current, rating: option.value }))}
            style={[styles.pill, review.rating === option.value && styles.pillActive]}
          >
            {option.label}
          </Text>
        ))}
      </ScrollView>
      <FormInput
        value={review.comment}
        onChangeText={(comment) => setReview((current) => ({ ...current, comment }))}
        placeholder="Share accessibility details from your visit"
        multiline
        numberOfLines={6}
        textAlignVertical="top"
        inputStyle={styles.reviewInput}
      />
      <View style={styles.reviewButton}>
        <AppButton title="Post Review" onPress={submitReview} disabled={!review.comment} />
      </View>

      <View style={styles.reviewList}>
        {reviews.map((item) => (
          <View key={item.id} style={styles.review}>
            <Text style={styles.reviewName}>{item.userName}</Text>
            <Text style={styles.reviewRating}>Rating {item.rating}</Text>
            <Text style={styles.reviewComment}>{item.comment}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
  },
  address: {
    marginTop: 6,
    color: colors.muted,
    lineHeight: 22,
  },
  scoreBox: {
    marginTop: 16,
    borderRadius: 14,
    padding: 16,
    backgroundColor: colors.brandSoft,
  },
  scoreLabel: {
    color: colors.brandDark,
    fontWeight: '800',
  },
  score: {
    marginTop: 4,
    color: colors.brandDark,
    fontSize: 34,
    fontWeight: '900',
  },
  description: {
    marginTop: 16,
    color: colors.ink,
    lineHeight: 22,
  },
  map: {
    height: 240,
    marginTop: 18,
    borderRadius: 14,
  },
  photos: {
    gap: 8,
    marginTop: 16,
  },
  photo: {
    width: 160,
    height: 120,
    borderRadius: 12,
  },
  sectionTitle: {
    marginTop: 24,
    marginBottom: 12,
    color: colors.ink,
    fontSize: 20,
    fontWeight: '900',
  },
  pills: {
    gap: 10,
    marginBottom: 12,
  },
  pill: {
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 11,
    color: colors.muted,
    backgroundColor: colors.white,
    fontWeight: '700',
    minWidth: 146,
    textAlign: 'center',
  },
  pillActive: {
    borderColor: colors.brand,
    color: colors.brandDark,
    backgroundColor: colors.brandSoft,
  },
  reviewInput: {
    minHeight: 112,
    paddingTop: 12,
    lineHeight: 22,
  },
  reviewButton: {
    marginTop: 14,
  },
  reviewList: {
    gap: 10,
    marginTop: 16,
  },
  review: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.white,
  },
  reviewName: {
    color: colors.ink,
    fontWeight: '800',
  },
  reviewRating: {
    marginTop: 4,
    color: colors.warning,
    fontWeight: '800',
  },
  reviewComment: {
    marginTop: 6,
    color: colors.ink,
    lineHeight: 20,
  },
});
