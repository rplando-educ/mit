import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { IoAddCircleOutline, IoMapOutline } from 'react-icons/io5';
import FilterDropdown from '../components/FilterDropdown';
import MapComponent from '../components/MapComponent';
import SearchBar from '../components/SearchBar';
import AccessibilityCard from '../components/AccessibilityCard';
import Loader from '../components/Loader';
import { useLocations } from '../hooks/useLocations';

export default function MapPage() {
  const [params] = useSearchParams();
  const [search, setSearch] = useState('');
  const [feature, setFeature] = useState(params.get('feature') || '');
  const [userPosition, setUserPosition] = useState(null);
  const navigate = useNavigate();
  const { locations, allLocations, loading } = useLocations({ search, feature });

  useEffect(() => {
    navigator.geolocation?.getCurrentPosition((position) => {
      setUserPosition([position.coords.latitude, position.coords.longitude]);
    });
  }, []);

  return (
    <div className="grid max-w-full gap-5 overflow-x-hidden p-3 sm:p-4 lg:grid-cols-[380px_1fr] lg:p-6">
      <aside className="space-y-4 lg:order-1">
        <div>
          <h1 className="text-2xl font-black">Accessibility Map</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Real-time community markers with filters and nearby context.</p>
        </div>
        <div className="grid gap-3">
          <SearchBar value={search} onChange={setSearch} />
          <FilterDropdown value={feature} onChange={setFeature} />
        </div>
        {loading ? <Loader /> : allLocations.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <IoMapOutline className="mx-auto text-3xl text-brand-600" />
            <h2 className="mt-3 text-lg font-bold">No Map Location yet</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Start the map by adding the first accessible place.</p>
            <Link to="/locations/new" className="focus-ring mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 sm:w-auto">
              <IoAddCircleOutline /> Add Location
            </Link>
          </div>
        ) : locations.length === 0 ? (
          <div className="rounded-lg border border-slate-200 bg-white p-5 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <h2 className="text-lg font-bold">No matching locations</h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Try changing your search or accessibility filter.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {locations.map((location) => <AccessibilityCard key={location.id} location={location} onSelect={() => navigate(`/locations/${location.id}`)} />)}
          </div>
        )}
      </aside>
      <div className="lg:order-2">
        <MapComponent locations={allLocations} userPosition={userPosition} onSelectLocation={(location) => navigate(`/locations/${location.id}`)} />
      </div>
    </div>
  );
}
