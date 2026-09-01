import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, AlertCircle } from 'lucide-react';
import { fetchAdminCategories, createCategory, updateCategory, deleteCategory } from '../../services/adminService';
import LoadingScreen from '../../components/common/LoadingScreen';
import ErrorState from '../../components/common/ErrorState';
import Modal from '../../components/common/Modal';

export default function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const [modal, setModal] = useState({ open: false, category: null });
  const [form, setForm] = useState({ name: '', description: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const load = async () => {
    setIsLoading(true);
    setError('');
    try {
      setCategories(await fetchAdminCategories());
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const openModal = (category = null) => {
    setForm({ name: category?.name || '', description: category?.description || '' });
    setModal({ open: true, category });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setActionError('');
    setIsSubmitting(true);
    try {
      if (modal.category) {
        await updateCategory(modal.category._id, form);
      } else {
        await createCategory(form);
      }
      setModal({ open: false, category: null });
      load();
    } catch (err) {
      setActionError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete "${category.name}"?`)) return;
    setActionError('');
    try {
      await deleteCategory(category._id);
      load();
    } catch (err) {
      setActionError(err.message);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-semibold text-ink">Categories</h1>
          <p className="mt-1 text-sm text-ink/60">Organize the design gallery.</p>
        </div>
        <button onClick={() => openModal()} className="btn-primary px-4 py-2 text-sm">
          <Plus size={16} /> Add Category
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
          <ErrorState message={error} onRetry={load} />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((cat) => (
              <div key={cat._id} className="card-surface flex items-start justify-between p-4">
                <div>
                  <h3 className="font-display font-semibold text-ink">{cat.name}</h3>
                  <p className="mt-0.5 text-xs text-ink/50">{cat.designCount} design{cat.designCount !== 1 ? 's' : ''}</p>
                  {cat.description && <p className="mt-1 text-sm text-ink/60">{cat.description}</p>}
                </div>
                <div className="flex shrink-0 gap-1">
                  <button onClick={() => openModal(cat)} className="rounded-lg p-1.5 text-ink/50 hover:bg-brand-mist hover:text-brand">
                    <Pencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(cat)} className="rounded-lg p-1.5 text-ink/50 hover:bg-red-50 hover:text-red-600">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Modal isOpen={modal.open} onClose={() => setModal({ open: false, category: null })} title={modal.category ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Name</label>
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className="input-field" />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Description</label>
            <textarea rows={2} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} className="input-field resize-none" />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={() => setModal({ open: false, category: null })} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="btn-primary px-4 py-2 text-sm">{isSubmitting ? 'Saving…' : 'Save'}</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
