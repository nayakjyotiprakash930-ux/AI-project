import { NavLink } from 'react-router-dom';
import {
  IconDashboard,
  IconProjects,
  IconTasks,
  IconAI,
  IconHistory,
  IconClose,
} from '../Common/Icons';

const links = [
  { to: '/', label: 'Dashboard', icon: IconDashboard, end: true },
  { to: '/projects', label: 'Projects', icon: IconProjects, end: false },
  { to: '/tasks', label: 'Tasks', icon: IconTasks, end: false },
  { to: '/ai-mentor', label: 'AI Mentor', icon: IconAI, end: false },
  { to: '/ai-history', label: 'AI History', icon: IconHistory, end: false },
];

export function Sidebar({ open, onClose }) {
  return (
    <>
      {open && <div className="scrim" onClick={onClose} aria-hidden="true" />}
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-brand">
          <h2>
            <span className="stat-icon" style={{ background: 'var(--color-primary)', color: '#fff' }}>
              <IconAI size={18} />
            </span>
            AI Project Mentor
          </h2>
          <div className="brand-sub">Full-stack training app</div>
        </div>
        <nav aria-label="Main navigation">
          {links.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-foot">Frontend demo · mock data</div>
      </aside>
    </>
  );
}

export function SidebarCloseButton({ onClick }) {
  return (
    <button className="icon-btn" onClick={onClick} aria-label="Close menu" style={{ color: '#fff' }}>
      <IconClose />
    </button>
  );
}
