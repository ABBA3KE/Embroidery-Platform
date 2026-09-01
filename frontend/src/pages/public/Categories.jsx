import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Layers } from 'lucide-react';
import { fetchCategories } from '../../services/categoryService';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      setCategories(await fetchCategories());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Categories</h1>
      <div className="stitch-rule mt-3 w-16" />
      <p className="mt-3 max-w-xl text-ink/60">Browse embroidery designs organized by category.</p>

      <div className="mt-8">
        {isLoading ? (
          <LoadingScreen label="Loading categories" />
        ) : error ? (
          <ErrorState message={error} onRetry={load} />
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <motion.div
                key={cat._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <Link
                  to={`/designs?category=${cat._id}`}
                  className="card-surface flex flex-col items-center gap-3 px-4 py-8 text-center transition-shadow hover:shadow-lift"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-mist text-brand">
                    <Layers size={20} />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-ink">{cat.name}</h3>
                    <p className="mt-0.5 text-xs text-ink/50">{cat.designCount} design{cat.designCount !== 1 ? 's' : ''}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
