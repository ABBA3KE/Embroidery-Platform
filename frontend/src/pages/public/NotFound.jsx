import { Link } from 'react-router-dom';
import { ROUTES } from '../../constants/routes';

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center px-4 text-center">
      <span className="font-display text-6xl font-semibold text-brand">404</span>
      <h1 className="mt-3 font-display text-xl font-semibold text-ink">Page not found</h1>
      <p className="mt-2 text-sm text-ink/60">The page you're looking for doesn't exist or has moved.</p>
      <Link to={ROUTES.HOME} className="btn-primary mt-6">Back to home</Link>
    </div>
  );
}
