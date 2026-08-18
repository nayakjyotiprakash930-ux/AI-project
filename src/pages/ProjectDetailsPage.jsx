import { useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import * as api from '../services/api';
import { Modal } from '../components/Common/Modal';
import { ConfirmDialog } from '../components/Common/ConfirmDialog';
import { EmptyState } from '../components/Common/EmptyState';
import {
  IconBack,
  IconEdit,
  IconPlus,
  IconTrash,
  IconSparkles,
  IconView,
} from '../components/Common/Icons';
import { completedPercent, formatDate, priorityClass, statusClass } from '../utils/helpers';
import TaskForm from '../components/Tasks/TaskForm';

export default function ProjectDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, tasks, refreshProjects, refreshTasks, showToast } = useAppData();

  const project = useMemo(
    () => projects.find((p) => p.id === Number(id)),
    [projects, id],
  );

  const projectTasks = useMemo(
    () => tasks.filter((t) => t.projectId === Number(id)),
    [tasks, id],
  );

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', stack: '' });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  if (!project) {
    return (
      <EmptyState
        title="Project could not be found"
        message="It may have been deleted."
        action={<Link to="/projects" className="btn"><IconBack size={16} /> Back to Projects</Link>}
      />
    );
  }

  const pct = completedPercent(tasks, project.id);
  const done = projectTasks.filter((t) => t.status === 'Completed').length;

  function openEdit() {
    setForm({ name: project.name, description: project.description, stack: project.stack });
    setErrors({});
    setEditOpen(true);
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
      await api.updateProject(project.id, {
        name: form.name.trim(),
        description: form.description.trim(),
        stack: form.stack.trim(),
      });
      await refreshProjects();
      showToast('success', 'Project updated successfully.');
      setEditOpen(false);
    } catch {
      showToast('error', 'Please check your input and try again.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    setDeleting(true);
    try {
      await api.deleteProject(project.id);
      await refreshProjects();
      await refreshTasks();
      showToast('success', 'Project deleted successfully.');
      navigate('/projects');
    } catch {
      showToast('error', 'Unable to delete the project.');
    } finally {
      setDeleting(false);
    }
  }

  async function handleCreateTask(taskData) {
    await api.createTask({ ...taskData, projectId: Number(id) });
    await refreshTasks();
    showToast('success', 'Task created successfully.');
    setTaskModalOpen(false);
  }

  async function handleDeleteTask(taskId) {
    await api.deleteTask(taskId);
    await refreshTasks();
    showToast('success', 'Task deleted successfully.');
    setToDelete(null);
  }

  return (
    <div className="stack gap-2">
      <div className="row between wrap gap-1">
        <Link to="/projects" className="btn btn-secondary btn-sm">
          <IconBack size={14} /> Return to Projects
        </Link>
        <div className="row gap-1 wrap">
          <Link to="/ai-mentor" state={{ projectId: project.id }} className="btn btn-secondary btn-sm">
            <IconSparkles size={14} /> Ask AI Mentor
          </Link>
          <button className="btn btn-secondary btn-sm" onClick={openEdit}>
            <IconEdit size={14} /> Edit Project
          </button>
          <button className="btn btn-danger btn-sm" onClick={() => setToDelete(project)}>
            <IconTrash size={14} /> Delete Project
          </button>
        </div>
      </div>

      <section className="card card-pad stack gap-1">
        <div className="row between wrap">
          <div>
            <span className="badge badge-soft">#{project.id}</span>
            <h2 style={{ marginTop: '0.4rem' }}>{project.name}</h2>
          </div>
          <span className="text-sm muted">Created {formatDate(project.createdAt)}</span>
        </div>
        <p className="muted">{project.description}</p>
        <div><strong>Technology Stack:</strong> {project.stack}</div>
        <div className="row gap-3 wrap mt-1">
          <div><strong>Total Tasks:</strong> {projectTasks.length}</div>
          <div><strong>Completed:</strong> {done}</div>
          <div><strong>Progress:</strong> {pct}%</div>
        </div>
        <div className="progress">
          <div className="progress-bar" style={{ width: `${pct}%` }} />
        </div>
      </section>

      <section className="card card-pad">
        <div className="row between mb-2">
          <h3 className="section-title">Tasks</h3>
          <button className="btn btn-sm" onClick={() => setTaskModalOpen(true)}>
            <IconPlus size={14} /> Add Task
          </button>
        </div>
        {projectTasks.length === 0 ? (
          <EmptyState title="No tasks yet" message="Add a task or ask the AI Mentor to break down a requirement." />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>AI</th>
                  <th>Updated</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projectTasks.map((t) => (
                  <tr key={t.id}>
                    <td>
                      <strong>{t.title}</strong>
                      <div className="text-sm muted">{t.description}</div>
                    </td>
                    <td><span className={`badge ${priorityClass(t.priority)}`}>{t.priority}</span></td>
                    <td><span className={`badge ${statusClass(t.status)}`}>{t.status}</span></td>
                    <td>{t.aiGenerated ? <span className="badge badge-ai">AI</span> : '—'}</td>
                    <td className="text-sm muted">{formatDate(t.updatedAt)}</td>
                    <td>
                      <Link to="/tasks" className="btn btn-ghost btn-sm"><IconView size={14} /></Link>
                      <button className="btn btn-ghost btn-sm" onClick={() => setToDelete(t)} aria-label="Delete task">
                        <IconTrash size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        open={editOpen}
        title="Edit Project"
        onClose={() => setEditOpen(false)}
        footer={
          <>
            <button className="btn btn-secondary" onClick={() => setEditOpen(false)} disabled={saving}>Cancel</button>
            <button className="btn" onClick={handleSave} disabled={saving}>
              {saving && <span className="spinner" />} Save Changes
            </button>
          </>
        }
      >
        <div className="form-grid">
          <div>
            <label htmlFor="pd-name">Project Name</label>
            <input id="pd-name" value={form.name} className={errors.name ? 'field-invalid' : ''} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>
          <div>
            <label htmlFor="pd-stack">Technology Stack</label>
            <input id="pd-stack" value={form.stack} className={errors.stack ? 'field-invalid' : ''} onChange={(e) => setForm({ ...form, stack: e.target.value })} />
            {errors.stack && <div className="field-error">{errors.stack}</div>}
          </div>
          <div>
            <label htmlFor="pd-desc">Project Description</label>
            <textarea id="pd-desc" value={form.description} className={errors.description ? 'field-invalid' : ''} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            {errors.description && <div className="field-error">{errors.description}</div>}
          </div>
        </div>
      </Modal>

      <TaskForm
        open={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        onSubmit={handleCreateTask}
        fixedProjectId={Number(id)}
        projects={projects}
      />

      <ConfirmDialog
        open={!!toDelete}
        title={toDelete && !toDelete.stack ? 'Delete task?' : 'Delete project?'}
        message={toDelete ? (toDelete.stack ? `This will permanently delete "${toDelete.name}" and all of its tasks.` : `Delete "${toDelete.title}"?`) : ''}
        onConfirm={() => (toDelete && toDelete.stack ? handleDelete() : handleDeleteTask(toDelete?.id))}
        onCancel={() => setToDelete(null)}
        loading={deleting}
      />
    </div>
  );
}
