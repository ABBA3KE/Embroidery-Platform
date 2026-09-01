// import { useEffect, useState } from 'react';
// import { AlertCircle, UploadCloud } from 'lucide-react';
// import { createAdminDesign, updateAdminDesign } from '../../services/adminService';
// import { fetchCategories } from '../../services/categoryService';

// export default function DesignForm({ design, onSaved, onCancel }) {
//   const [categories, setCategories] = useState([]);
//   const [form, setForm] = useState({
//     name: design?.name || '',
//     description: design?.description || '',
//     category: design?.category?._id || '',
//     price: design?.price || '',
//     stitchCount: design?.specifications?.stitchCount || '',
//     dimensions: design?.specifications?.dimensions || '',
//     colors: design?.specifications?.colors || '',
//     hoopSize: design?.specifications?.hoopSize || '',
//   });
//   const [previewImage, setPreviewImage] = useState(null);
//   const [error, setError] = useState('');
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   useEffect(() => {
//     fetchCategories().then(setCategories).catch(() => {});
//   }, []);

//   const handleChange = (e) => setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setError('');

//     if (!design && !previewImage) {
//       setError('A preview image is required for new designs.');
//       return;
//     }

//     const formData = new FormData();
//     formData.append('name', form.name);
//     formData.append('description', form.description);
//     formData.append('category', form.category);
//     formData.append('price', form.price);
//     formData.append('specifications', JSON.stringify({
//       stitchCount: form.stitchCount ? Number(form.stitchCount) : undefined,
//       dimensions: form.dimensions || undefined,
//       colors: form.colors ? Number(form.colors) : undefined,
//       hoopSize: form.hoopSize || undefined,
//     }));
//     if (previewImage) formData.append('previewImage', previewImage);

//     setIsSubmitting(true);
//     try {
//       const saved = design ? await updateAdminDesign(design._id, formData) : await createAdminDesign(formData);
//       onSaved(saved);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       {error && (
//         <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
//           <AlertCircle size={16} className="mt-0.5 shrink-0" />
//           <span>{error}</span>
//         </div>
//       )}

//       <div>
//         <label className="mb-1.5 block text-sm font-medium text-ink">Design name</label>
//         <input name="name" required value={form.name} onChange={handleChange} className="input-field" />
//       </div>

//       <div>
//         <label className="mb-1.5 block text-sm font-medium text-ink">Description</label>
//         <textarea name="description" required rows={3} value={form.description} onChange={handleChange} className="input-field resize-none" />
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="mb-1.5 block text-sm font-medium text-ink">Category</label>
//           <select name="category" required value={form.category} onChange={handleChange} className="input-field">
//             <option value="">Select…</option>
//             {categories.map((cat) => <option key={cat._id} value={cat._id}>{cat.name}</option>)}
//           </select>
//         </div>
//         <div>
//           <label className="mb-1.5 block text-sm font-medium text-ink">Price (₦)</label>
//           <input name="price" type="number" min="0" required value={form.price} onChange={handleChange} className="input-field" />
//         </div>
//       </div>

//       <div className="grid grid-cols-2 gap-4">
//         <div>
//           <label className="mb-1.5 block text-sm font-medium text-ink">Stitch count</label>
//           <input name="stitchCount" type="number" min="0" value={form.stitchCount} onChange={handleChange} className="input-field" />
//         </div>
//         <div>
//           <label className="mb-1.5 block text-sm font-medium text-ink">Dimensions</label>
//           <input name="dimensions" placeholder="e.g. 4x4 in" value={form.dimensions} onChange={handleChange} className="input-field" />
//         </div>
//         <div>
//           <label className="mb-1.5 block text-sm font-medium text-ink">Colors</label>
//           <input name="colors" type="number" min="0" value={form.colors} onChange={handleChange} className="input-field" />
//         </div>
//         <div>
//           <label className="mb-1.5 block text-sm font-medium text-ink">Hoop size</label>
//           <input name="hoopSize" value={form.hoopSize} onChange={handleChange} className="input-field" />
//         </div>
//       </div>

//       <div>
//         <label className="mb-1.5 block text-sm font-medium text-ink">
//           Preview image {design && <span className="font-normal text-ink/40">(leave empty to keep current)</span>}
//         </label>
//         <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line px-4 py-4 text-center text-xs text-ink/50 hover:border-brand/40 hover:bg-brand-mist/50">
//           <UploadCloud size={16} />
//           {previewImage ? previewImage.name : 'Click to upload PNG / JPEG / WEBP'}
//           <input type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={(e) => setPreviewImage(e.target.files?.[0] || null)} />
//         </label>
//       </div>

//       <div className="flex justify-end gap-2 pt-2">
//         <button type="button" onClick={onCancel} className="btn-secondary px-4 py-2 text-sm">Cancel</button>
//         <button type="submit" disabled={isSubmitting} className="btn-primary px-4 py-2 text-sm">
//           {isSubmitting ? 'Saving…' : design ? 'Save Changes' : 'Create Design'}
//         </button>
//       </div>
//     </form>
//   );
// }


import { useEffect, useState } from 'react';
import { AlertCircle, UploadCloud } from 'lucide-react';
import { createAdminDesign, updateAdminDesign } from '../../services/adminService';
import { fetchCategories } from '../../services/categoryService';

export default function DesignForm({ design, onSaved, onCancel }) {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    name: design?.name || '',
    description: design?.description || '',
    category: design?.category?._id || '',
    price: design?.price || '',
    stitchCount: design?.specifications?.stitchCount || '',
    dimensions: design?.specifications?.dimensions || '',
    colors: design?.specifications?.colors || '',
    hoopSize: design?.specifications?.hoopSize || '',
  });

  const [previewImage, setPreviewImage] = useState(null);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories()
      .then(setCategories)
      .catch(() => {});
  }, []);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0] || null;

    setError('');

    if (!file) {
      setPreviewImage(null);
      return;
    }

    const allowedTypes = ['image/png', 'image/jpeg', 'image/webp'];

    if (!allowedTypes.includes(file.type)) {
      setError('Please select a PNG, JPEG, or WEBP image.');
      e.target.value = '';
      setPreviewImage(null);
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError('Preview image must not be larger than 5MB.');
      e.target.value = '';
      setPreviewImage(null);
      return;
    }

    setPreviewImage(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!design && !previewImage) {
      setError('Please select a preview image before creating the design.');
      return;
    }

    const formData = new FormData();

    formData.append('name', form.name);
    formData.append('description', form.description);
    formData.append('category', form.category);
    formData.append('price', form.price);

    formData.append(
      'specifications',
      JSON.stringify({
        stitchCount: form.stitchCount
          ? Number(form.stitchCount)
          : undefined,
        dimensions: form.dimensions || undefined,
        colors: form.colors
          ? Number(form.colors)
          : undefined,
        hoopSize: form.hoopSize || undefined,
      })
    );

    if (previewImage) {
      formData.append('previewImage', previewImage);
    }

    setIsSubmitting(true);

    try {
      const saved = design
        ? await updateAdminDesign(design._id, formData)
        : await createAdminDesign(formData);

      onSaved(saved);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.message ||
        'Unable to save the design. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Design name
        </label>

        <input
          name="name"
          required
          value={form.name}
          onChange={handleChange}
          className="input-field"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Description
        </label>

        <textarea
          name="description"
          required
          rows={3}
          value={form.description}
          onChange={handleChange}
          className="input-field resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Category
          </label>

          <select
            name="category"
            required
            value={form.category}
            onChange={handleChange}
            className="input-field"
          >
            <option value="">Select…</option>

            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Price (₦)
          </label>

          <input
            name="price"
            type="number"
            min="0"
            required
            value={form.price}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Stitch count
          </label>

          <input
            name="stitchCount"
            type="number"
            min="0"
            value={form.stitchCount}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Dimensions
          </label>

          <input
            name="dimensions"
            placeholder="e.g. 4x4 in"
            value={form.dimensions}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Colors
          </label>

          <input
            name="colors"
            type="number"
            min="0"
            value={form.colors}
            onChange={handleChange}
            className="input-field"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">
            Hoop size
          </label>

          <input
            name="hoopSize"
            value={form.hoopSize}
            onChange={handleChange}
            className="input-field"
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-sm font-medium text-ink">
          Preview image{' '}
          {design && (
            <span className="font-normal text-ink/40">
              (leave empty to keep current)
            </span>
          )}
        </label>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-line px-4 py-4 text-center text-xs text-ink/50 hover:border-brand/40 hover:bg-brand-mist/50">
          <UploadCloud size={16} />

          {previewImage
            ? previewImage.name
            : 'Click to upload PNG / JPEG / WEBP'}

          <input
            type="file"
            accept="image/png,image/jpeg,image/webp"
            className="hidden"
            onChange={handleImageChange}
          />
        </label>

        {previewImage && (
          <p className="mt-1.5 text-xs text-ink/50">
            Selected: {previewImage.name}
          </p>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary px-4 py-2 text-sm"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary px-4 py-2 text-sm"
        >
          {isSubmitting
            ? 'Saving…'
            : design
              ? 'Save Changes'
              : 'Create Design'}
        </button>
      </div>
    </form>
  );
}