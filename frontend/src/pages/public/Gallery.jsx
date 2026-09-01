import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { fetchDesigns } from '../../services/designService';
import { fetchCategories } from '../../services/categoryService';
import DesignFilters from '../../components/design/DesignFilters';
import DesignCard from '../../components/design/DesignCard';
import Pagination from '../../components/common/Pagination';
import EmptyState from '../../components/common/EmptyState';
import ErrorState from '../../components/common/ErrorState';
import LoadingScreen from '../../components/common/LoadingScreen';
import useDebouncedValue from '../../hooks/useDebouncedValue';

const DEFAULT_FILTERS = { search: '', category: '', minPrice: '', maxPrice: '', sort: 'newest', page: 1 };

export default function Gallery() {
  const [searchParams] = useSearchParams();
  const [filters, setFilters] = useState({
    ...DEFAULT_FILTERS,
    category: searchParams.get('category') || '',
  });
  const debouncedSearch = useDebouncedValue(filters.search, 400);

  const [categories, setCategories] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const loadDesigns = async () => {
    setIsLoading(true);
    setError('');
    try {
      const { designs: results, pagination: pageInfo } = await fetchDesigns({
        ...filters,
        search: debouncedSearch,
      });
      setDesigns(results);
      setPagination(pageInfo);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDesigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, filters.category, filters.minPrice, filters.maxPrice, filters.sort, filters.page]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-semibold text-ink">Design Gallery</h1>
        <div className="stitch-rule mt-3 w-16" />
        <p className="mt-3 max-w-xl text-ink/60">
          Browse ready-to-stitch embroidery designs. Every purchase includes verified, protected downloads.
        </p>
      </motion.div>

      <div className="mt-8">
        <DesignFilters filters={filters} categories={categories} onChange={setFilters} />
      </div>

      <div className="mt-8">
        {isLoading ? (
          <LoadingScreen label="Loading designs" />
        ) : error ? (
          <ErrorState message={error} onRetry={loadDesigns} />
        ) : designs.length === 0 ? (
          <EmptyState />
        ) : (
          <>
            <p className="mb-4 text-sm text-ink/50">{pagination.total} design{pagination.total !== 1 ? 's' : ''} found</p>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {designs.map((design) => (
                <DesignCard key={design._id} design={design} />
              ))}
            </div>
            <Pagination
              page={pagination.page}
              totalPages={pagination.totalPages}
              onChange={(p) => setFilters((f) => ({ ...f, page: p }))}
            />
          </>
        )}
      </div>
    </div>
  );
}
