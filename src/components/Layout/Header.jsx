import { IconBell, IconMenu, IconSearch } from '../Common/Icons';

// Top header: mobile menu button, page title, search, notifications, avatar.
export function Header({ title, onMenuClick }) {
  return (
    <header className="topbar">
      <button className="icon-btn menu-btn" onClick={onMenuClick} aria-label="Open navigation menu">
        <IconMenu />
      </button>
      <h1 className="page-title">{title}</h1>
      <div className="grow" />
      <div className="search">
        <span className="search-icon"><IconSearch size={16} /></span>
        <input type="search" placeholder="Search projects, tasks…" aria-label="Search" />
      </div>
      <button className="icon-btn" aria-label="Notifications">
        <IconBell />
      </button>
      <span className="avatar" title="Student user" aria-label="User profile">ST</span>
    </header>
  );
}
