import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function Login() {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      showToast('Welcome back to RAMP.');
      navigate(location.state?.from?.pathname || '/');
    } catch (error) {
      showToast(error.message, 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-[calc(100vw-2rem)] rounded-lg bg-white p-5 shadow-soft sm:w-full sm:max-w-md sm:p-6 dark:bg-slate-900">
      <h1 className="text-2xl font-black">Login</h1>
      <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Access your saved places, submissions, and community tools.</p>
      <div className="mt-6 space-y-4">
        <input className="focus-ring w-full rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-950" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
        <input className="focus-ring w-full rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-950" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>
      <button disabled={loading} className="focus-ring mt-6 w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700">{loading ? 'Signing in...' : 'Sign in'}</button>
      <div className="mt-4 flex justify-between text-sm">
        <Link className="font-semibold text-brand-700 dark:text-brand-100" to="/forgot-password">Forgot password?</Link>
        <Link className="font-semibold text-brand-700 dark:text-brand-100" to="/register">Create account</Link>
      </div>
    </form>
  );
}
