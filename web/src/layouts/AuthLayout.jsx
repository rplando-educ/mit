import { Link, Outlet } from 'react-router-dom';
import rampLogo from '../assets/ramp-logo.png';

export default function AuthLayout() {
  return (
    <main className="grid min-h-screen bg-slate-50 lg:grid-cols-[1fr_1.1fr] dark:bg-slate-950">
      <section className="hidden bg-[url('https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?auto=format&fit=crop&w=1400&q=80')] bg-cover bg-center lg:block">
        <div className="flex h-full items-end bg-slate-950/55 p-10 text-white">
          <div>
            <Link to="/" className="mb-6 inline-flex items-center gap-2 text-2xl font-black">
              <img src={rampLogo} alt="RAMP" className="h-14 w-14 rounded-xl bg-white object-contain" /> RAMP
            </Link>
            <h1 className="max-w-lg text-4xl font-black">Crowdsourced accessibility data for real movement through real places.</h1>
          </div>
        </div>
      </section>
      <section className="flex min-w-0 items-center justify-center p-4 sm:p-5">
        <Outlet />
      </section>
    </main>
  );
}
