import { useAppData } from '../../context/AppDataContext';
import { IconCheck, IconAlert, IconClose } from './Icons';

// Renders transient success/error toasts emitted via the shared context.
export function ToastHost() {
  const { toast } = useAppData();
  if (!toast) return null;
  const cls = toast.type === 'error' ? 'toast-error' : toast.type === 'info' ? 'toast-info' : 'toast-success';
  return (
    <div className="toast-wrap" aria-live="polite">
      <div className={`toast ${cls}`}>
        {toast.type === 'error' ? <IconAlert size={16} /> : <IconCheck size={16} />}
        <span>{toast.message}</span>
      </div>
    </div>
  );
}

export function ToastClose() {
  return <IconClose size={16} />;
}
