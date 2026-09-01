import { useState } from 'react';
import { UploadCloud, Send, AlertCircle } from 'lucide-react';
import {
  sendQuotationAdmin, updateCustomDesignStatusAdmin, addCustomDesignCommentAdmin,
  uploadCustomDesignCompletedFileAdmin, uploadCustomDesignPreviewAdmin,
} from '../../services/adminService';
import { downloadCompletedFile } from '../../services/customDesignService';
import api from '../../services/api';

const STATUS_OPTIONS = [
  'pending', 'under_review', 'quotation_sent', 'awaiting_customer_approval', 'awaiting_payment',
  'approved', 'in_progress', 'revision_requested', 'completed', 'rejected', 'cancelled',
];
const FORMATS = ['EMB', 'EMX', 'DST'];

export default function CustomDesignManagePanel({ request, onUpdated }) {
  const [status, setStatus] = useState(request.status);
  const [quoteAmount, setQuoteAmount] = useState(request.quotation?.amount || '');
  const [quoteNotes, setQuoteNotes] = useState(request.quotation?.notes || '');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [isBusy, setIsBusy] = useState(false);

  const runAction = async (fn) => {
    setError('');
    setIsBusy(true);
    try {
      const updated = await fn();
      onUpdated(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsBusy(false);
    }
  };

  const handleSendQuotation = () => {
    if (!quoteAmount) return setError('Enter a quotation amount.');
    runAction(() => sendQuotationAdmin(request._id, { amount: Number(quoteAmount), notes: quoteNotes }));
  };

  const handleStatusChange = () => runAction(() => updateCustomDesignStatusAdmin(request._id, status));

  const handleComment = (e) => {
    e.preventDefault();
    if (!comment.trim()) return;
    runAction(() => addCustomDesignCommentAdmin(request._id, comment)).then(() => setComment(''));
  };

  const handleCompletedFile = (format, file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('format', format);
    formData.append('file', file);
    runAction(() => uploadCustomDesignCompletedFileAdmin(request._id, formData));
  };

  const handlePreviewImage = (file) => {
    if (!file) return;
    const formData = new FormData();
    formData.append('previewImage', file);
    runAction(() => uploadCustomDesignPreviewAdmin(request._id, formData));
  };

  const handleDownloadReference = async () => {
    try {
      const response = await api.get(`/custom-designs/${request._id}/reference-image`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.download = 'reference-image';
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message);
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
        <p className="text-xs font-medium text-ink/50">Requirements</p>
        <p className="text-sm text-ink/70">{request.description}</p>
        {request.preferredSize && <p className="mt-1 text-xs text-ink/50">Size: {request.preferredSize}</p>}
        {request.intendedUse && <p className="text-xs text-ink/50">Use: {request.intendedUse}</p>}
        {request.preferredFormat && <p className="text-xs text-ink/50">Preferred format: .{request.preferredFormat}</p>}
      </div>

      {request.referenceImage && (
        <button onClick={handleDownloadReference} className="btn-secondary px-3 py-1.5 text-xs">
          Download Reference Image
        </button>
      )}

      <div className="rounded-xl border border-line p-4">
        <p className="text-xs font-medium text-ink/50">Send / update quotation</p>
        <div className="mt-2 flex gap-2">
          <input type="number" min="0" value={quoteAmount} onChange={(e) => setQuoteAmount(e.target.value)} placeholder="Amount (₦)" className="input-field" />
        </div>
        <textarea value={quoteNotes} onChange={(e) => setQuoteNotes(e.target.value)} placeholder="Notes for the customer (optional)" rows={2} className="input-field mt-2 resize-none" />
        <button onClick={handleSendQuotation} disabled={isBusy} className="btn-primary mt-2 px-4 py-2 text-sm">Send Quotation</button>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink/50">Status</p>
        <div className="flex gap-2">
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="input-field">
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.replace(/_/g, ' ')}</option>)}
          </select>
          <button onClick={handleStatusChange} disabled={isBusy || status === request.status} className="btn-primary shrink-0 px-4 text-sm">Update</button>
        </div>
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink/50">Completed files</p>
        <div className="grid grid-cols-3 gap-2">
          {FORMATS.map((format) => {
            const uploaded = request.completedFiles?.find((f) => f.format === format);
            return (
              <label key={format} className="flex cursor-pointer flex-col items-center gap-1 rounded-xl border border-dashed border-line px-2 py-3 text-center text-xs hover:border-brand/40 hover:bg-brand-mist/50">
                <UploadCloud size={14} className={uploaded ? 'text-brand' : 'text-ink/40'} />
                <span className={uploaded ? 'font-medium text-brand' : 'text-ink/50'}>.{format}</span>
                <input type="file" className="hidden" onChange={(e) => handleCompletedFile(format, e.target.files?.[0])} />
              </label>
            );
          })}
        </div>
        {request.completedFiles?.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {request.completedFiles.map((f) => (
              <button key={f.format} onClick={() => downloadCompletedFile(request._id, f.format)} className="btn-secondary px-2 py-1 text-[11px]">
                Preview .{f.format}
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <p className="mb-1.5 text-xs font-medium text-ink/50">Preview image</p>
        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line px-4 py-3 text-center text-xs text-ink/50 hover:border-brand/40 hover:bg-brand-mist/50">
          <UploadCloud size={14} />
          {request.previewImage ? 'Replace preview image' : 'Upload preview image'}
          <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => handlePreviewImage(e.target.files?.[0])} />
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
