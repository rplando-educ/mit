import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import RampMap from '../components/RampMap';
import Screen from '../components/Screen';
import { subscribeToLocations } from '../services/locationService';
import { colors } from '../theme/colors';
import { DEFAULT_REGION } from '../utils/constants';

export default function MapScreen({ navigation }) {
  const [locations, setLocations] = useState([]);
  const [region, setRegion] = useState(DEFAULT_REGION);

  useEffect(() => subscribeToLocations(setLocations), []);

  useEffect(() => {
    async function requestLocation() {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const current = await Location.getCurrentPositionAsync({});
      setRegion((value) => ({
        ...value,
        latitude: current.coords.latitude,
        longitude: current.coords.longitude,
      }));
    }

    requestLocation().catch(() => {
      Alert.alert('Location unavailable', 'RAMP will use Cebu City as the default map area.');
    });
  }, []);

  return (
    <Screen scroll={false} style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Accessibility Map</Text>
        <AppButton title="Add Location" onPress={() => navigation.navigate('AddLocation')} />
      </View>
      {locations.length === 0 && (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>No Map Location yet</Text>
          <Text style={styles.emptyText}>Add the first accessible location for the community.</Text>
        </View>
      )}
      <RampMap
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        markers={locations.map((location) => ({
          id: location.id,
          coordinate: { latitude: Number(location.latitude), longitude: Number(location.longitude) },
          title: location.placeName,
          description: location.address,
          onPress: () => navigation.navigate('LocationDetails', { id: location.id }),
        }))}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    gap: 12,
    marginBottom: 12,
  },
  title: {
    color: colors.ink,
    fontSize: 26,
    fontWeight: '900',
  },
  map: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 14,
  },
  empty: {
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 14,
    backgroundColor: colors.white,
  },
  emptyTitle: {
    color: colors.ink,
    fontWeight: '900',
  },
  emptyText: {
    marginTop: 4,
    color: colors.muted,
  },
});
