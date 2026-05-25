import { useEffect, useMemo, useState } from 'react';
import { IoCheckmarkOutline, IoCloseOutline, IoPeopleOutline, IoSearchOutline, IoStatsChartOutline } from 'react-icons/io5';
import AccessibilityCard from '../components/AccessibilityCard';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useLocations } from '../hooks/useLocations';
import { approveLocation, deleteLocation } from '../services/locationService';
import { subscribeToUsers, updateUserRole } from '../services/userService';

function formatDate(value) {
  if (!value?.toDate) return 'Not available';
  return value.toDate().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function AdminDashboard() {
  const { currentUser } = useAuth();
  const { allLocations } = useLocations();
  const { showToast } = useToast();
  const [users, setUsers] = useState([]);
  const [userSearch, setUserSearch] = useState('');
  const [updatingUserId, setUpdatingUserId] = useState('');
  const pending = useMemo(() => allLocations.filter((location) => location.status === 'pending'), [allLocations]);
  const filteredUsers = useMemo(() => {
    const search = userSearch.trim().toLowerCase();
    return users
      .filter((user) => {
        if (!search) return true;
        return [user.fullName, user.firstName, user.lastName, user.email, user.role]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));
      })
      .sort((a, b) => (a.fullName || a.email || '').localeCompare(b.fullName || b.email || ''));
  }, [users, userSearch]);

  useEffect(() => subscribeToUsers(setUsers), []);

  async function moderate(location, status) {
    await approveLocation(location.id, status);
    showToast(`Submission ${status}.`);
  }

  async function changeRole(user, role) {
    setUpdatingUserId(user.id);
    try {
      await updateUserRole(user.id, role);
      showToast(`${user.email || 'User'} is now ${role}.`);
    } catch (error) {
      showToast('Unable to update user role. Check Firestore admin rules.', 'error');
    } finally {
      setUpdatingUserId('');
    }
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
          ['Users', users.length],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <IoStatsChartOutline className="text-xl text-brand-600" />
            <p className="mt-3 text-2xl font-black">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </section>
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-bold">Manage Users</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Promote trusted community members or return admins to standard user access.</p>
          </div>
          <div className="relative w-full sm:max-w-xs">
            <IoSearchOutline className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="focus-ring w-full rounded-lg border border-slate-200 bg-white py-3 pl-10 pr-3 text-sm dark:border-slate-700 dark:bg-slate-950"
              placeholder="Search users"
              value={userSearch}
              onChange={(event) => setUserSearch(event.target.value)}
            />
          </div>
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm">
            <thead className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <tr>
                <th className="py-3 pr-4">User</th>
                <th className="py-3 pr-4">Email</th>
                <th className="py-3 pr-4">Role</th>
                <th className="py-3 pr-4">Created</th>
                <th className="py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredUsers.map((user) => {
                const isAdmin = user.role === 'Admin';
                const isCurrentUser = user.id === currentUser?.uid;
                const nextRole = isAdmin ? 'User' : 'Admin';
                return (
                  <tr key={user.id}>
                    <td className="py-3 pr-4">
                      <div className="flex items-center gap-3">
                        <span className="grid h-9 w-9 place-items-center rounded-lg bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100">
                          <IoPeopleOutline />
                        </span>
                        <div>
                          <p className="font-bold text-slate-950 dark:text-white">{user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim() || 'Unnamed user'}</p>
                          {isCurrentUser ? <p className="text-xs font-semibold text-brand-700 dark:text-brand-100">Current account</p> : null}
                        </div>
                      </div>
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{user.email || 'No email'}</td>
                    <td className="py-3 pr-4">
                      <span className={`rounded-full px-3 py-1 text-xs font-bold ${isAdmin ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'}`}>
                        {user.role || 'User'}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">{formatDate(user.dateCreated)}</td>
                    <td className="py-3 text-right">
                      <button
                        className="focus-ring rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:text-slate-100 dark:hover:bg-slate-800"
                        disabled={isCurrentUser || updatingUserId === user.id}
                        onClick={() => changeRole(user, nextRole)}
                      >
                        {updatingUserId === user.id ? 'Updating...' : isAdmin ? 'Demote to User' : 'Promote to Admin'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {filteredUsers.length === 0 ? (
            <div className="rounded-lg border border-dashed border-slate-300 p-5 text-center text-sm text-slate-500 dark:border-slate-700 dark:text-slate-400">
              No users found.
            </div>
          ) : null}
        </div>
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
