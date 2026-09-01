import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import { submitRepairRequest } from '../../services/repairService';
import { REPAIR_SERVICE_TYPES } from '../../constants/repair';
import { ROUTES } from '../../constants/routes';

export default function RepairRequestForm() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ serviceType: '', description: '', additionalInstructions: '' });
  const [originalFile, setOriginalFile] = useState(null);
  const [referenceImage, setReferenceImage] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.serviceType) {
      setError('Please select a service type.');
      return;
    }
    if (!originalFile) {
      setError('Please attach the embroidery file that needs repair.');
      return;
    }

    const formData = new FormData();
    formData.append('serviceType', form.serviceType);
    formData.append('description', form.description);
    formData.append('additionalInstructions', form.additionalInstructions);
    formData.append('originalFile', originalFile);
    if (referenceImage) formData.append('referenceImage', referenceImage);

    setIsSubmitting(true);
    try {
      await submitRepairRequest(formData);
      navigate(ROUTES.MY_REPAIRS);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="card-surface p-6 sm:p-8">
      {error && (
        <div className="mb-5 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="serviceType" className="mb-1.5 block text-sm font-medium text-ink">Service type</label>
          <select id="serviceType" name="serviceType" required value={form.serviceType} onChange={handleChange} className="input-field">
            <option value="">Select a service…</option>
            {REPAIR_SERVICE_TYPES.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">Describe the issue</label>
          <textarea
            id="description" name="description" required rows={4}
            value={form.description} onChange={handleChange}
            placeholder="What's wrong with the file, and what should the result look like?"
            className="input-field resize-none"
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="additionalInstructions" className="mb-1.5 block text-sm font-medium text-ink">
            Additional instructions <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <textarea
            id="additionalInstructions" name="additionalInstructions" rows={2}
            value={form.additionalInstructions} onChange={handleChange}
            placeholder="Anything else we should know?"
            className="input-field resize-none"
          />
        </div>

        <FileDropField
          label="Embroidery file to repair"
          required
          file={originalFile}
          onChange={setOriginalFile}
          accept=".enb,.emx,.dst,.pes,.jef,.vp3,.xxx,.png"
        />
        <FileDropField
          label="Reference image"
          optional
          file={referenceImage}
          onChange={setReferenceImage}
          accept="image/png,image/jpeg,image/webp"
        />
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full sm:w-auto">
        {isSubmitting ? 'Submitting…' : 'Submit Repair Request'}
      </button>
    </form>
  );
}

function FileDropField({ label, required, optional, file, onChange, accept }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-ink">
        {label} {optional && <span className="font-normal text-ink/40">(optional)</span>}
      </label>
      {file ? (
        <div className="flex items-center justify-between rounded-xl border border-line bg-brand-haze/50 px-4 py-3">
          <span className="truncate text-sm text-ink">{file.name}</span>
          <button type="button" onClick={() => onChange(null)} className="ml-2 shrink-0 text-ink/40 hover:text-red-600" aria-label="Remove file">
            <X size={16} />
          </button>
        </div>
      ) : (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line px-4 py-6 text-center transition-colors hover:border-brand/40 hover:bg-brand-mist/50">
          <UploadCloud size={20} className="text-ink/40" />
          <span className="text-xs text-ink/50">Click to upload</span>
          <input
            type="file"
            required={required}
            accept={accept}
            className="hidden"
            onChange={(e) => onChange(e.target.files?.[0] || null)}
          />
        </label>
      )}
    </div>
  );
}
