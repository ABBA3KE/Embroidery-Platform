import { useEffect, useState } from 'react';
import { fetchAdminPayments } from '../../services/adminService';
import { formatPrice } from '../../utils/format';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const load = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const { payments: results, pagination: pageInfo } = await fetchAdminPayments({ page, status: statusFilter || undefined });
      setPayments(results);
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
  }, [statusFilter]);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Payments</h1>
          <p className="mt-1 text-sm text-ink/60">All Paystack transaction attempts.</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="successful">Successful</option>
          <option value="failed">Failed</option>
          <option value="cancelled">Cancelled</option>
          <option value="refunded">Refunded</option>
        </select>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorState message={error} onRetry={() => load()} />
        ) : payments.length === 0 ? (
          <EmptyState title="No payments found" showCustomCta={false} />
        ) : (
          <>
            <div className="card-surface overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-line text-xs text-ink/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Reference</th>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Amount</th>
                    <th className="px-4 py-3 font-medium">Channel</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {payments.map((p) => (
                    <tr key={p._id}>
                      <td className="px-4 py-3 font-mono text-xs text-ink/60">{p.paystackReference}</td>
                      <td className="px-4 py-3 text-ink">{p.user?.fullName || '—'}</td>
                      <td className="px-4 py-3 text-ink/60">{formatPrice(p.amount)}</td>
                      <td className="px-4 py-3 text-ink/60">{p.channel || '—'}</td>
                      <td className="px-4 py-3"><StatusBadge status={p.status === 'successful' ? 'paid' : p.status} /></td>
                      <td className="px-4 py-3 text-ink/50">{new Date(p.createdAt).toLocaleDateString()}</td>
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
