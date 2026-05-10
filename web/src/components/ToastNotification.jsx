import { IoCheckmarkCircle, IoClose, IoWarning } from 'react-icons/io5';
import { useToast } from '../context/ToastContext';

export default function ToastNotification() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed right-4 top-4 z-[60] flex w-[min(92vw,360px)] flex-col gap-3">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4 shadow-soft dark:border-slate-700 dark:bg-slate-900"
          role="status"
        >
          {toast.type === 'error' ? <IoWarning className="mt-1 text-red-500" /> : <IoCheckmarkCircle className="mt-1 text-brand-600" />}
          <p className="flex-1 text-sm font-medium text-slate-700 dark:text-slate-100">{toast.message}</p>
          <button onClick={() => removeToast(toast.id)} aria-label="Dismiss notification">
            <IoClose />
          </button>
        </div>
      ))}
    </div>
  );
}
