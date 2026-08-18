import { useMemo, useState } from 'react';
import { useAppData } from '../context/AppDataContext';
import * as api from '../services/api';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { EmptyState } from '../components/Common/EmptyState';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import TaskForm from '../components/Tasks/TaskForm';
import {
  IconEdit,
  IconPlus,
  IconTrash,
} from '../components/Common/Icons';
import { formatDate, priorityClass, statusClass } from '../utils/helpers';

export default function TasksPage() {
  const { projects, tasks, loading, refreshTasks, showToast } = useAppData();
  const [query, setQuery] = useState('');
  const [fProject, setFProject] = useState('');
  const [fPriority, setFPriority] = useState('');
  const [fStatus, setFStatus] = useState('');
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [statusFor, setStatusFor] = useState(null);
  const [toDelete, setToDelete] = useState(null);
  const [saving, setSaving] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return tasks.filter((t) => {
      if (q && !t.title.toLowerCase().includes(q)) return false;
      if (fProject && t.projectId !== Number(fProject)) return false;
      if (fPriority && t.priority !== fPriority) return false;
      if (fStatus && t.status !== fStatus) return false;
      return true;
    });
  }, [tasks, query, fProject, fPriority, fStatus]);

  function openCreate() {
    setEditing(null);
    setFormOpen(true);
  }
  function openEdit(task) {
    setEditing(task);
    setFormOpen(true);
  }

  async function handleSubmit(taskData) {
    setSaving(true);
    try {
      if (editing) {
        await api.updateTask(editing.id, taskData);
        showToast('success', 'Task updated successfully.');
      } else {
        await api.createTask(taskData);
        showToast('success', 'Task created successfully.');
      }
      await refreshTasks();
      setFormOpen(false);
    } catch {
      showToast('error', 'Please check your input and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleStatusChange(taskId, status) {
    try {
      await api.updateTaskStatus(taskId, status);
      await refreshTasks();
      showToast('success', 'Task status updated successfully.');
      setStatusFor(null);
    } catch {
      showToast('error', 'Unable to update task status.');
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setSaving(true);
    try {
      await api.deleteTask(toDelete.id);
      await refreshTasks();
      showToast('success', 'Task deleted successfully.');
      setToDelete(null);
    } catch {
      showToast('error', 'Unable to delete task.');
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading tasks…" full />;

  return (
    <div className="stack gap-2">
      <div className="card card-pad stack gap-2">
        <div className="row between wrap gap-1">
          <input
            type="search"
            placeholder="Search task titles…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ maxWidth: 320 }}
            aria-label="Search tasks"
          />
          <button className="btn" onClick={openCreate}><IconPlus size={16} /> Add Task</button>
        </div>
        <div className="row gap-1 wrap">
          <select value={fProject} onChange={(e) => setFProject(e.target.value)} style={{ width: 'auto' }} aria-label="Filter by project">
            <option value="">All projects</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
          <select value={fPriority} onChange={(e) => setFPriority(e.target.value)} style={{ width: 'auto' }} aria-label="Filter by priority">
            <option value="">All priorities</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select value={fStatus} onChange={(e) => setFStatus(e.target.value)} style={{ width: 'auto' }} aria-label="Filter by status">
            <option value="">All statuses</option>
            <option>Pending</option>
            <option>In Progress</option>
            <option>Completed</option>
          </select>
          {(fProject || fPriority || fStatus || query) && (
            <button className="btn btn-ghost btn-sm" onClick={() => { setQuery(''); setFProject(''); setFPriority(''); setFStatus(''); }}>
              Clear filters
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No tasks found" message="Adjust your filters or add a new task." />
      ) : (
        <div className="table-wrap">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Status</th>
                <th>AI</th>
                <th>Updated</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((t) => {
                const project = projects.find((p) => p.id === t.projectId);
                return (
                  <tr key={t.id}>
                    <td className="muted">#{t.id}</td>
                    <td>
                      <strong>{t.title}</strong>
                      <div className="text-sm muted">{t.description}</div>
                    </td>
                    <td>{project?.name || '—'}</td>
                    <td><span className={`badge ${priorityClass(t.priority)}`}>{t.priority}</span></td>
                    <td>
                      {statusFor && statusFor.id === t.id ? (
                        <select
                          autoFocus
                          defaultValue={t.status}
                          onBlur={(e) => handleStatusChange(t.id, e.target.value)}
                          style={{ width: 'auto' }}
                        >
                          <option>Pending</option>
                          <option>In Progress</option>
                          <option>Completed</option>
                        </select>
                      ) : (
                        <button
                          className="btn btn-ghost btn-sm"
                          onClick={() => setStatusFor(t)}
                          title="Change status"
                        >
                          <span className={`badge ${statusClass(t.status)}`}>{t.status}</span>
                        </button>
                      )}
                    </td>
                    <td>{t.aiGenerated ? <span className="badge badge-ai">AI</span> : '—'}</td>
                    <td className="text-sm muted">{formatDate(t.updatedAt)}</td>
                    <td>
                      <div className="row gap-1">
                        <button className="btn btn-ghost btn-sm" onClick={() => openEdit(t)} aria-label="Edit task"><IconEdit size={14} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setToDelete(t)} aria-label="Delete task"><IconTrash size={14} /></button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <TaskForm
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        projects={projects}
        task={editing}
      />

      <ConfirmDialog
        open={!!toDelete}
        title="Delete task?"
        message={toDelete ? `Delete "${toDelete.title}"? This cannot be undone.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={saving}
      />
    </div>
  );
}
