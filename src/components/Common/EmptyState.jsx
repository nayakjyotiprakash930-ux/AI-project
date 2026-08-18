import { IconInbox } from './Icons';

export function EmptyState({ title = 'Nothing here yet', message, action }) {
  return (
    <div className="empty-state card">
      <IconInbox size={36} />
      <h3 style={{ marginBottom: '0.25rem' }}>{title}</h3>
      {message && <p className="muted">{message}</p>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
