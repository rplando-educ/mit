import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import LocationForm from '../components/LocationForm';
import MapComponent from '../components/MapComponent';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { reverseGeocode, searchPlaces } from '../services/geocodingService';
import { createLocation, getLocation, updateLocation } from '../services/locationService';

const emptyDraft = {
  placeName: '',
  description: '',
  address: '',
  latitude: '',
  longitude: '',
  features: [],
  rating: 5,
  photos: [],
};

export default function LocationEditor() {
  const { id } = useParams();
  const { currentUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [location, setLocation] = useState(null);
  const [draftLocation, setDraftLocation] = useState(emptyDraft);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [placeSearch, setPlaceSearch] = useState('');
  const [placeResults, setPlaceResults] = useState([]);
  const [loading, setLoading] = useState(Boolean(id));
  const [searchingPlaces, setSearchingPlaces] = useState(false);
  const [locatingAddress, setLocatingAddress] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!id) return;
    getLocation(id).then((item) => {
      setLocation(item);
      if (item) {
        setDraftLocation({ ...emptyDraft, ...item });
        setSelectedPosition([Number(item.latitude), Number(item.longitude)]);
      }
      setLoading(false);
    });
  }, [id]);

  async function handleMapClick(latlng) {
    const latitude = Number(latlng.lat.toFixed(6));
    const longitude = Number(latlng.lng.toFixed(6));

    setSelectedPosition([latitude, longitude]);
    setDraftLocation((current) => ({
      ...current,
      latitude,
      longitude,
    }));

    setLocatingAddress(true);
    try {
      const details = await reverseGeocode(latitude, longitude);
      setDraftLocation((current) => ({
        ...current,
        ...details,
      }));
      showToast('Pin dropped. Location details were auto-filled.');
    } catch (error) {
      setDraftLocation((current) => ({
        ...current,
        placeName: current.placeName || 'Selected accessible place',
        address: current.address || `${latitude}, ${longitude}`,
      }));
      showToast(error.message, 'error');
    } finally {
      setLocatingAddress(false);
    }
  }

  function handleCoordinatesChange(position) {
    setSelectedPosition(position);
  }

  async function handlePlaceSearch(event) {
    event.preventDefault();
    setSearchingPlaces(true);
    try {
      const results = await searchPlaces(placeSearch);
      setPlaceResults(results);
      if (!results.length) {
        showToast('No places found. Try a more specific search.', 'error');
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSearchingPlaces(false);
    }
  }

  function handlePlaceSelect(result) {
    const position = [result.latitude, result.longitude];
    setSelectedPosition(position);
    setDraftLocation((current) => ({
      ...current,
      placeName: result.placeName,
      address: result.address,
      latitude: Number(result.latitude).toFixed(6),
      longitude: Number(result.longitude).toFixed(6),
    }));
    setPlaceSearch(result.address);
    setPlaceResults([]);
    showToast('Map moved to the searched place. Drop the pin to confirm the exact spot.');
  }

  async function handleSubmit(data, files) {
    setSubmitting(true);
    try {
      if (id) {
        await updateLocation(id, data, files, currentUser);
        showToast('Location updated.');
        navigate(`/locations/${id}`);
      } else {
        const created = await createLocation(data, files, currentUser);
        showToast('Location submitted for community verification.');
        navigate(`/locations/${created.id}`);
      }
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <Loader />;

  return (
    <div className="grid max-w-full gap-5 overflow-x-hidden p-3 sm:p-4 lg:p-6">
      <section className="space-y-3">
        <div>
          <h1 className="text-xl font-black sm:text-2xl">{id ? 'Edit Accessibility Location' : 'Add Accessibility Location'}</h1>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Search for a place or address, let the map move there, then drop the pin to confirm the exact accessible spot.
          </p>
        </div>
        <form className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm dark:border-slate-800 dark:bg-slate-900" onSubmit={handlePlaceSearch}>
          <label className="text-sm font-semibold" htmlFor="place-search">Search place or address</label>
          <div className="mt-2 grid gap-2 sm:grid-cols-[1fr_auto]">
            <input
              id="place-search"
              className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950"
              value={placeSearch}
              onChange={(event) => setPlaceSearch(event.target.value)}
              placeholder="Example: Cebu City"
            />
            <button className="focus-ring rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70" disabled={searchingPlaces || placeSearch.trim().length < 3}>
              {searchingPlaces ? 'Searching...' : 'Search'}
            </button>
          </div>
          {placeResults.length > 0 && (
            <div className="mt-3 divide-y divide-slate-200 overflow-hidden rounded-lg border border-slate-200 dark:divide-slate-800 dark:border-slate-800">
              {placeResults.map((result) => (
                <button
                  key={result.id}
                  className="focus-ring block w-full bg-white px-3 py-3 text-left hover:bg-slate-50 dark:bg-slate-950 dark:hover:bg-slate-900"
                  type="button"
                  onClick={() => handlePlaceSelect(result)}
                >
                  <span className="block text-sm font-semibold">{result.placeName}</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-500 dark:text-slate-400">{result.address}</span>
                </button>
              ))}
            </div>
          )}
        </form>
        <MapComponent locations={location ? [location] : []} selectedPosition={selectedPosition} onMapClick={handleMapClick} />
        {locatingAddress && (
          <p className="rounded-lg border border-brand-100 bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
            Finding address for selected pin...
          </p>
        )}
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-5 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="mb-5 text-xl font-black sm:text-2xl">{id ? 'Edit Accessibility Location' : 'Add Accessibility Location'}</h1>
        <LocationForm initialValues={draftLocation} onCoordinatesChange={handleCoordinatesChange} submitting={submitting} onSubmit={handleSubmit} />
      </section>
    </div>
  );
}
