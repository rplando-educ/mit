import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Profile() {
  const { currentUser, userProfile, updateUserProfile } = useAuth();
  const { showToast } = useToast();
  const [form, setForm] = useState({
    firstName: userProfile?.firstName || currentUser?.displayName?.split(' ')[0] || '',
    lastName: userProfile?.lastName || currentUser?.displayName?.split(' ').slice(1).join(' ') || '',
  });

  async function handleSubmit(event) {
    event.preventDefault();
    const fullName = `${form.firstName} ${form.lastName}`.trim();
    await updateUserProfile({ ...form, fullName });
    showToast('Profile updated.');
  }

  return (
    <div className="mx-auto max-w-3xl overflow-x-hidden p-3 sm:p-4 lg:p-6">
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
    </div>
  );
}
