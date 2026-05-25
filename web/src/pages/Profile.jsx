import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AccessibilityCard from '../components/AccessibilityCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLocations } from '../hooks/useLocations';

const statusStyles = {
  approved: 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100',
  pending: 'bg-amber-50 text-amber-700 dark:bg-amber-500/15 dark:text-amber-100',
  rejected: 'bg-red-50 text-red-700 dark:bg-red-500/15 dark:text-red-100',
};

export default function Profile() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const { allLocations, loading } = useLocations();
  const [form, setForm] = useState({
    firstName: userProfile?.firstName || currentUser?.displayName?.split(' ')[0] || '',
    lastName: userProfile?.lastName || currentUser?.displayName?.split(' ').slice(1).join(' ') || '',
  });
  const myLocations = allLocations.filter((location) => location.contributorId === currentUser?.uid);

  async function handleSubmit(event) {
    event.preventDefault();
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    await updateUserProfile({ ...form, fullName });
    showToast('Profile updated.');
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6 overflow-x-hidden p-3 sm:p-4 lg:p-6">
      <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <h1 className="text-2xl font-black">User Profile</h1>
        <div className="mt-6 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(`${form.firstName} ${form.lastName}`.trim() || 'RAMP User')}`} alt="" className="h-20 w-20 rounded-full object-cover" />
          <div className="min-w-0">
            <p className="break-all font-semibold">{currentUser?.email}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{userProfile?.role || 'User'}</p>
          </div>
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input className="focus-ring rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-950" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} placeholder="First Name" required />
          <input className="focus-ring rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-950" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} placeholder="Last Name" required />
        </div>
        <button className="focus-ring mt-6 rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white">Save Profile</button>
      </form>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm sm:p-6 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-black">My Contributed Places</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Review and manage the accessibility locations you submitted.</p>
          </div>
          <Link className="focus-ring inline-flex w-full items-center justify-center rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 sm:w-auto" to="/locations/new">
            Add Location
          </Link>
        </div>

        {loading ? (
          <p className="mt-5 text-sm font-semibold text-slate-500 dark:text-slate-400">Loading your contributed places...</p>
        ) : myLocations.length === 0 ? (
          <div className="mt-5 rounded-lg border border-dashed border-slate-300 p-5 text-center dark:border-slate-700">
            <h3 className="font-bold">No contributions yet</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add your first accessible location so the community can discover and verify it.</p>
            <Link className="focus-ring mt-4 inline-flex w-full max-w-xs items-center justify-center rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 sm:w-auto" to="/locations/new">
              Add Location
            </Link>
          </div>
        ) : (
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            {myLocations.map((location) => {
              const status = location.status || 'pending';
              return (
                <div key={location.id} className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className={`rounded-full px-3 py-1 text-xs font-bold capitalize ${statusStyles[status] || statusStyles.pending}`}>
                      {status}
                    </span>
                    <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
                      {location.verified ? 'Community verified' : 'Awaiting verification'}
                    </span>
                  </div>
                  <AccessibilityCard location={location} onSelect={() => navigate(`/locations/${location.id}`)} />
                  <div className="grid gap-2 sm:flex sm:flex-wrap">
                    <Link className="focus-ring inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2 font-semibold hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800" to={`/locations/${location.id}`}>
                      View
                    </Link>
                    <Link className="focus-ring inline-flex items-center justify-center rounded-lg bg-brand-600 px-4 py-2 font-semibold text-white hover:bg-brand-700" to={`/locations/${location.id}/edit`}>
                      Edit
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
