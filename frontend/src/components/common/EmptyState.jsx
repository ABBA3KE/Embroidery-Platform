import { Link } from 'react-router-dom';
import { PackageSearch } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

export default function EmptyState({
  title = "No designs found",
  description = "Try adjusting your search or filters.",
  showCustomCta = true,
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-line bg-brand-haze/50 px-6 py-16 text-center">
      <PackageSearch size={32} className="text-brand/40" />
      <h3 className="mt-4 font-display text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink/60">{description}</p>
      {showCustomCta && (
        <Link to={ROUTES.CUSTOM_DESIGN} className="btn-primary mt-5">
          Request a Custom Design
        </Link>
      )}
    </div>
  );
}
