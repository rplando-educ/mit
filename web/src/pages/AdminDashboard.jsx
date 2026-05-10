import { useMemo } from 'react';
import { IoCheckmarkOutline, IoCloseOutline, IoStatsChartOutline } from 'react-icons/io5';
import AccessibilityCard from '../components/AccessibilityCard';
import { useToast } from '../context/ToastContext';
import { useLocations } from '../hooks/useLocations';
import { approveLocation, deleteLocation } from '../services/locationService';

export default function AdminDashboard() {
  const { allLocations } = useLocations();
  const { showToast } = useToast();
  const pending = useMemo(() => allLocations.filter((location) => location.status === 'pending'), [allLocations]);

  async function moderate(location, status) {
    await approveLocation(location.id, status);
    showToast(`Submission ${status}.`);
  }

  return (
    <div className="max-w-full space-y-6 overflow-x-hidden p-3 sm:p-4 lg:p-6">
      <div>
        <h1 className="text-2xl font-black">Admin Dashboard</h1>
        <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Manage submissions, reports, content quality, and analytics.</p>
      </div>
      <section className="grid gap-4 md:grid-cols-4">
        {[
          ['Total Locations', allLocations.length],
          ['Pending Review', pending.length],
          ['Verified', allLocations.filter((item) => item.verified).length],
          ['Reports', allLocations.reduce((total, item) => total + (item.reports || 0), 0)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <IoStatsChartOutline className="text-xl text-brand-600" />
            <p className="mt-3 text-2xl font-black">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </section>
      <section>
        <h2 className="mb-4 text-xl font-bold">Pending Submissions</h2>
        <div className="grid gap-4 xl:grid-cols-2">
          {pending.map((location) => (
            <div key={location.id} className="space-y-3">
              <AccessibilityCard location={location} />
              <div className="grid gap-2 sm:flex sm:flex-wrap">
                <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white" onClick={() => moderate(location, 'approved')}><IoCheckmarkOutline /> Approve</button>
                <button className="focus-ring inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-4 py-2 font-semibold text-white" onClick={() => moderate(location, 'rejected')}><IoCloseOutline /> Reject</button>
                <button className="focus-ring rounded-lg bg-red-600 px-4 py-2 font-semibold text-white" onClick={() => deleteLocation(location.id)}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
