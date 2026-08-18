import { IconCheck, IconClose } from './Icons';

export function SuccessMessage({ message, onDismiss }) {
  return (
    <div
      role="status"
      className="card"
      style={{ borderColor: 'var(--color-success)', background: 'var(--color-success-soft)' }}
    >
      <div className="card-pad row gap-1 between">
        <div className="row gap-1">
          <IconCheck style={{ color: 'var(--color-success)' }} />
          <strong className="text-sm" style={{ color: 'var(--color-success)' }}>{message}</strong>
        </div>
        {onDismiss && (
          <button className="icon-btn" onClick={onDismiss} aria-label="Dismiss message">
            <IconClose />
          </button>
        )}
      </div>
    </div>
  );
}
