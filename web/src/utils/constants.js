export const ACCESSIBILITY_FEATURES = [
  { id: 'ramp', label: 'Wheelchair Ramp', color: '#0f9f6e' },
  { id: 'restroom', label: 'Accessible Restroom', color: '#2563eb' },
  { id: 'parking', label: 'PWD Parking', color: '#7c3aed' },
  { id: 'elevator', label: 'Elevator', color: '#d97706' },
  { id: 'tactile-path', label: 'Tactile Path', color: '#dc2626' },
  { id: 'entrance', label: 'Accessible Entrance', color: '#0891b2' },
];

export const DEFAULT_CENTER = [
  Number(import.meta.env.VITE_MAP_DEFAULT_LAT || 10.3157),
  Number(import.meta.env.VITE_MAP_DEFAULT_LNG || 123.8854),
];

export const exampleLocations = [
  {
    id: 'demo-1',
    placeName: 'City Hall Service Center',
    description: 'Ramp access at the front, accessible restroom on ground floor.',
    address: 'Central District',
    latitude: DEFAULT_CENTER[0],
    longitude: DEFAULT_CENTER[1],
    features: ['ramp', 'restroom', 'entrance'],
    photos: [],
    rating: 4.6,
    contributorName: 'RAMP Community',
    verified: true,
    status: 'approved',
  },
  {
    id: 'demo-2',
    placeName: 'North Transit Station',
    description: 'Elevator access and tactile path near platform one.',
    address: 'North Avenue',
    latitude: DEFAULT_CENTER[0] + 0.01,
    longitude: DEFAULT_CENTER[1] + 0.01,
    features: ['elevator', 'tactile-path'],
    photos: [],
    rating: 4.2,
    contributorName: 'RAMP Community',
    verified: false,
    status: 'pending',
  },
];
