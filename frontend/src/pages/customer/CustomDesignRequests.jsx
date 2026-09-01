import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download as DownloadIcon, MessageSquare, AlertCircle, Check, X, CreditCard } from 'lucide-react';
import {
  fetchMyCustomDesignRequests,
  approveQuotation,
  rejectQuotation,
  initializeCustomDesignPayment,
  downloadCompletedFile,
} from '../../services/customDesignService';
import { formatPrice } from '../../utils/format';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import CustomDesignStatusBadge from '../../components/custom-design/CustomDesignStatusBadge';

export default function CustomDesignRequests() {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [busyId, setBusyId] = useState('');

  const load = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const { requests: results, pagination: pageInfo } = await fetchMyCustomDesignRequests({ page });
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
  }, []);

  const runAction = async (id, fn) => {
    setActionError('');
    setBusyId(id);
    try {
      await fn();
      await load(pagination.page);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId('');
    }
  };

  const handlePay = async (id) => {
    setActionError('');
    setBusyId(id);
    try {
      const { authorizationUrl } = await initializeCustomDesignPayment(id);
      window.location.href = authorizationUrl;
    } catch (err) {
      setActionError(err.message);
      setBusyId('');
    }
  };

  const handleDownload = async (id, format) => {
    setActionError('');
    setBusyId(`${id}-${format}`);
    try {
      await downloadCompletedFile(id, format);
    } catch (err) {
      setActionError(err.message);
    } finally {
      setBusyId('');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Custom Design Requests</h1>
      <div className="stitch-rule mt-3 w-16" />
      <p className="mt-3 text-ink/60">Track requirements, quotations, and delivery of your custom designs.</p>

      {actionError && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      <div className="mt-8">
        {isLoading ? (
          <LoadingScreen label="Loading requests" />
        ) : error ? (
          <ErrorState message={error} onRetry={() => load()} />
        ) : requests.length === 0 ? (
          <EmptyState title="No custom design requests yet" description="Submit a request to get started." showCustomCta={false} />
        ) : (
          <>
            <div className="space-y-5">
              {requests.map((req, i) => (
                <motion.div
                  key={req._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className="card-surface p-5"
                >
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-ink">{req.title}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-ink/60">{req.description}</p>
                    </div>
                    <CustomDesignStatusBadge status={req.status} />
                  </div>

                  {req.quotation?.amount > 0 && (
                    <div className="mt-4 rounded-xl border border-line bg-brand-haze/50 p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-ink/60">Design Fee</span>
                        <span className="font-display font-semibold text-brand">{formatPrice(req.quotation.amount)}</span>
                      </div>
                      {req.quotation.notes && <p className="mt-1.5 text-sm text-ink/60">{req.quotation.notes}</p>}

                      {req.status === 'awaiting_customer_approval' && (
                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => runAction(req._id, () => approveQuotation(req._id))}
                            disabled={busyId === req._id}
                            className="btn-primary px-3 py-2 text-xs"
                          >
                            <Check size={13} /> Accept Quotation
                          </button>
                          <button
                            onClick={() => runAction(req._id, () => rejectQuotation(req._id))}
                            disabled={busyId === req._id}
                            className="btn-secondary px-3 py-2 text-xs"
                          >
                            <X size={13} /> Decline
                          </button>
                        </div>
                      )}

                      {req.status === 'awaiting_payment' && (
                        <button onClick={() => handlePay(req._id)} disabled={busyId === req._id} className="btn-primary mt-3 px-3 py-2 text-xs">
                          <CreditCard size={13} /> Pay Now
                        </button>
                      )}
                    </div>
                  )}

                  {req.adminComments?.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-line pt-4">
                      <p className="flex items-center gap-1.5 text-xs font-medium text-ink/50">
                        <MessageSquare size={13} /> Admin comments
                      </p>
                      {req.adminComments.map((c, idx) => (
                        <p key={idx} className="rounded-lg bg-brand-haze/50 px-3 py-2 text-sm text-ink/70">{c.comment}</p>
                      ))}
                    </div>
                  )}

                  {req.status === 'completed' && (
                    <div className="mt-4 flex flex-wrap gap-2">
                      {(req.preferredFormat ? [req.preferredFormat] : ['ENB', 'EMX', 'PNG']).map((format) => (
                        <button
                          key={format}
                          onClick={() => handleDownload(req._id, format)}
                          disabled={busyId === `${req._id}-${format}`}
                          className="btn-secondary px-3 py-2 text-xs"
                        >
                          <DownloadIcon size={13} />
                          {busyId === `${req._id}-${format}` ? 'Preparing…' : `.${format}`}
                        </button>
                      ))}
                    </div>
                  )}
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
