import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export default function ForgotPassword() {
  const { forgotPassword } = useAuth();
  const { showToast } = useToast();
  const [email, setEmail] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    await forgotPassword(email);
    showToast('Password reset email sent.');
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto w-[calc(100vw-2rem)] rounded-lg bg-white p-5 shadow-soft sm:w-full sm:max-w-md sm:p-6 dark:bg-slate-900">
      <h1 className="text-2xl font-black">Reset password</h1>
      <input className="focus-ring mt-6 w-full rounded-lg border border-slate-200 px-3 py-3 dark:border-slate-700 dark:bg-slate-950" type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} required />
      <button className="focus-ring mt-6 w-full rounded-lg bg-brand-600 px-4 py-3 font-semibold text-white hover:bg-brand-700">Send reset link</button>
      <Link className="mt-4 inline-block text-sm font-semibold text-brand-700 dark:text-brand-100" to="/login">Back to login</Link>
    </form>
  );
}
