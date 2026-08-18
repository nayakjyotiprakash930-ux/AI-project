export function LoadingSpinner({ label, full = false }) {
  const body = (
    <div className={`row gap-1 ${full ? 'center' : ''}`} style={{ padding: full ? '2rem' : '0.25rem' }}>
      <span className="spinner" aria-hidden="true" />
      {label && <span className="muted text-sm">{label}</span>}
    </div>
  );
  return full ? <div className="card card-pad">{body}</div> : body;
}
