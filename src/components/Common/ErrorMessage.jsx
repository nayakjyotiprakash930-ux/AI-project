import { IconAlert, IconClose } from './Icons';

export function ErrorMessage({ message, onDismiss, title = 'Something went wrong' }) {
  return (
    <div
      role="alert"
      className="card"
      style={{ borderColor: 'var(--color-error)', background: 'var(--color-error-soft)' }}
    >
      <div className="card-pad row gap-1 between">
        <div className="row gap-1">
          <IconAlert style={{ color: 'var(--color-error)' }} />
          <div>
            <strong style={{ color: 'var(--color-error)' }}>{title}</strong>
            <div className="text-sm" style={{ color: 'var(--color-error)' }}>{message}</div>
          </div>
        </div>
        {onDismiss && (
          <button className="icon-btn" onClick={onDismiss} aria-label="Dismiss error">
            <IconClose />
          </button>
        )}
      </div>
    </div>
  );
}
