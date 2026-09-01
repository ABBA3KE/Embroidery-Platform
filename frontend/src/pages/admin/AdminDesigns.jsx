import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Eye, EyeOff, AlertCircle } from 'lucide-react';
import {
  fetchAdminDesigns, setDesignStatus, deleteAdminDesign,
} from '../../services/adminService';
import { formatPrice } from '../../utils/format';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import Modal from '../../components/common/Modal';
import DesignForm from '../../components/admin/DesignForm';
import DesignFileUploadPanel from '../../components/admin/DesignFileUploadPanel';

export default function AdminDesigns() {
  const [designs, setDesigns] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');

  const [formModal, setFormModal] = useState({ open: false, design: null });
  const [filesModal, setFilesModal] = useState({ open: false, design: null });

  const load = async (page = 1) => {
    setIsLoading(true);
    setError('');
    try {
      const { designs: results, pagination: pageInfo } = await fetchAdminDesigns({ page });
      setDesigns(results);
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

  const handleTogglePublish = async (design) => {
    setActionError('');
    try {
      await setDesignStatus(design._id, design.status === 'published' ? 'draft' : 'published');
      load(pagination.page);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleDelete = async (design) => {
    if (!window.confirm(`Delete "${design.name}"? This cannot be undone.`)) return;
    setActionError('');
    try {
      await deleteAdminDesign(design._id);
      load(pagination.page);
    } catch (err) {
      setActionError(err.message);
    }
  };

  const handleSaved = () => {
    setFormModal({ open: false, design: null });
    load(pagination.page);
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Designs</h1>
          <p className="mt-1 text-sm text-ink/60">Manage the design gallery.</p>
        </div>
        <button onClick={() => setFormModal({ open: true, design: null })} className="btn-primary px-4 py-2 text-sm">
          <Plus size={16} /> Add Design
        </button>
      </div>

      {actionError && (
        <div className="mt-4 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{actionError}</span>
        </div>
      )}

      <div className="mt-6">
        {isLoading ? (
          <LoadingScreen />
        ) : error ? (
          <ErrorState message={error} onRetry={() => load()} />
        ) : designs.length === 0 ? (
          <EmptyState title="No designs yet" description="Add your first design to the gallery." showCustomCta={false} />
        ) : (
          <>
            <div className="card-surface overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b border-line text-xs text-ink/50">
                  <tr>
                    <th className="px-4 py-3 font-medium">Design</th>
                    <th className="px-4 py-3 font-medium">Category</th>
                    <th className="px-4 py-3 font-medium">Price</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Purchases</th>
                    <th className="px-4 py-3 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line">
                  {designs.map((d) => (
                    <tr key={d._id}>
                      <td className="flex items-center gap-3 px-4 py-3">
                        <img src={d.previewImage} alt={d.name} className="h-10 w-10 rounded-lg object-cover" onError={(e) => { e.currentTarget.style.visibility = 'hidden'; }} />
                        <span className="font-medium text-ink">{d.name}</span>
                      </td>
                      <td className="px-4 py-3 text-ink/60">{d.category?.name || '—'}</td>
                      <td className="px-4 py-3 text-ink/60">{formatPrice(d.price)}</td>
                      <td className="px-4 py-3">
                        <span className={`rounded-full px-2 py-1 text-xs font-medium ${d.status === 'published' ? 'bg-brand-mist text-brand' : 'bg-ink/5 text-ink/50'}`}>
                          {d.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-ink/60">{d.purchaseCount}</td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-1.5">
                          <button onClick={() => setFilesModal({ open: true, design: d })} className="rounded-lg p-1.5 text-ink/50 hover:bg-brand-mist hover:text-brand" title="Manage files">
                            <Pencil size={15} />
                          </button>
                          <button onClick={() => handleTogglePublish(d)} className="rounded-lg p-1.5 text-ink/50 hover:bg-brand-mist hover:text-brand" title={d.status === 'published' ? 'Unpublish' : 'Publish'}>
                            {d.status === 'published' ? <EyeOff size={15} /> : <Eye size={15} />}
                          </button>
                          <button onClick={() => handleDelete(d)} className="rounded-lg p-1.5 text-ink/50 hover:bg-red-50 hover:text-red-600" title="Delete">
                            <Trash2 size={15} />
                          </button>
                        </div>
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

      <Modal isOpen={formModal.open} onClose={() => setFormModal({ open: false, design: null })} title={formModal.design ? 'Edit Design' : 'Add Design'} maxWidth="max-w-2xl">
        <DesignForm design={formModal.design} onSaved={handleSaved} onCancel={() => setFormModal({ open: false, design: null })} />
      </Modal>

      <Modal isOpen={filesModal.open} onClose={() => setFilesModal({ open: false, design: null })} title={filesModal.design?.name || 'Manage Design'} maxWidth="max-w-lg">
        {filesModal.design && (
          <div className="space-y-5">
            <DesignFileUploadPanel
              design={filesModal.design}
              onUpdated={(updated) => {
                setFilesModal({ open: true, design: updated });
                load(pagination.page);
              }}
            />
            <button
              onClick={() => { setFilesModal({ open: false, design: null }); setFormModal({ open: true, design: filesModal.design }); }}
              className="btn-secondary w-full text-sm"
            >
              <Pencil size={14} /> Edit Design Details
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
