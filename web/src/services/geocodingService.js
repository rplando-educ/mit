function pickPlaceName(address, fallback) {
  return (
    address.name ||
    address.amenity ||
    address.building ||
    address.shop ||
    address.tourism ||
    address.office ||
    address.road ||
    fallback
  );
}

export async function reverseGeocode(latitude, longitude) {
  const params = new URLSearchParams({
    format: 'jsonv2',
    lat: String(latitude),
    lon: String(longitude),
    addressdetails: '1',
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/reverse?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Unable to find address for the selected pin.');
  }

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

export async function searchPlaces(query) {
  const trimmedQuery = query.trim();

  if (trimmedQuery.length < 3) {
    return [];
  }

  const params = new URLSearchParams({
    format: 'jsonv2',
    q: trimmedQuery,
    addressdetails: '1',
    limit: '5',
  });

  const response = await fetch(`https://nominatim.openstreetmap.org/search?${params.toString()}`, {
    headers: {
      Accept: 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Unable to search for that place.');
  }

  const results = await response.json();

  return results.map((result) => {
    const latitude = Number(result.lat);
    const longitude = Number(result.lon);
    const fallbackName = result.display_name?.split(',')[0] || trimmedQuery;

    return {
      id: result.place_id,
      placeName: pickPlaceName(result.address || {}, fallbackName),
      address: result.display_name || '',
      latitude,
      longitude,
    };
  });
}
