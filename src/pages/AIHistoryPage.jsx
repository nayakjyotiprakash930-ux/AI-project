import { useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import * as api from '../services/api';
import { Modal } from '../components/Common/Modal';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { EmptyState } from '../components/Common/EmptyState';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { AIResponseView } from '../components/AI/AIResponseView';
import { taskTypes } from '../data/mockData';
import { IconView, IconTrash } from '../components/Common/Icons';
import { formatDate } from '../utils/helpers';

export default function AIHistoryPage() {
  const { projects, interactions, loading, refreshInteractions, showToast } = useAppData();
  const [fProject, setFProject] = useState('');
  const [fType, setFType] = useState('');
  const [fDate, setFDate] = useState('');
  const [viewing, setViewing] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    return interactions.filter((i) => {
      if (fProject && i.projectId !== Number(fProject)) return false;
      if (fType && i.taskType !== fType) return false;
      if (fDate && i.createdAt !== fDate) return false;
      return true;
    });
  }, [interactions, fProject, fType, fDate]);

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.deleteAIHistory(toDelete.id);
      await refreshInteractions();
      showToast('success', 'History entry deleted successfully.');
      setToDelete(null);
    } catch {
      showToast('error', 'Unable to delete history entry.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading AI history…" full />;

  return (
    <div className="stack gap-2">
      <div className="card card-pad row gap-1 wrap">
        <select value={fProject} onChange={(e) => setFProject(e.target.value)} style={{ width: 'auto' }} aria-label="Filter by project">
          <option value="">All projects</option>
          {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <select value={fType} onChange={(e) => setFType(e.target.value)} style={{ width: 'auto' }} aria-label="Filter by AI task type">
          <option value="">All task types</option>
          {taskTypes.map((t) => <option key={t}>{t}</option>)}
        </select>
        <input type="date" value={fDate} onChange={(e) => setFDate(e.target.value)} style={{ width: 'auto' }} aria-label="Filter by date" />
        {(fProject || fType || fDate) && (
          <button className="btn btn-ghost btn-sm" onClick={() => { setFProject(''); setFType(''); setFDate(''); }}>
            Clear filters
          </button>
        )}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No AI interactions" message="Use the AI Mentor page to generate recommendations." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>Prompt</th>
                <th>Response Preview</th>
                <th>Task Type</th>
                <th>Model</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((i) => {
                const project = projects.find((p) => p.id === i.projectId);
                return (
                  <tr key={i.id}>
                    <td className="muted">#{i.id}</td>
                    <td>{project?.name || '—'}</td>
                    <td style={{ maxWidth: 220 }}>{i.prompt}</td>
                    <td className="text-sm muted" style={{ maxWidth: 280 }}>
                      {i.response.slice(0, 90)}…
                    </td>
                    <td><span className="badge badge-soft">{i.taskType}</span></td>
                    <td className="text-sm">{i.modelName}</td>
                    <td className="text-sm muted">{formatDate(i.createdAt)}</td>
                    <td>
                      <div className="row gap-1">
                        <button className="btn btn-ghost btn-sm" onClick={() => setViewing(i)} aria-label="View response"><IconView size={14} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setToDelete(i)} aria-label="Delete history"><IconTrash size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        open={!!viewing}
        title="AI Interaction"
        onClose={() => setViewing(null)}
        size="lg"
      >
        {viewing && (
          <div className="stack gap-2">
            <div className="text-sm muted">
              {projects.find((p) => p.id === viewing.projectId)?.name} · {viewing.taskType} · {viewing.modelName} · {formatDate(viewing.createdAt)}
            </div>
            <div className="card card-pad">
              <strong>Prompt</strong>
              <p className="muted">{viewing.prompt}</p>
            </div>
            <AIResponseView response={viewing.response} />
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete history entry?"
        message={toDelete ? 'This interaction will be permanently removed from AI History.' : ''}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
