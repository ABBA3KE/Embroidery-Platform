import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Ban, CheckCircle2 } from 'lucide-react';
import { fetchAdminCustomerDetail, updateCustomerStatus } from '../../services/adminService';
import { formatPrice } from '../../utils/format';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import StatusBadge from '../../components/common/StatusBadge';
import ADMIN_ROUTES from '../../constants/adminRoutes';

export default function AdminCustomerDetail() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      setData(await fetchAdminCustomerDetail(id));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleToggleStatus = async () => {
    setIsUpdating(true);
    try {
      await updateCustomerStatus(id, data.customer.status === 'active' ? 'suspended' : 'active');
      load();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading) return <LoadingScreen />;
  if (error) return <ErrorState message={error} onRetry={load} />;
  if (!data) return null;

  const { customer, orders, repairs, customRequests, downloads } = data;

  return (
    <div>
      <Link to={ADMIN_ROUTES.CUSTOMERS} className="flex items-center gap-1.5 text-sm text-ink/50 hover:text-brand">
        <ArrowLeft size={15} /> Back to customers
      </Link>

      <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">{customer.fullName}</h1>
          <p className="mt-1 text-sm text-ink/60">{customer.email} · {customer.phone}</p>
        </div>
        <button onClick={handleToggleStatus} disabled={isUpdating} className={customer.status === 'active' ? 'btn-secondary text-sm' : 'btn-primary text-sm'}>
          {customer.status === 'active' ? <><Ban size={14} /> Suspend</> : <><CheckCircle2 size={14} /> Reactivate</>}
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <section className="card-surface p-5">
          <h3 className="font-display font-semibold text-ink">Purchases ({orders.length})</h3>
          <div className="mt-3 space-y-2">
            {orders.length === 0 && <p className="text-sm text-ink/50">No purchases yet.</p>}
            {orders.map((o) => (
              <div key={o._id} className="flex items-center justify-between rounded-lg bg-brand-haze/50 px-3 py-2 text-sm">
                <span className="text-ink">{o.design?.name || 'Design unavailable'}</span>
                <div className="flex items-center gap-2">
                  <span className="text-ink/50">{formatPrice(o.amount)}</span>
                  <StatusBadge status={o.status} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface p-5">
          <h3 className="font-display font-semibold text-ink">Repair Requests ({repairs.length})</h3>
          <div className="mt-3 space-y-2">
            {repairs.length === 0 && <p className="text-sm text-ink/50">No repair requests.</p>}
            {repairs.map((r) => (
              <div key={r._id} className="flex items-center justify-between rounded-lg bg-brand-haze/50 px-3 py-2 text-sm">
                <span className="text-ink">{r.serviceType.replace('_', ' ')}</span>
                <span className="text-xs text-ink/50">{r.status.replace('_', ' ')}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface p-5">
          <h3 className="font-display font-semibold text-ink">Custom Design Requests ({customRequests.length})</h3>
          <div className="mt-3 space-y-2">
            {customRequests.length === 0 && <p className="text-sm text-ink/50">No custom requests.</p>}
            {customRequests.map((r) => (
              <div key={r._id} className="flex items-center justify-between rounded-lg bg-brand-haze/50 px-3 py-2 text-sm">
                <span className="text-ink">{r.title}</span>
                <span className="text-xs text-ink/50">{r.status.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card-surface p-5">
          <h3 className="font-display font-semibold text-ink">Recent Downloads ({downloads.length})</h3>
          <div className="mt-3 space-y-2">
            {downloads.length === 0 && <p className="text-sm text-ink/50">No downloads yet.</p>}
            {downloads.map((d) => (
              <div key={d._id} className="flex items-center justify-between rounded-lg bg-brand-haze/50 px-3 py-2 text-sm">
                <span className="text-ink">{d.design?.name || 'Design unavailable'} (.{d.format})</span>
                <span className="text-xs text-ink/50">{new Date(d.createdAt).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
