import * as ImagePicker from 'expo-image-picker';
import { useEffect, useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import AppButton from '../components/AppButton';
import FormInput from '../components/FormInput';
import RampMap from '../components/RampMap';
import Screen from '../components/Screen';
import { useAuth } from '../context/AuthContext';
import { reverseGeocode, searchPlaces } from '../services/geocodingService';
import { createLocation, getLocation, updateLocation } from '../services/locationService';
import { colors } from '../theme/colors';
import { ACCESSIBILITY_FEATURES, DEFAULT_REGION, ratingOptions } from '../utils/constants';

const emptyForm = {
  placeName: '',
  description: '',
  address: '',
  latitude: '',
  longitude: '',
  features: [],
  rating: 5,
};

export default function AddLocationScreen({ navigation, route }) {
  const { currentUser } = useAuth();
  const locationId = route.params?.id;
  const [region, setRegion] = useState(DEFAULT_REGION);
  const [marker, setMarker] = useState(null);
  const [query, setQuery] = useState('Cebu City');
  const [results, setResults] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState('');
  const [lookupStatus, setLookupStatus] = useState('');

  useEffect(() => {
    if (!locationId) return;

    getLocation(locationId).then((item) => {
      if (!item) return;
      const latitude = Number(item.latitude);
      const longitude = Number(item.longitude);
      setForm({ ...emptyForm, ...item });
      setMarker({ latitude, longitude });
      setRegion({
        latitude,
        longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
      setQuery(item.address || item.placeName || 'Cebu City');
    });
  }, [locationId]);

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  async function handleSearch() {
    setSearching(true);
    setSearchError('');
    try {
      const items = await searchPlaces(query);
      setResults(items);
      if (!items.length) setSearchError('No places found. Try a more specific Cebu City place or address.');
    } catch (error) {
      setResults([]);
      setSearchError(error.message || 'Search failed. Please try again.');
      Alert.alert('Search failed', error.message);
    } finally {
      setSearching(false);
    }
  }

  function selectSearchResult(item) {
    const nextRegion = {
      latitude: item.latitude,
      longitude: item.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };
    setRegion(nextRegion);
    setMarker({ latitude: item.latitude, longitude: item.longitude });
    setForm((current) => ({
      ...current,
      placeName: item.placeName,
      address: item.address,
      latitude: item.latitude.toFixed(6),
      longitude: item.longitude.toFixed(6),
    }));
    setResults([]);
    setSearchError('');
  }

  async function dropPin(coordinate) {
    const latitude = Number(coordinate.latitude);
    const longitude = Number(coordinate.longitude);
    const coordinateAddress = `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;

    setMarker(coordinate);
    setRegion((current) => ({
      ...current,
      latitude,
      longitude,
    }));
    setForm((current) => ({
      ...current,
      placeName: current.placeName || 'Selected accessible place',
      address: coordinateAddress,
      latitude: latitude.toFixed(6),
      longitude: longitude.toFixed(6),
    }));

    setLookupStatus('Looking up address...');
    try {
      const details = await reverseGeocode(latitude, longitude);
      setForm((current) => ({ ...current, ...details }));
      setLookupStatus('');
    } catch (error) {
      setLookupStatus('Address lookup unavailable. You can edit the fields manually.');
    }
  }

  function toggleFeature(id) {
    setForm((current) => ({
      ...current,
      features: current.features.includes(id)
        ? current.features.filter((featureId) => featureId !== id)
        : [...current.features, id],
    }));
  }

  async function pickPhotos() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permission needed', 'Allow photo access to upload location photos.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      allowsMultipleSelection: true,
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.75,
    });

    if (!result.canceled) {
      setPhotos(result.assets);
    }
  }

  async function submit() {
    if (!marker) {
      Alert.alert('Drop a pin first', 'Tap the map to confirm the exact accessible location.');
      return;
    }

    setLoading(true);
    try {
      const payload = {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        rating: Number(form.rating),
      };

      if (locationId) {
        await updateLocation(locationId, payload, photos, currentUser);
        Alert.alert('Updated', 'Location details were updated.');
        navigation.navigate('LocationDetails', { id: locationId });
      } else {
        await createLocation(payload, photos, currentUser);
        Alert.alert('Submitted', 'Location submitted for community verification.');
        navigation.navigate('Home');
      }
    } catch (error) {
      Alert.alert('Submission failed', error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Screen>
      <Text style={styles.title}>{locationId ? 'Edit accessibility location' : 'Add accessibility location'}</Text>
      <Text style={styles.subtitle}>Search for a place or address, let the map move there, then tap the map to confirm the exact accessible spot.</Text>

      <View style={styles.search}>
        <FormInput value={query} onChangeText={setQuery} placeholder="Cebu City" />
        <AppButton title="Search" onPress={handleSearch} loading={searching} disabled={query.trim().length < 3} />
      </View>

      {results.map((item) => (
        <Pressable key={item.id} style={styles.result} onPress={() => selectSearchResult(item)}>
          <Text style={styles.resultTitle}>{item.placeName}</Text>
          <Text style={styles.resultAddress}>{item.address}</Text>
        </Pressable>
      ))}
      {searchError ? <Text style={styles.searchError}>{searchError}</Text> : null}

      <RampMap
        style={styles.map}
        region={region}
        onRegionChangeComplete={setRegion}
        onMapPress={(event) => dropPin(event.nativeEvent.coordinate)}
        selectedMarker={marker ? { coordinate: marker, title: 'Selected accessible location' } : null}
      />
      {lookupStatus ? <Text style={styles.lookupStatus}>{lookupStatus}</Text> : null}

      <View style={styles.form}>
        <FormInput label="Place Name" value={form.placeName} onChangeText={(value) => update('placeName', value)} />
        <FormInput label="Address" value={form.address} onChangeText={(value) => update('address', value)} multiline />
        <View style={styles.row}>
          <FormInput label="Latitude" style={styles.rowItem} value={String(form.latitude)} onChangeText={(value) => update('latitude', value)} keyboardType="numeric" />
          <FormInput label="Longitude" style={styles.rowItem} value={String(form.longitude)} onChangeText={(value) => update('longitude', value)} keyboardType="numeric" />
        </View>
        <FormInput label="Description" value={form.description} onChangeText={(value) => update('description', value)} multiline />

        <Text style={styles.label}>Accessibility Rating</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.pills}>
          {ratingOptions.map((option) => (
            <Pressable key={option.value} style={[styles.pill, form.rating === option.value && styles.pillActive]} onPress={() => update('rating', option.value)}>
              <Text style={[styles.pillText, form.rating === option.value && styles.pillTextActive]}>{option.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={styles.label}>Accessibility Features</Text>
        <View style={styles.featureGrid}>
          {ACCESSIBILITY_FEATURES.map((feature) => (
            <Pressable key={feature.id} style={[styles.feature, form.features.includes(feature.id) && styles.featureActive]} onPress={() => toggleFeature(feature.id)}>
              <Text style={[styles.featureText, form.features.includes(feature.id) && styles.featureTextActive]}>{feature.label}</Text>
            </Pressable>
          ))}
        </View>

        <AppButton title="Choose Photos" variant="secondary" onPress={pickPhotos} />
        {photos.length > 0 && (
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.photos}>
            {photos.map((photo) => <Image key={photo.uri} source={{ uri: photo.uri }} style={styles.photo} />)}
          </ScrollView>
        )}
        <AppButton title={locationId ? 'Update Location' : 'Submit Location'} onPress={submit} loading={loading} disabled={!form.placeName || !form.address || !form.description} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    color: colors.ink,
    fontSize: 24,
    fontWeight: '900',
  },
  subtitle: {
    marginTop: 6,
    color: colors.muted,
    lineHeight: 22,
  },
  search: {
    gap: 10,
    marginTop: 18,
  },
  result: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
    padding: 12,
    backgroundColor: colors.white,
  },
  resultTitle: {
    color: colors.ink,
    fontWeight: '800',
  },
  resultAddress: {
    marginTop: 4,
    color: colors.muted,
    fontSize: 12,
    lineHeight: 18,
  },
  searchError: {
    marginTop: 8,
    color: '#b42318',
    fontWeight: '700',
    lineHeight: 20,
  },
  lookupStatus: {
    color: colors.muted,
    fontWeight: '700',
    lineHeight: 20,
  },
  map: {
    height: 320,
    marginTop: 16,
    borderRadius: 14,
  },
  form: {
    gap: 14,
    marginTop: 18,
  },
  row: {
    flexDirection: 'row',
    gap: 10,
  },
  rowItem: {
    flex: 1,
  },
  label: {
    color: colors.ink,
    fontWeight: '800',
  },
  pills: {
    gap: 8,
  },
  pill: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: colors.white,
  },
  pillActive: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  pillText: {
    color: colors.muted,
    fontWeight: '700',
  },
  pillTextActive: {
    color: colors.brandDark,
  },
  featureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  feature: {
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 9,
    backgroundColor: colors.white,
  },
  featureActive: {
    borderColor: colors.brand,
    backgroundColor: colors.brandSoft,
  },
  featureText: {
    color: colors.muted,
    fontWeight: '700',
  },
  featureTextActive: {
    color: colors.brandDark,
  },
  photos: {
    gap: 8,
  },
  photo: {
    width: 86,
    height: 86,
    borderRadius: 12,
  },
});
