import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { calculateAccessibilityScore } from '../utils/scoring';

export default function LocationCard({ location, onPress }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.card, pressed && styles.pressed]}>
      <View style={styles.header}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{location.placeName || 'Accessible place'}</Text>
          <Text style={styles.address}>{location.address || 'No address provided'}</Text>
        </View>
        <Text style={styles.score}>{calculateAccessibilityScore(location)}</Text>
      </View>
      <Text numberOfLines={2} style={styles.description}>{location.description || 'No description yet.'}</Text>
      <Text style={styles.meta}>{location.features?.length || 0} features • Rating {Number(location.rating || 0).toFixed(1)}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 14,
    backgroundColor: colors.white,
    gap: 10,
  },
  pressed: {
    opacity: 0.8,
  },
  header: {
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  titleWrap: {
    flex: 1,
    gap: 4,
  },
  title: {
    color: colors.ink,
    fontSize: 16,
    fontWeight: '800',
  },
  address: {
    color: colors.muted,
    fontSize: 13,
    lineHeight: 18,
  },
  score: {
    overflow: 'hidden',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: colors.brandDark,
    backgroundColor: colors.brandSoft,
    fontWeight: '800',
  },
  description: {
    color: colors.ink,
    lineHeight: 20,
  },
  meta: {
    color: colors.muted,
    fontSize: 12,
    fontWeight: '700',
  },
});
