import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { IoAddCircleOutline, IoCheckmarkCircle, IoMapOutline, IoPeopleOutline } from 'react-icons/io5';
import AccessibilityCard from '../components/AccessibilityCard';
import { ACCESSIBILITY_FEATURES } from '../utils/constants';
import { useLocations } from '../hooks/useLocations';
import rampLogo from '../assets/ramp-logo.png';

export default function Dashboard() {
  const navigate = useNavigate();
  const { allLocations } = useLocations();
  const approved = allLocations.filter((location) => location.status !== 'rejected');
  const verified = approved.filter((location) => location.verified).length;

  return (
    <div className="w-full max-w-[100vw] space-y-6 overflow-x-hidden p-3 sm:p-4 lg:p-6">
      <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-full overflow-hidden rounded-lg bg-slate-950 p-5 text-white shadow-soft sm:p-6 md:p-8">
        <div className="grid max-w-full gap-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="max-w-full sm:max-w-3xl">
            <p className="max-w-[26ch] text-sm font-semibold leading-snug text-brand-100 sm:max-w-none sm:text-base">Real-Time Accessibility Map Powered by Crowdsourced Data</p>
            <h1 className="mt-3 max-w-[18ch] text-2xl font-black leading-tight sm:max-w-full sm:text-3xl md:text-5xl">Find accessible places faster. Help verify the next one.</h1>
            <p className="mt-4 max-w-[30ch] text-sm leading-6 text-slate-200 sm:max-w-2xl sm:text-base">RAMP combines community reports, photos, ratings, and moderation workflows for accessibility data that keeps improving.</p>
            <div className="mt-6 grid gap-3 sm:flex sm:flex-wrap">
              <Link to="/map" className="focus-ring inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white hover:bg-brand-700 sm:w-auto"><IoMapOutline /> Explore Map</Link>
              <Link to="/locations/new" className="focus-ring inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 font-semibold text-slate-950 hover:bg-slate-100 sm:w-auto"><IoAddCircleOutline /> Add Location</Link>
            </div>
          </div>
          <img src={rampLogo} alt="RAMP logo" className="mx-auto hidden h-52 w-52 rounded-2xl bg-white object-contain p-2 shadow-soft md:block" />
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          ['Accessible Places', approved.length, IoMapOutline],
          ['Community Verified', verified, IoCheckmarkCircle],
          ['Feature Reports', approved.reduce((total, item) => total + (item.features?.length || 0), 0), IoPeopleOutline],
        ].map(([label, value, Icon]) => (
          <div key={label} className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <Icon className="text-2xl text-brand-600" />
            <p className="mt-4 text-3xl font-black">{value}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{label}</p>
          </div>
        ))}
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xl font-bold">Accessibility Categories</h2>
          <Link className="text-sm font-semibold text-brand-700 dark:text-brand-100" to="/map">View all</Link>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {ACCESSIBILITY_FEATURES.map((feature) => (
            <Link key={feature.id} to={`/map?feature=${feature.id}`} className="rounded-lg border border-slate-200 bg-white p-4 font-semibold shadow-sm hover:shadow-soft dark:border-slate-800 dark:bg-slate-900">
              <span className="mr-3 inline-block h-3 w-3 rounded-full" style={{ backgroundColor: feature.color }} />
              {feature.label}
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-4 text-xl font-bold">Recently Added Accessible Locations</h2>
        {approved.length === 0 ? (
          <div className="rounded-lg border border-dashed border-slate-300 bg-white p-5 text-center shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <IoMapOutline className="mx-auto text-3xl text-brand-600" />
            <h3 className="mt-3 text-lg font-bold">No Map Location yet</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Add the first accessibility location for the community.</p>
            <Link to="/locations/new" className="focus-ring mt-4 inline-flex w-full max-w-xs items-center justify-center gap-2 rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700 sm:w-auto">
              <IoAddCircleOutline /> Add Location
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 xl:grid-cols-2">
            {approved.slice(0, 4).map((location) => <AccessibilityCard key={location.id} location={location} onSelect={() => navigate(`/locations/${location.id}`)} />)}
          </div>
        )}
      </section>
    </div>
  );
}
