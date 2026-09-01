import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../../utils/format';

export default function DesignCard({ design }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="card-surface group overflow-hidden"
    >
      <Link to={`/designs/${design.slug}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-brand-mist">
          <img
            src={design.previewImage}
            alt={design.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/assets/images/designs/kulu.png';
            }}
          />
          
          {design.category?.name && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-brand shadow-sm">
              {design.category.name}
            </span>
          )}
        </div>
      </Link>

      <div className="p-4">
        <Link to={`/designs/${design.slug}`}>
          <h3 className="line-clamp-1 font-display text-base font-semibold text-ink group-hover:text-brand">
            {design.name}
          </h3>
        </Link>

        {design.availableFormats?.length > 0 && (
          <p className="mt-1 text-xs text-ink/50">{design.availableFormats.join(' · ')}</p>
        )}

        <div className="mt-3 flex items-center justify-between">
          <span className="font-display text-lg font-semibold text-brand">{formatPrice(design.price)}</span>
          <div className="flex items-center gap-2">
            <Link
              to={`/designs/${design.slug}`}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-line text-ink/60 transition-colors hover:border-brand/30 hover:text-brand"
              aria-label="View details"
            >
              <Eye size={16} />
            </Link>
            <Link
              to={`/designs/${design.slug}`}
              className="flex h-9 items-center gap-1.5 rounded-lg bg-brand px-3 text-sm font-medium text-white transition-colors hover:bg-brand-forest"
            >
              <ShoppingCart size={14} />
              Buy
            </Link>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
