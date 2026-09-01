import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Download as DownloadIcon, MessageSquare, AlertCircle } from 'lucide-react';
import { fetchMyRepairRequests, downloadRepairFile } from '../../services/repairService';
import { REPAIR_SERVICE_TYPES } from '../../constants/repair';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import RepairTimeline from '../../components/repair/RepairTimeline';

const typeLabel = (value) => REPAIR_SERVICE_TYPES.find((t) => t.value === value)?.label || value;

export default function RepairRequests() {
  const [requests, setRequests] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [downloadError, setDownloadError] = useState('');
  const [downloadingId, setDownloadingId] = useState('');

  const load = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const { requests: results, pagination: pageInfo } = await fetchMyRepairRequests({ page });
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

  const handleDownload = async (id) => {
    setDownloadError('');
    setDownloadingId(id);
    try {
      await downloadRepairFile(id, 'repaired');
    } catch (err) {
      setDownloadError(err.message);
    } finally {
      setDownloadingId('');
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-display text-3xl font-semibold text-ink">Repair Requests</h1>
      <div className="stitch-rule mt-3 w-16" />
      <p className="mt-3 text-ink/60">Track the status of your submitted repair requests.</p>

      {downloadError && (
        <div className="mt-6 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{downloadError}</span>
        </div>
      )}

      <div className="mt-8">
        {isLoading ? (
          <LoadingScreen label="Loading repair requests" />
        ) : error ? (
          <ErrorState message={error} onRetry={() => load()} />
        ) : requests.length === 0 ? (
          <EmptyState title="No repair requests yet" description="Submit a repair request to get started." showCustomCta={false} />
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
                      <h3 className="font-display font-semibold text-ink">{typeLabel(req.serviceType)}</h3>
                      <p className="mt-1 line-clamp-2 text-sm text-ink/60">{req.description}</p>
                    </div>
                    <span className="whitespace-nowrap text-xs text-ink/40">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="mt-5">
                    <RepairTimeline status={req.status} />
                  </div>

                  {req.adminComments?.length > 0 && (
                    <div className="mt-5 space-y-2 border-t border-line pt-4">
                      <p className="flex items-center gap-1.5 text-xs font-medium text-ink/50">
                        <MessageSquare size={13} /> Admin comments
                      </p>
                      {req.adminComments.map((c, idx) => (
                        <p key={idx} className="rounded-lg bg-brand-haze/50 px-3 py-2 text-sm text-ink/70">{c.comment}</p>
                      ))}
                    </div>
                  )}

                  {req.status === 'completed' && (
                    <button
                      onClick={() => handleDownload(req._id)}
                      disabled={downloadingId === req._id}
                      className="btn-secondary mt-5 px-3 py-2 text-xs"
                    >
                      <DownloadIcon size={13} />
                      {downloadingId === req._id ? 'Preparing…' : 'Download Repaired File'}
                    </button>
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
