import { useEffect, useState } from 'react';
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import LocationCard from '../components/LocationCard';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { subscribeToLocations } from '../services/locationService';
import { colors } from '../theme/colors';

export default function HomeScreen({ navigation }) {
  const { userProfile, logout } = useAuth();
  const [locations, setLocations] = useState([]);

  useEffect(() => subscribeToLocations(setLocations), []);

  return (
    <Screen>
      <View style={styles.header}>
        <View style={styles.brandRow}>
          <Image source={require('../../assets/ramp-favicon.png')} style={styles.logo} resizeMode="contain" />
          <View>
            <Text style={styles.kicker}>RAMP Mobile</Text>
            <Text style={styles.title}>Hi, {userProfile?.firstName || 'community member'}</Text>
          </View>
        </View>
        <AppButton title="Logout" variant="secondary" onPress={logout} />
      </View>

      <View style={styles.actions}>
        <AppButton title="Explore Map" onPress={() => navigation.navigate('Map')} />
        <AppButton title="Add Location" variant="secondary" onPress={() => navigation.navigate('AddLocation')} />
      </View>

      <Text style={styles.sectionTitle}>Recent accessibility locations</Text>
      {locations.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No Map Location yet</Text>
          <Text style={styles.emptyText}>Be the first to add an accessible place.</Text>
        </View>
      ) : (
        <FlatList
          data={locations.slice(0, 6)}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          contentContainerStyle={styles.list}
          renderItem={({ item }) => (
            <LocationCard location={item} onPress={() => navigation.navigate('LocationDetails', { id: item.id })} />
          )}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 12,
  },
  brandRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logo: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.white,
  },
  kicker: {
    color: colors.brand,
    fontWeight: '800',
  },
  title: {
    marginTop: 4,
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
  },
  actions: {
    gap: 12,
    marginTop: 24,
  },
  sectionTitle: {
    marginTop: 28,
    marginBottom: 12,
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  list: {
    gap: 12,
  },
  empty: {
    borderWidth: 1,
    borderColor: colors.line,
    borderStyle: 'dashed',
    borderRadius: 14,
    padding: 20,
    backgroundColor: colors.white,
  },
  emptyTitle: {
    color: colors.ink,
    fontSize: 18,
    fontWeight: '900',
  },
  emptyText: {
    marginTop: 6,
    color: colors.muted,
  },
});
