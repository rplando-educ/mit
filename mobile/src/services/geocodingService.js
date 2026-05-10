function pickPlaceName(address, fallback) {
  return (
    address.name ||
    address.amenity ||
    address.building ||
    address.shop ||
    address.tourism ||
    address.office ||
    address.road ||
    address.city ||
    address.town ||
    address.village ||
    fallback
  );
}

function formatPhotonAddress(properties) {
  return [
    properties.name,
    properties.street,
    properties.district,
    properties.city,
    properties.county,
    properties.state,
    properties.country,
  ]
    .filter(Boolean)
    .filter((value, index, values) => values.indexOf(value) === index)
    .join(', ');
}

async function searchWithPhoton(trimmedQuery) {
  const params = new URLSearchParams({
    q: trimmedQuery,
    limit: '5',
    lat: '10.3157',
    lon: '123.8854',
  });

  const response = await fetch(`https://photon.komoot.io/api/?${params.toString()}`);
  if (!response.ok) throw new Error('Unable to search for that place.');
  const data = await response.json();

  return (data.features || []).map((feature, index) => {
    const [longitude, latitude] = feature.geometry.coordinates;
    const properties = feature.properties || {};
    const placeName = properties.name || properties.street || trimmedQuery;

    return {
      id: String(properties.osm_id || `${placeName}-${index}`),
      placeName,
      address: formatPhotonAddress(properties) || placeName,
      latitude: Number(latitude),
      longitude: Number(longitude),
    };
  });
}

async function searchWithNominatim(trimmedQuery) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    q: trimmedQuery,
    addressdetails: '1',
    limit: '5',
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`);
  if (!response.ok) throw new Error('Unable to search for that place.');
  const results = await response.json();

  return results.map((result) => {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    const fallbackName = result.display_name?.split(',')[0] || trimmedQuery;
    return {
      id: String(result.place_id),
      placeName: pickPlaceName(result.address || {}, fallbackName),
      address: result.display_name || '',
      latitude,
      longitude,
    };
  });
}

async function reverseWithNominatim(latitude, longitude) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: '1',
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`);
  if (!response.ok) throw new Error('Unable to find address for the selected pin.');
  const data = await response.json();
  const address = data.address || {};
  const fallbackName = data.display_name?.split(',')[0] || 'Selected accessible place';

  return {
    placeName: pickPlaceName(address, fallbackName),
    address: data.display_name || '',
    latitude: Number(latitude).toFixed(6),
    longitude: Number(longitude).toFixed(6),
  };
}

async function reverseWithPhoton(latitude, longitude) {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
  });

  const response = await fetch(`https://photon.komoot.io/reverse?${params.toString()}`);
  if (!response.ok) throw new Error('Unable to find address for the selected pin.');
  const data = await response.json();
  const feature = data.features?.[0];
  const properties = feature?.properties || {};
  const placeName = properties.name || properties.street || properties.city || 'Selected accessible place';

  return {
    placeName,
    address: formatPhotonAddress(properties) || `${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`,
    latitude: Number(latitude).toFixed(6),
    longitude: Number(longitude).toFixed(6),
  };
}

export async function searchPlaces(query) {
  const trimmedQuery = query.trim();
  if (trimmedQuery.length < 3) return [];

  try {
    const photonResults = await searchWithPhoton(trimmedQuery);
    if (photonResults.length) return photonResults;
  } catch (error) {
    // Fall through to Nominatim, which is useful on native when Photon is unavailable.
  }

  return searchWithNominatim(trimmedQuery);
}

export async function reverseGeocode(latitude, longitude) {
  try {
    return await reverseWithNominatim(latitude, longitude);
  } catch (error) {
    try {
      return await reverseWithPhoton(latitude, longitude);
    } catch (fallbackError) {
      return {
        placeName: 'Selected accessible place',
        address: `${Number(latitude).toFixed(6)}, ${Number(longitude).toFixed(6)}`,
        latitude: Number(latitude).toFixed(6),
        longitude: Number(longitude).toFixed(6),
      };
    }
  }
}
