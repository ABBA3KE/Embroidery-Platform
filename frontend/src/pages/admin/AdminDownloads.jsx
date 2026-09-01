import { useEffect, useState } from 'react';
import { fetchAdminDownloads } from '../../services/adminService';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';

export default function AdminDownloads() {
  const [downloads, setDownloads] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const load = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const { downloads: results, pagination: pageInfo } = await fetchAdminDownloads({ page });
      setDownloads(results);
      setPagination(pageInfo);
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
    <div>
      <h1 className="font-display text-2xl font-semibold text-ink">Downloads</h1>
      <p className="mt-1 text-sm text-ink/60">Audit log of every protected file download.</p>

      <div className="mt-6">
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorState message={error} onRetry={() => load()} />
        ) : downloads.length === 0 ? (
          <EmptyState title="No downloads yet" showCustomCta={false} />
        ) : (
          <>
            <div className="card-surface overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-line text-xs text-ink/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Design</th>
                    <th className="px-4 py-3 font-medium">Format</th>
                    <th className="px-4 py-3 font-medium">IP Address</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {downloads.map((d) => (
                    <tr key={d._id}>
                      <td className="px-4 py-3 text-ink">{d.user?.fullName || '—'}</td>
                      <td className="px-4 py-3 text-ink/60">{d.design?.name || '—'}</td>
                      <td className="px-4 py-3 text-ink/60">.{d.format}</td>
                      <td className="px-4 py-3 font-mono text-xs text-ink/50">{d.ipAddress || '—'}</td>
                      <td className="px-4 py-3 text-ink/50">{new Date(d.createdAt).toLocaleString()}</td>
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
