import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

const titles = {
  '/': 'Dashboard',
  '/projects': 'Projects',
  '/tasks': 'Tasks',
  '/ai-mentor': 'AI Mentor',
  '/ai-history': 'AI History',
};

export function AppLayout({ children }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // Derive a page title from the current path, including detail pages.
  let title = titles[pathname] || 'AI Project Mentor';
  if (pathname.startsWith('/projects/') && pathname !== '/projects') {
    title = 'Project Details';
  }

  return (
    <div className="app-shell">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="main-area">
        <Header title={title} onMenuClick={() => setMenuOpen(true)} />
        <main className="content">{children}</main>
      </div>
    </div>
  );
}
