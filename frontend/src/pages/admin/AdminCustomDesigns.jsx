import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { fetchAdminCustomDesigns } from '../../services/adminService';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import CustomDesignStatusBadge from '../../components/custom-design/CustomDesignStatusBadge';
import CustomDesignManagePanel from '../../components/admin/CustomDesignManagePanel';

const STATUS_FILTERS = [
  '', 'pending', 'under_review', 'quotation_sent', 'awaiting_customer_approval',
  'awaiting_payment', 'approved', 'in_progress', 'revision_requested', 'completed', 'rejected', 'cancelled',
];

export default function AdminCustomDesigns() {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [selected, setSelected] = useState(null);

  const load = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const { requests: results, pagination: pageInfo } = await fetchAdminCustomDesigns({ page, status: statusFilter || undefined });
      setRequests(results);
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
          <h1 className="font-display text-2xl font-semibold text-ink">Custom Design Requests</h1>
          <p className="mt-1 text-sm text-ink/60">Review requirements, send quotations, and deliver finished designs.</p>
        </div>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input-field w-auto">
          {STATUS_FILTERS.map((s) => <option key={s} value={s}>{s ? s.replace(/_/g, ' ') : 'All statuses'}</option>)}
        </select>
      </div>

      <div className="mt-6">
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorState message={error} onRetry={() => load()} />
        ) : requests.length === 0 ? (
          <EmptyState title="No custom design requests found" showCustomCta={false} />
        ) : (
          <>
            <div className="card-surface overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-line text-xs text-ink/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Title</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {requests.map((r) => (
                    <tr key={r._id}>
                      <td className="px-4 py-3 text-ink">{r.user?.fullName || '—'}</td>
                      <td className="px-4 py-3 text-ink/60">{r.title}</td>
                      <td className="px-4 py-3 text-ink/60">{r.category?.name || '—'}</td>
                      <td className="px-4 py-3"><CustomDesignStatusBadge status={r.status} /></td>
                      <td className="px-4 py-3 text-ink/50">{new Date(r.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3 text-right">
                        <button onClick={() => setSelected(r)} className="inline-flex rounded-lg p-1.5 text-ink/50 hover:bg-brand-mist hover:text-brand">
                          <Eye size={15} />
                        </button>
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

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title={selected?.title || 'Custom Design Request'} maxWidth="max-w-xl">
        {selected && (
          <CustomDesignManagePanel
            request={selected}
            onUpdated={(updated) => {
              setSelected(updated);
              load(pagination.page);
            }}
          />
        )}
      </Modal>
    </div>
  );
}
