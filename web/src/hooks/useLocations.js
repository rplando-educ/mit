import { useEffect, useMemo, useState } from 'react';
import { subscribeToLocations } from '../services/locationService';

export function useLocations(filters = {}) {
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToLocations((items) => {
      setLocations(items);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const filteredLocations = useMemo(() => {
    return locations.filter((location) => {
      const term = filters.search?.toLowerCase();
      const matchesSearch =
        !term ||
        location.placeName?.toLowerCase().includes(term) ||
        location.address?.toLowerCase().includes(term) ||
        location.description?.toLowerCase().includes(term);
      const matchesFeature = !filters.feature || location.features?.includes(filters.feature);
      return matchesSearch && matchesFeature;
    });
  }, [locations, filters]);

  return { locations: filteredLocations, allLocations: locations, loading };
}
