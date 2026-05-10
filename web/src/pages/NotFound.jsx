import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="grid min-h-[60vh] place-items-center p-6 text-center">
      <div>
        <h1 className="text-4xl font-black">Page not found</h1>
        <p className="mt-3 text-slate-500 dark:text-slate-400">That RAMP route does not exist.</p>
        <Link className="mt-6 inline-block rounded-lg bg-brand-600 px-5 py-3 font-semibold text-white" to="/">Return to dashboard</Link>
      </div>
    </div>
  );
}
