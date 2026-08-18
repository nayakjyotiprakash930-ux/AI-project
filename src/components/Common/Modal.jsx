import { useEffect } from 'react';
import { IconClose } from './Icons';

// Generic modal wrapper used by project/task forms and AI history viewer.
export function Modal({ open, title, onClose, children, footer, size = 'md' }) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={`modal ${size === 'lg' ? 'modal-lg' : ''}`}>
        <div className="row between mb-2">
          <h3 id="modal-title" style={{ margin: 0 }}>{title}</h3>
          <button className="icon-btn" onClick={onClose} aria-label="Close dialog">
            <IconClose />
          </button>
        </div>
        <div>{children}</div>
        {footer && <div className="row gap-1 between mt-3">{footer}</div>}
      </div>
    </div>
  );
}
