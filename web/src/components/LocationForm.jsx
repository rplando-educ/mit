import { useEffect, useMemo, useState } from 'react';
import { IoCloudUploadOutline, IoSaveOutline } from 'react-icons/io5';
import { ACCESSIBILITY_FEATURES } from '../utils/constants';

const emptyLocation = {
  placeName: '',
  description: '',
  address: '',
  latitude: '',
  longitude: '',
  features: [],
  rating: 5,
  photos: [],
};

const ratingOptions = [
  { value: 5, label: '5 - Excellent accessibility' },
  { value: 4, label: '4 - Good accessibility' },
  { value: 3, label: '3 - Partially accessible' },
  { value: 2, label: '2 - Limited accessibility' },
  { value: 1, label: '1 - Needs accessibility improvements' },
];

export default function LocationForm({ initialValues = {}, onSubmit, submitting = false, onCoordinatesChange }) {
  const [form, setForm] = useState({ ...emptyLocation, ...initialValues });
  const [files, setFiles] = useState([]);

  const previews = useMemo(() => Array.from(files).map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => {
    setForm((current) => ({ ...current, ...initialValues }));
  }, [initialValues]);

  function updateField(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function updateCoordinate(field, value) {
    setForm((current) => {
      const next = { ...current, [field]: value };
      const latitude = Number(next.latitude);
      const longitude = Number(next.longitude);

      if (!Number.isNaN(latitude) && !Number.isNaN(longitude)) {
        onCoordinatesChange?.([latitude, longitude]);
      }

      return next;
    });
  }

  function toggleFeature(featureId) {
    setForm((current) => ({
      ...current,
      features: current.features.includes(featureId)
        ? current.features.filter((id) => id !== featureId)
        : [...current.features, featureId],
    }));
  }

  function submitForm(event) {
    event.preventDefault();
    onSubmit(
      {
        ...form,
        latitude: Number(form.latitude),
        longitude: Number(form.longitude),
        rating: Number(form.rating),
      },
      files,
    );
  }

  return (
    <form className="space-y-5" onSubmit={submitForm}>
      <div className="grid min-w-0 gap-4 md:grid-cols-2">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Place Name</span>
          <input className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" required value={form.placeName} onChange={(e) => updateField('placeName', e.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Address</span>
          <input className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" required value={form.address} onChange={(e) => updateField('address', e.target.value)} />
        </label>
      </div>
      <label className="space-y-2 block">
        <span className="text-sm font-semibold">Description</span>
        <textarea className="focus-ring min-h-28 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" required value={form.description} onChange={(e) => updateField('description', e.target.value)} />
      </label>
      <div className="grid min-w-0 gap-4 md:grid-cols-3">
        <label className="space-y-2">
          <span className="text-sm font-semibold">Latitude</span>
          <input className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" required type="number" step="any" value={form.latitude} onChange={(e) => updateCoordinate('latitude', e.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Longitude</span>
          <input className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" required type="number" step="any" value={form.longitude} onChange={(e) => updateCoordinate('longitude', e.target.value)} />
        </label>
        <label className="space-y-2">
          <span className="text-sm font-semibold">Accessibility Rating</span>
          <select className="focus-ring w-full rounded-lg border border-slate-200 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-900" value={form.rating} onChange={(e) => updateField('rating', e.target.value)}>
            {ratingOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
      </div>
      <fieldset>
        <legend className="mb-3 text-sm font-semibold">Accessibility Features</legend>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {ACCESSIBILITY_FEATURES.map((feature) => (
            <label key={feature.id} className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm font-medium dark:border-slate-800">
              <input type="checkbox" checked={form.features.includes(feature.id)} onChange={() => toggleFeature(feature.id)} />
              <span className="break-words">{feature.label}</span>
            </label>
          ))}
        </div>
      </fieldset>
      <label className="block rounded-lg border border-dashed border-slate-300 p-5 text-center dark:border-slate-700">
        <IoCloudUploadOutline className="mx-auto mb-2 text-2xl text-brand-600" />
        <span className="text-sm font-semibold">Upload photos</span>
        <input className="sr-only" type="file" accept="image/*" multiple onChange={(e) => setFiles(e.target.files)} />
      </label>
      {(previews.length > 0 || form.photos?.length > 0) && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[...(form.photos || []), ...previews].map((src) => (
            <img key={src} src={src} alt="Location preview" className="h-24 w-full rounded-lg object-cover" />
          ))}
        </div>
      )}
      <button className="focus-ring inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70 sm:w-fit" disabled={submitting}>
        <IoSaveOutline /> {submitting ? 'Saving...' : 'Save Location'}
      </button>
    </form>
  );
}
