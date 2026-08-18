import { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppData } from '../context/AppDataContext';
import { getDashboardStatistics } from '../services/api';
import { LoadingSpinner } from '../components/Common/LoadingSpinner';
import { EmptyState } from '../components/Common/EmptyState';
import {
  IconProjects,
  IconTasks,
  IconClock,
  IconSparkles,
  IconCheck,
} from '../components/Common/Icons';
import {
  priorityClass,
  statusClass,
  formatDate,
  completedPercent,
} from '../utils/helpers';

export default function DashboardPage() {
  const { projects, tasks, loading } = useAppData();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      const data = await getDashboardStatistics();
      if (mounted) setStats(data);
    })();
    return () => {
      mounted = false;
    };
  }, [projects, tasks]);

  const recentTasks = useMemo(
    () =>
      [...tasks]
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt))
        .slice(0, 6),
    [tasks],
  );

  // Mock "recommended next task": first non-completed high/medium task.
  const recommendation = useMemo(() => {
    const sorted = [...tasks].sort((a, b) => {
      const order = { High: 0, Medium: 1, Low: 2 };
      return order[a.priority] - order[b.priority];
    });
    const next = sorted.find((t) => t.status !== 'Completed');
    if (!next) return null;
    const project = projects.find((p) => p.id === next.projectId);
    return { task: next, project };
  }, [tasks, projects]);

  if (loading) {
    return <LoadingSpinner label="Loading dashboard…" full />;
  }

  const cards = [
    { label: 'Total Projects', value: stats?.totalProjects ?? projects.length, icon: IconProjects, color: 'var(--color-primary)' },
    { label: 'Total Tasks', value: stats?.totalTasks ?? tasks.length, icon: IconTasks, color: 'var(--color-indigo)' },
    { label: 'Pending Tasks', value: stats?.pendingTasks ?? tasks.filter((t) => t.status === 'Pending').length, icon: IconClock, color: 'var(--color-pending)' },
    { label: 'In Progress', value: stats?.inProgressTasks ?? tasks.filter((t) => t.status === 'In Progress').length, icon: IconTasks, color: 'var(--color-inprogress)' },
    { label: 'Completed', value: stats?.completedTasks ?? tasks.filter((t) => t.status === 'Completed').length, icon: IconCheck, color: 'var(--color-completed)' },
  ];

  return (
    <div className="stack gap-2">
      <div className="page-grid">
        {cards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="stat-card card-hover">
            <div className="row between">
              <div>
                <div className="stat-label">{label}</div>
                <div className="stat-value">{value}</div>
              </div>
              <span className="stat-icon" style={{ background: `${color}1a`, color }}>
                <Icon size={20} />
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="two-col">
        <section className="card card-pad">
          <div className="row between mb-2">
            <h3 className="section-title">Project Progress</h3>
            <Link to="/projects" className="btn btn-ghost btn-sm">View all</Link>
          </div>
          {projects.length === 0 ? (
            <EmptyState title="No projects yet" message="Create your first project to see progress here." />
          ) : (
            <div className="stack gap-2">
              {projects.map((p) => {
                const pct = completedPercent(tasks, p.id);
                const total = tasks.filter((t) => t.projectId === p.id).length;
                return (
                  <div key={p.id} className="card card-pad card-hover">
                    <div className="row between wrap gap-1">
                      <div>
                        <Link to={`/projects/${p.id}`}><strong>{p.name}</strong></Link>
                        <div className="text-sm muted">{p.stack}</div>
                      </div>
                      <div className="text-sm muted">{total} tasks · {pct}% done</div>
                    </div>
                    <div className="progress mt-1">
                      <div className="progress-bar" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="card card-pad">
          <div className="row between mb-2">
            <h3 className="section-title">AI Recommended Next Task</h3>
            <span className="badge badge-ai"><IconSparkles size={14} /> AI</span>
          </div>
          {recommendation ? (
            <div className="stack gap-1">
              <div className="text-sm muted">Project</div>
              <strong>{recommendation.project?.name || '—'}</strong>
              <div className="text-sm muted mt-1">Recommended task</div>
              <div>{recommendation.task.title}</div>
              <div className="text-sm muted mt-1">Reason</div>
              <div className="text-sm">
                This is the highest-priority task that is not yet completed for this project.
              </div>
              <Link
                to="/ai-mentor"
                className="btn btn-sm mt-1"
                style={{ alignSelf: 'flex-start' }}
              >
                View Recommendation
              </Link>
            </div>
          ) : (
            <EmptyState title="All caught up" message="No pending tasks to recommend right now." />
          )}
        </section>
      </div>

      <section className="card card-pad">
        <div className="row between mb-2">
          <h3 className="section-title">Recent Tasks</h3>
          <Link to="/tasks" className="btn btn-ghost btn-sm">View all</Link>
        </div>
        {recentTasks.length === 0 ? (
          <EmptyState title="No tasks yet" />
        ) : (
          <div className="table-wrap">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Project</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Updated</th>
                </tr>
              </thead>
              <tbody>
                {recentTasks.map((t) => {
                  const project = projects.find((p) => p.id === t.projectId);
                  return (
                    <tr key={t.id}>
                      <td>{t.title}</td>
                      <td>{project?.name || '—'}</td>
                      <td><span className={`badge ${priorityClass(t.priority)}`}>{t.priority}</span></td>
                      <td><span className={`badge ${statusClass(t.status)}`}>{t.status}</span></td>
                      <td className="text-sm muted">{formatDate(t.updatedAt)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
