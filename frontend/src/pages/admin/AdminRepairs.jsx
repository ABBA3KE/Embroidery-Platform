import { useEffect, useState } from 'react';
import { Eye } from 'lucide-react';
import { fetchAdminRepairs } from '../../services/adminService';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import Modal from '../../components/common/Modal';
import RepairManagePanel from '../../components/admin/RepairManagePanel';

const STATUS_FILTERS = ['', 'pending', 'under_review', 'accepted', 'rejected', 'in_progress', 'completed'];

export default function AdminRepairs() {
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
      const { requests: results, pagination: pageInfo } = await fetchAdminRepairs({ page, status: statusFilter || undefined });
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
          <h1 className="font-display text-2xl font-semibold text-ink">Repair Requests</h1>
          <p className="mt-1 text-sm text-ink/60">Review, respond to, and complete repair requests.</p>
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
          <EmptyState title="No repair requests found" showCustomCta={false} />
        ) : (
          <>
            <div className="card-surface overflow-x-auto">
              <table className="w-full min-w-[560px] text-left text-sm">
                <thead className="border-b border-line text-xs text-ink/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Customer</th>
                    <th className="px-4 py-3 font-medium">Service</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {requests.map((r) => (
                    <tr key={r._id}>
                      <td className="px-4 py-3 text-ink">{r.user?.fullName || '—'}</td>
                      <td className="px-4 py-3 capitalize text-ink/60">{r.serviceType.replace(/_/g, ' ')}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status === 'accepted' || r.status === 'under_review' || r.status === 'in_progress' ? 'pending' : r.status === 'completed' ? 'paid' : r.status} /></td>
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

      <Modal isOpen={!!selected} onClose={() => setSelected(null)} title="Repair Request" maxWidth="max-w-xl">
        {selected && (
          <RepairManagePanel
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
