import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Eye } from 'lucide-react';
import { fetchAdminCustomers } from '../../services/adminService';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import ADMIN_ROUTES from '../../constants/adminRoutes';

export default function AdminCustomers() {
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebouncedValue(search, 400);
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const { customers: results, pagination: pageInfo } = await fetchAdminCustomers({ page, search: debouncedSearch });
      setCustomers(results);
      setPagination(pageInfo);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Customers</h1>
      <p className="mt-1 text-sm text-ink/60">Search and view customer profiles.</p>

      <div className="relative mt-5 max-w-sm">
        <Search size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink/40" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or email…" className="input-field pl-10" />
      </div>

      <div className="mt-6">
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorState message={error} onRetry={() => load()} />
        ) : customers.length === 0 ? (
          <EmptyState title="No customers found" showCustomCta={false} />
        ) : (
          <>
            <div className="card-surface overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-line text-xs text-ink/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {customers.map((c) => (
                    <tr key={c._id}>
                      <td className="px-4 py-3 font-medium text-ink">{c.fullName}</td>
                      <td className="px-4 py-3 text-ink/60">{c.email}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${c.status === 'active' ? 'bg-brand-mist text-brand' : 'bg-red-50 text-red-600'}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink/60">{new Date(c.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <Link to={`${ADMIN_ROUTES.CUSTOMERS}/${c._id}`} className="inline-flex rounded-lg p-1.5 text-ink/50 hover:bg-brand-mist hover:text-brand">
                          <Eye size={15} />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(p) => load(p)} />
          </>
        )}
      </div>
    </div>
  );
}
