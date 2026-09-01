import { useState } from 'react';
import { UploadCloud, FileCheck2, AlertCircle } from 'lucide-react';
import { uploadDesignFile } from '../../services/adminService';

const FORMATS = ['EMB', 'EMX', 'DST'];

export default function DesignFileUploadPanel({ design, onUpdated }) {
  const [uploadingFormat, setUploadingFormat] = useState('');
  const [error, setError] = useState('');

  const handleUpload = async (format, file) => {
    if (!file) return;
    setError('');
    setUploadingFormat(format);
    try {
      const formData = new FormData();
      formData.append('format', format);
      formData.append('file', file);
      const updated = await uploadDesignFile(design._id, formData);
      onUpdated(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setUploadingFormat('');
    }
  };

  return (
    <div>
      <p className="text-sm font-medium text-ink">Protected embroidery files</p>
      <p className="mt-0.5 text-xs text-ink/50">Uploaded here, never in the public preview folder — only unlocked after a verified purchase.</p>

      {error && (
        <div className="mt-3 flex items-start gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <AlertCircle size={16} className="mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <div className="mt-3 grid grid-cols-3 gap-3">
        {FORMATS.map((format) => {
          const uploaded = design.protectedFiles?.find((f) => f.format === format);
          return (
            <label
              key={format}
              className="flex cursor-pointer flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-line px-3 py-4 text-center text-xs hover:border-brand/40 hover:bg-brand-mist/50"
            >
              {uploaded ? <FileCheck2 size={16} className="text-brand" /> : <UploadCloud size={16} className="text-ink/40" />}
              <span className={uploaded ? 'font-medium text-brand' : 'text-ink/50'}>
                {uploadingFormat === format ? 'Uploading…' : `.${format}`}
              </span>
              {uploaded && <span className="truncate text-[10px] text-ink/40">{uploaded.originalFilename}</span>}
              <input
                type="file"
                className="hidden"
                onChange={(e) => handleUpload(format, e.target.files?.[0])}
              />
            </label>
          );
        })}
      </div>
    </div>
  );
}
