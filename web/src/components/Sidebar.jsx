import { NavLink } from 'react-router-dom';
import { IoAddCircleOutline, IoAnalyticsOutline, IoHomeOutline, IoMapOutline, IoPersonOutline } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';
import rampLogo from '../assets/ramp-logo.png';

const items = [
  { to: '/', label: 'Dashboard', icon: IoHomeOutline },
  { to: '/map', label: 'Map', icon: IoMapOutline },
  { to: '/locations/new', label: 'Add Place', icon: IoAddCircleOutline },
  { to: '/profile', label: 'Profile', icon: IoPersonOutline },
];

export default function Sidebar({ open, onClose }) {
  const { userProfile } = useAuth();
  const links = userProfile?.role === 'Admin' ? [...items, { to: '/admin', label: 'Admin', icon: IoAnalyticsOutline }] : items;

  return (
    <>
      <div className={`fixed inset-0 z-40 bg-slate-950/40 lg:hidden ${open ? 'block' : 'hidden'}`} onClick={onClose} />
      <aside
        className={`fixed left-0 top-0 z-50 h-full w-[min(18rem,calc(100vw-2rem))] border-r border-slate-200 bg-white p-4 transition lg:sticky lg:top-16 lg:z-30 lg:h-[calc(100vh-4rem)] lg:w-72 lg:translate-x-0 dark:border-slate-800 dark:bg-slate-950 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center gap-3 lg:hidden">
          <img src={rampLogo} alt="RAMP" className="h-11 w-11 rounded-xl object-contain" />
          <div>
            <p className="font-black text-slate-950 dark:text-white">RAMP</p>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Accessibility Map</p>
          </div>
        </div>
        <nav className="mt-4 space-y-2 lg:mt-0">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.to}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `focus-ring flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-semibold ${
                    isActive ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-100' : 'text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800'
                  }`
                }
              >
                <Icon size={20} /> {item.label}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
