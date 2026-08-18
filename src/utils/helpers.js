// Helper functions shared across pages.

export function priorityClass(priority) {
  if (priority === 'High') return 'badge-priority-high';
  if (priority === 'Medium') return 'badge-priority-medium';
  return 'badge-priority-low';
}

export function statusClass(status) {
  if (status === 'In Progress') return 'badge-status-in-progress';
  if (status === 'Completed') return 'badge-status-completed';
  return 'badge-status-pending';
}

export function formatDate(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value;
  return d.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

// Compute the percentage of completed tasks for a project.
export function completedPercent(tasks, projectId) {
  const projectTasks = tasks.filter((t) => t.projectId === Number(projectId));
  if (projectTasks.length === 0) return 0;
  const done = projectTasks.filter((t) => t.status === 'Completed').length;
  return Math.round((done / projectTasks.length) * 100);
}
