import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import * as api from '../services/api';
import { Modal } from '../components/Common/Modal';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { EmptyState } from '../components/Common/EmptyState';
import {
  IconPlus,
  IconView,
  IconEdit,
  IconTrash,
} from '../components/Common/Icons';
import { completedPercent, formatDate } from '../utils/helpers';

const emptyForm = { name: '', description: '', stack: '' };

export default function ProjectsPage() {
  const { projects, tasks, loading, refreshProjects, showToast } = useAppData();
  const [query, setQuery] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return projects;
    return projects.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.stack.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }, [projects, query]);

  function openCreate() {
    setEditing(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  }

  function openEdit(project) {
    setEditing(project);
    setForm({ name: project.name, description: project.description, stack: project.stack });
    setErrors({});
    setModalOpen(true);
  }

  function validate() {
    const next = {};
    if (!form.name.trim()) next.name = 'Project name is required.';
    if (!form.description.trim()) next.description = 'Description is required.';
    if (!form.stack.trim()) next.stack = 'Technology stack is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSave() {
    if (!validate()) return;
    setSaving(true);
    try {
      const payload = {
        name: form.name.trim(),
        description: form.description.trim(),
        stack: form.stack.trim(),
      };
      if (editing) {
        await api.updateProject(editing.id, payload);
        showToast('success', 'Project updated successfully.');
      } else {
        await api.createProject(payload);
        showToast('success', 'Project created successfully.');
      }
      await refreshProjects();
      setModalOpen(false);
    } catch {
      showToast('error', 'Please check your input and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!toDelete) return;
    setDeleting(true);
    try {
      await api.deleteProject(toDelete.id);
      await refreshProjects();
      showToast('success', 'Project deleted successfully.');
      setToDelete(null);
    } catch {
      showToast('error', 'Unable to delete the project.');
    } finally {
      setDeleting(false);
    }
  }

  if (loading) return <LoadingSpinner label="Loading projects…" full />;

  return (
    <div className="stack gap-2">
      <div className="row between wrap gap-1">
        <input
          type="search"
          placeholder="Search projects by name, stack or description"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{ maxWidth: 420 }}
          aria-label="Search projects"
        />
        <button className="btn" onClick={openCreate}>
          <IconPlus size={16} /> Create Project
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No projects found"
          message={query ? 'Try a different search term.' : 'Create your first project to get started.'}
          action={<button className="btn" onClick={openCreate}><IconPlus size={16} /> Create Project</button>}
        />
      ) : (
        <div className="page-grid" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))' }}>
          {filtered.map((p) => {
            const total = tasks.filter((t) => t.projectId === p.id).length;
            const done = tasks.filter((t) => t.projectId === p.id && t.status === 'Completed').length;
            const pct = completedPercent(tasks, p.id);
            return (
              <div key={p.id} className="card card-pad card-hover stack gap-1">
                <div className="row between">
                  <span className="badge badge-soft">#{p.id}</span>
                  <span className="text-sm muted">{formatDate(p.createdAt)}</span>
                </div>
                <h3 style={{ margin: 0 }}>{p.name}</h3>
                <p className="text-sm muted" style={{ margin: 0 }}>{p.description}</p>
                <div className="text-sm"><strong>Stack:</strong> {p.stack}</div>
                <div className="text-sm muted">{done} of {total} tasks completed</div>
                <div className="progress">
                  <div className="progress-bar" style={{ width: `${pct}%` }} />
                </div>
                <div className="row gap-1 wrap mt-1">
                  <Link to={`/projects/${p.id}`} className="btn btn-secondary btn-sm">
                    <IconView size={14} /> View
                  </Link>
                  <button className="btn btn-secondary btn-sm" onClick={() => openEdit(p)}>
                    <IconEdit size={14} /> Edit
                  </button>
                  <button className="btn btn-danger btn-sm" onClick={() => setToDelete(p)}>
                    <IconTrash size={14} /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal
        open={modalOpen}
        title={editing ? 'Edit Project' : 'Create Project'}
        onClose={() => setModalOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setModalOpen(false)} disabled={saving}>
              Cancel
            </button>
            <button className="btn" onClick={handleSave} disabled={saving}>
              {saving && <span className="spinner" />}
              {editing ? 'Save Changes' : 'Save Project'}
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div>
            <label htmlFor="project-name">Project Name</label>
            <input
              id="project-name"
              value={form.name}
              className={errors.name ? 'field-invalid' : ''}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          <div>
            <label htmlFor="project-stack">Technology Stack</label>
            <input
              id="project-stack"
              value={form.stack}
              className={errors.stack ? 'field-invalid' : ''}
              onChange={(e) => setForm({ ...form, stack: e.target.value })}
              placeholder="e.g. React, FastAPI, SQL Server"
            />
            {errors.stack && <div className="field-error">{errors.stack}</div>}
          </div>
          <div>
            <label htmlFor="project-description">Project Description</label>
            <textarea
              id="project-description"
              value={form.description}
              className={errors.description ? 'field-invalid' : ''}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            {errors.description && <div className="field-error">{errors.description}</div>}
          </div>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!toDelete}
        title="Delete project?"
        message={toDelete ? `This will permanently delete "${toDelete.name}" and all of its tasks.` : ''}
        onConfirm={handleDelete}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
