export default function Loader({ label = 'Loading RAMP data...' }) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center gap-3 text-slate-600 dark:text-slate-300">
      <div className="h-11 w-11 animate-spin rounded-full border-4 border-brand-100 border-t-brand-600" />
      <p className="text-sm font-medium">{label}</p>
    </div>
  );
}
