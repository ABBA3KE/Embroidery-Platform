import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UploadCloud, X, AlertCircle } from 'lucide-react';
import { submitCustomDesignRequest } from '../../services/customDesignService';
import { fetchCategories } from '../../services/categoryService';
import { DESIGN_FORMAT_OPTIONS } from '../../constants/customDesign';
import { ROUTES } from '../../constants/routes';

export default function CustomDesignForm() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '', category: '', description: '', preferredSize: '',
    intendedUse: '', preferredFormat: '', additionalInstructions: '',
  });
  const [referenceImage, setReferenceImage] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories().then(setCategories).catch(() => {});
  }, []);

  const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.category) {
      setError('Please select a category.');
      return;
    }

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) => formData.append(key, value));
    if (referenceImage) formData.append('referenceImage', referenceImage);

    setIsSubmitting(true);
    try {
      await submitCustomDesignRequest(formData);
      navigate(ROUTES.MY_CUSTOM_DESIGNS);
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
          <label htmlFor="title" className="mb-1.5 block text-sm font-medium text-ink">Design name / title</label>
          <input id="title" name="title" type="text" required value={form.title} onChange={handleChange}
            placeholder="e.g. Family Crest Logo" className="input-field" />
        </div>

        <div>
          <label htmlFor="category" className="mb-1.5 block text-sm font-medium text-ink">Category</label>
          <select id="category" name="category" required value={form.category} onChange={handleChange} className="input-field">
            <option value="">Select a category…</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="preferredFormat" className="mb-1.5 block text-sm font-medium text-ink">
            Preferred format <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <select id="preferredFormat" name="preferredFormat" value={form.preferredFormat} onChange={handleChange} className="input-field">
            <option value="">No preference</option>
            {DESIGN_FORMAT_OPTIONS.map((fmt) => <option key={fmt} value={fmt}>.{fmt}</option>)}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="description" className="mb-1.5 block text-sm font-medium text-ink">Description</label>
          <textarea id="description" name="description" required rows={4} value={form.description} onChange={handleChange}
            placeholder="Describe what you'd like designed in as much detail as possible."
            className="input-field resize-none" />
        </div>

        <div>
          <label htmlFor="preferredSize" className="mb-1.5 block text-sm font-medium text-ink">
            Preferred size / dimensions <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <input id="preferredSize" name="preferredSize" type="text" value={form.preferredSize} onChange={handleChange}
            placeholder="e.g. 4x4 inches" className="input-field" />
        </div>

        <div>
          <label htmlFor="intendedUse" className="mb-1.5 block text-sm font-medium text-ink">
            Intended use <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <input id="intendedUse" name="intendedUse" type="text" value={form.intendedUse} onChange={handleChange}
            placeholder="e.g. Polo shirts, caps" className="input-field" />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor="additionalInstructions" className="mb-1.5 block text-sm font-medium text-ink">
            Additional instructions <span className="font-normal text-ink/40">(optional)</span>
          </label>
          <textarea id="additionalInstructions" name="additionalInstructions" rows={2}
            value={form.additionalInstructions} onChange={handleChange}
            placeholder="Colors, style references, anything else we should know?"
            className="input-field resize-none" />
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Reference image <span className="font-normal text-ink/40">(optional)</span>
          </label>
          {referenceImage ? (
            <div className="flex items-center justify-between rounded-xl border border-line bg-brand-haze/50 px-4 py-3">
              <span className="truncate text-sm text-ink">{referenceImage.name}</span>
              <button type="button" onClick={() => setReferenceImage(null)} className="ml-2 shrink-0 text-ink/40 hover:text-red-600" aria-label="Remove file">
                <X size={16} />
              </button>
            </div>
          ) : (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line px-4 py-6 text-center transition-colors hover:border-brand/40 hover:bg-brand-mist/50">
              <UploadCloud size={20} className="text-ink/40" />
              <span className="text-xs text-ink/50">Click to upload an inspiration image</span>
              <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden"
                onChange={(e) => setReferenceImage(e.target.files?.[0] || null)} />
            </label>
          )}
        </div>
      </div>

      <button type="submit" disabled={isSubmitting} className="btn-primary mt-6 w-full sm:w-auto">
        {isSubmitting ? 'Submitting…' : 'Submit Custom Design Request'}
      </button>
    </form>
  );
}
