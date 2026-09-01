import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Download as DownloadIcon, RefreshCw, AlertCircle } from 'lucide-react';
import { fetchMyOrders } from '../../services/orderService';
import { initializePayment } from '../../services/paymentService';
import { downloadDesignFile } from '../../services/downloadService';
import { formatPrice } from '../../utils/format';
import { ROUTES } from '../../constants/routes';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';

export default function Purchases() {
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadingKey, setDownloadingKey] = useState('');
  const [downloadError, setDownloadError] = useState('');

  const load = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const { orders: results, pagination: pageInfo } = await fetchMyOrders({ page });
      setOrders(results);
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

  const handleRetryPayment = async (orderId) => {
    try {
      const { authorizationUrl } = await initializePayment(orderId);
      window.location.href = authorizationUrl;
    } catch (err) {
      setDownloadError(err.message);
    }
  };

  const handleDownload = async (designId, format) => {
    const key = `${designId}-${format}`;
    setDownloadError('');
    setDownloadingKey(key);
    try {
      await downloadDesignFile(designId, format);
    } catch (err) {
      setDownloadError(err.message);
    } finally {
      setDownloadingKey('');
    }
  };

  return (
    <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">My Purchases</h1>
      <div className="stitch-rule mt-3 w-16" />
      <p className="mt-3 text-ink/60">Your order history, payment status, and protected downloads.</p>

      {downloadError && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{downloadError}</span>
        </div>
      )}

      <div className="mt-8">
        {isLoading ? (
          <LoadingScreen label="Loading purchases" />
        ) : error ? (
          <ErrorState message={error} onRetry={() => load()} />
        ) : orders.length === 0 ? (
          <EmptyState title="No purchases yet" description="Browse the gallery to find your first design." showCustomCta={false} />
        ) : (
          <>
            <div className="space-y-4">
              {orders.map((order, i) => (
                <motion.div
                  key={order._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="card-surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <img
                    src={order.design?.previewImage}
                    alt={order.design?.name}
                    className="h-20 w-20 shrink-0 rounded-xl object-cover"
                    onError={(e) => { e.currentTarget.src = '/assets/images/designs/placeholder.png'; }}
                  />

                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <Link to={`/designs/${order.design?.slug}`} className="font-display font-semibold text-ink hover:text-brand">
                        {order.design?.name || 'Design unavailable'}
                      </Link>
                      <StatusBadge status={order.status} />
                    </div>
                    <p className="mt-1 font-mono text-xs text-ink/40">{order.orderReference}</p>
                    <p className="mt-1 text-sm text-ink/60">{formatPrice(order.amount)}</p>
                  </div>

                  <div className="flex shrink-0 flex-wrap gap-2">
                    {order.status === 'paid' &&
                      order.design?.availableFormats?.map((format) => (
                        <button
                          key={format}
                          onClick={() => handleDownload(order.design._id, format)}
                          disabled={downloadingKey === `${order.design._id}-${format}`}
                          className="btn-secondary px-3 py-2 text-xs"
                        >
                          <DownloadIcon size={13} />
                          {downloadingKey === `${order.design._id}-${format}` ? 'Preparing…' : `.${format}`}
                        </button>
                      ))}

                    {order.status === 'pending' && (
                      <button onClick={() => handleRetryPayment(order._id)} className="btn-primary px-3 py-2 text-xs">
                        <RefreshCw size={13} />
                        Complete Payment
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            <Pagination page={pagination.page} totalPages={pagination.totalPages} onChange={(p) => load(p)} />
          </>
        )}
      </div>
    </div>
  );
}
