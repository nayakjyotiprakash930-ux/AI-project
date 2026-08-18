import { useEffect, useState } from 'react';
import { Modal } from '../Common/Modal';

const emptyTask = {
  projectId: '',
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  aiGenerated: false,
};

// Reusable Add/Edit Task form rendered inside a modal.
// When `task` is provided it edits; otherwise it creates.
export default function TaskForm({ open, onClose, onSubmit, projects, task, fixedProjectId }) {
  const [form, setForm] = useState(emptyTask);
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    if (task) {
      setForm({ ...task });
    } else if (fixedProjectId) {
      setForm({ ...emptyTask, projectId: fixedProjectId });
    } else {
      setForm({ ...emptyTask, projectId: projects[0]?.id || '' });
    }
    setErrors({});
  }, [open, task, fixedProjectId, projects]);

  function validate() {
    const next = {};
    if (!form.projectId) next.projectId = 'Please select a project.';
    if (!form.title.trim()) next.title = 'Task title is required.';
    if (!form.description.trim()) next.description = 'Task description is required.';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSaving(true);
    try {
      await onSubmit({
        projectId: Number(form.projectId),
        title: form.title.trim(),
        description: form.description.trim(),
        priority: form.priority,
        status: form.status,
        aiGenerated: form.aiGenerated,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal
      open={open}
      title={task ? 'Edit Task' : 'Add Task'}
      onClose={onClose}
      footer={
        <>
          <button className="btn btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
          <button className="btn" onClick={handleSubmit} disabled={saving}>
            {saving && <span className="spinner" />} {task ? 'Save Changes' : 'Add Task'}
          </button>
        </>
      }
    >
      <div className="form-grid">
        <div>
          <label htmlFor="task-project">Select Project</label>
          <select
            id="task-project"
            value={form.projectId}
            className={errors.projectId ? 'field-invalid' : ''}
            onChange={(e) => setForm({ ...form, projectId: e.target.value })}
            disabled={!!fixedProjectId}
          >
            <option value="">— Choose a project —</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          {errors.projectId && <div className="field-error">{errors.projectId}</div>}
        </div>
        <div>
          <label htmlFor="task-title">Task Title</label>
          <input
            id="task-title"
            value={form.title}
            className={errors.title ? 'field-invalid' : ''}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          {errors.title && <div className="field-error">{errors.title}</div>}
        </div>
        <div>
          <label htmlFor="task-desc">Task Description</label>
          <textarea
            id="task-desc"
            value={form.description}
            className={errors.description ? 'field-invalid' : ''}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          {errors.description && <div className="field-error">{errors.description}</div>}
        </div>
        <div className="form-row">
          <div>
            <label htmlFor="task-priority">Priority</label>
            <select id="task-priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>
          <div>
            <label htmlFor="task-status">Status</label>
            <select id="task-status" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option>Pending</option>
              <option>In Progress</option>
              <option>Completed</option>
            </select>
          </div>
        </div>
        <label className="row gap-1" style={{ fontWeight: 400 }}>
          <input
            type="checkbox"
            checked={form.aiGenerated}
            onChange={(e) => setForm({ ...form, aiGenerated: e.target.checked })}
            style={{ width: 'auto' }}
          />
          AI Generated task
        </label>
      </div>
    </Modal>
  );
}
