// Small inline SVG icon set so the app does not depend on an icon
// library. Each icon is a functional React component accepting a size.
const base = (size) => ({
  width: size ?? 18,
  height: size ?? 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
});

export const IconDashboard = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><rect x="3" y="3" width="7" height="9" /><rect x="14" y="3" width="7" height="5" /><rect x="14" y="12" width="7" height="9" /><rect x="3" y="16" width="7" height="5" /></svg>
);
export const IconProjects = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /></svg>
);
export const IconTasks = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M9 11l3 3L22 4" /><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" /></svg>
);
export const IconAI = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M12 2a3 3 0 0 1 3 3v1h1a3 3 0 0 1 3 3v1h1a3 3 0 0 1 3 3v0a3 3 0 0 1-3 3h-1v1a3 3 0 0 1-3 3h-1v1a3 3 0 0 1-3 3 3 3 0 0 1-3-3v-1H8a3 3 0 0 1-3-3v-1H4a3 3 0 0 1-3-3v0a3 3 0 0 1 3-3h1V9a3 3 0 0 1 3-3h1V5a3 3 0 0 1 3-3z" /><path d="M9 12h6M12 9v6" /></svg>
);
export const IconHistory = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M3 12a9 9 0 1 0 3-6.7L3 8" /><path d="M3 3v5h5" /><path d="M12 7v5l3 2" /></svg>
);
export const IconBell = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></svg>
);
export const IconMenu = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M3 6h18M3 12h18M3 18h18" /></svg>
);
export const IconClose = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M18 6 6 18M6 6l12 12" /></svg>
);
export const IconSearch = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>
);
export const IconPlus = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M12 5v14M5 12h14" /></svg>
);
export const IconEdit = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M12 20h9" /><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z" /></svg>
);
export const IconTrash = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /></svg>
);
export const IconView = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></svg>
);
export const IconCheck = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M20 6 9 17l-5-5" /></svg>
);
export const IconAlert = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z" /><path d="M12 9v4M12 17h.01" /></svg>
);
export const IconBack = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
);
export const IconSparkles = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M12 3l1.9 4.6L18.5 9.5 13.9 11.4 12 16l-1.9-4.6L5.5 9.5l4.6-1.9z" /><path d="M19 14l.8 2L22 16.8 20 17.6 19.2 20 18.4 17.6 16.4 16.8 18.4 16z" /></svg>
);
export const IconInbox = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><path d="M22 12h-6l-2 3h-4l-2-3H2" /><path d="M5.5 5h13l3.5 7v6a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-6z" /></svg>
);
export const IconClock = ({ size, ...p }) => (
  <svg {...base(size)} {...p}><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
);
