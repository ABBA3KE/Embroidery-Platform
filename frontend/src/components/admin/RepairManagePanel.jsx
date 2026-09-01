import { useState } from 'react';
import { UploadCloud, Send, AlertCircle } from 'lucide-react';
import { updateRepairStatusAdmin, addRepairComment, uploadRepairedFileAdmin } from '../../services/adminService';
import { downloadRepairFile } from '../../services/repairService';

const STATUS_OPTIONS = ['pending', 'under_review', 'accepted', 'rejected', 'in_progress', 'completed'];

export default function RepairManagePanel({ request, onUpdated }) {
  const [status, setStatus] = useState(request.status);
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const handleStatusChange = async () => {
    setError('');
    setIsBusy(true);
    try {
      const updated = await updateRepairStatusAdmin(request._id, status);
      onUpdated(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    setError('');
    setIsBusy(true);
    try {
      const updated = await addRepairComment(request._id, comment);
      setComment('');
      onUpdated(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleFileUpload = async (file) => {
    if (!file) return;
    setError('');
    setIsBusy(true);
    try {
      const formData = new FormData();
      formData.append('repairedFile', file);
      const updated = await uploadRepairedFileAdmin(request._id, formData);
      onUpdated(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  return (
    <div className="space-y-5">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <p className="text-xs font-medium text-ink/50">Customer</p>
        <p className="text-sm text-ink">{request.user?.fullName} · {request.user?.email}</p>
      </div>

      <div>
        <p className="text-xs font-medium text-ink/50">Service type</p>
        <p className="text-sm capitalize text-ink">{request.serviceType.replace(/_/g, ' ')}</p>
      </div>

      <div>
        <p className="text-xs font-medium text-ink/50">Description</p>
        <p className="text-sm text-ink/70">{request.description}</p>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => downloadRepairFile(request._id, 'original')}
          className="btn-secondary px-3 py-1.5 text-xs"
        >
          Download Original File
        </button>
        {request.referenceImage && (
          <button
            onClick={() => downloadRepairFile(request._id, 'reference')}
            className="btn-secondary px-3 py-1.5 text-xs"
          >
            Download Reference Image
          </button>
        )}
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink/50">Status</p>
        <div className="flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <button onClick={handleStatusChange} disabled={isBusy || status === request.status} className="btn-primary shrink-0 px-4 text-sm">
            Update
          </button>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink/50">Upload repaired file</p>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line px-4 py-4 text-center text-xs text-ink/50 hover:border-brand/40 hover:bg-brand-mist/50">
          <UploadCloud size={16} />
          {request.repairedFile ? `Replace: ${request.repairedFile.originalFilename}` : 'Click to upload the repaired file'}
          <input type="file" className="hidden" onChange={(e) => handleFileUpload(e.target.files?.[0])} />
        </label>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink/50">Comments</p>
        <div className="max-h-32 space-y-2 overflow-y-auto">
          {request.adminComments?.map((c, i) => (
            <p key={i} className="rounded-lg bg-brand-haze/50 px-3 py-2 text-xs text-ink/70">{c.comment}</p>
          ))}
        </div>
        <form onSubmit={handleComment} className="mt-2 flex gap-2">
          <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment…" className="input-field" />
          <button type="submit" disabled={isBusy} className="btn-secondary shrink-0 px-3">
            <Send size={14} />
          </button>
        </form>
      </div>
    </div>
  );
}
