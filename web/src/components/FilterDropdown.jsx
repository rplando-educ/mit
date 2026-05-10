import { ACCESSIBILITY_FEATURES } from '../utils/constants';

export default function FilterDropdown({ value, onChange }) {
  return (
    <select
      className="focus-ring min-h-11 rounded-lg border border-slate-200 bg-white px-3 text-sm font-medium text-slate-700 shadow-sm dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      aria-label="Filter by accessibility feature"
    >
      <option value="">All features</option>
      {ACCESSIBILITY_FEATURES.map((feature) => (
        <option key={feature.id} value={feature.id}>
          {feature.label}
        </option>
      ))}
    </select>
  );
}
