export const DEFAULT_REGION = {
  latitude: Number(process.env.EXPO_PUBLIC_MAP_DEFAULT_LAT || 10.3157),
  longitude: Number(process.env.EXPO_PUBLIC_MAP_DEFAULT_LNG || 123.8854),
  latitudeDelta: 0.04,
  longitudeDelta: 0.04,
};

export const ACCESSIBILITY_FEATURES = [
  { id: 'ramp', label: 'Wheelchair Ramp' },
  { id: 'restroom', label: 'Accessible Restroom' },
  { id: 'parking', label: 'PWD Parking' },
  { id: 'elevator', label: 'Elevator' },
  { id: 'tactile-path', label: 'Tactile Path' },
  { id: 'entrance', label: 'Accessible Entrance' },
];

export const ratingOptions = [
  { value: 5, label: '5 - Excellent accessibility' },
  { value: 4, label: '4 - Good accessibility' },
  { value: 3, label: '3 - Partially accessible' },
  { value: 2, label: '2 - Limited accessibility' },
  { value: 1, label: '1 - Needs improvements' },
];
