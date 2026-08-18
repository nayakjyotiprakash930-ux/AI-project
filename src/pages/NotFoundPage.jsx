import { Link } from 'react-router-dom';
import { IconBack } from '../components/Common/Icons';

export default function NotFoundPage() {
  return (
    <div className="card card-pad center" style={{ flexDirection: 'column', gap: '1rem', padding: '3rem 1rem' }}>
      <div className="stat-value" style={{ fontSize: '3rem' }}>404</div>
      <h2>Page not found</h2>
      <p className="muted">The page you are looking for does not exist.</p>
      <Link to="/" className="btn"><IconBack size={16} /> Back to Dashboard</Link>
    </div>
  );
}
