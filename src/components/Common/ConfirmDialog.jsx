import { IconAlert } from './Icons';

// Reusable confirmation dialog used before destructive actions
// (delete project, delete task, delete history item).
export function ConfirmDialog({
  open,
  title = 'Are you sure?',
  message,
  confirmLabel = 'Delete',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="confirm-title">
      <div className="modal" style={{ maxWidth: 440 }}>
        <div className="row gap-1 mb-2">
          <span
            className="stat-icon"
            style={{ background: 'var(--color-error-soft)', color: 'var(--color-error)' }}
          >
            <IconAlert />
          </span>
          <h3 id="confirm-title" style={{ margin: 0 }}>{title}</h3>
        </div>
        <p className="muted">{message}</p>
        <div className="row gap-1 between mt-3">
          <button className="btn btn-secondary" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </button>
          <button className="btn btn-danger" onClick={onConfirm} disabled={loading}>
            {loading ? <span className="spinner" /> : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
