import { IoCheckmarkCircle, IoLocationOutline, IoStar } from 'react-icons/io5';
import { ACCESSIBILITY_FEATURES } from '../utils/constants';
import { calculateAccessibilityScore } from '../utils/scoring';

export default function AccessibilityCard({ location, onSelect }) {
  const score = calculateAccessibilityScore(location);

  return (
    <button
      className="focus-ring group w-full rounded-lg border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft dark:border-slate-800 dark:bg-slate-900"
      onClick={() => onSelect?.(location)}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="break-words font-semibold text-slate-950 dark:text-white">{location.placeName}</h3>
            {location.verified && <IoCheckmarkCircle className="text-brand-600" title="Community verified" />}
          </div>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
            <IoLocationOutline className="shrink-0" /> <span className="break-words">{location.address}</span>
          </p>
        </div>
        <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
          {score}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-600 dark:text-slate-300">{location.description}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {(location.features || []).map((id) => {
          const feature = ACCESSIBILITY_FEATURES.find((item) => item.id === id);
          return (
            <span key={id} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {feature?.label || id}
            </span>
          );
        })}
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span className="min-w-0 break-words">By {location.contributorName || 'Community member'}</span>
        <span className="flex items-center gap-1 font-semibold text-amber-600">
          <IoStar /> {Number(location.rating || 0).toFixed(1)}
        </span>
      </div>
    </button>
  );
}
