import mongoose from 'mongoose';
import { DESIGN_FORMATS } from '../config/constants.js';

const protectedFileSchema = new mongoose.Schema(
  {
    format: {
      type: String,
      enum: DESIGN_FORMATS,
      required: true,
    },
    // Path relative to backend/src/storage/design-files/<format-folder>/ — never a public URL.
    storedFilename: {
      type: String,
      required: true,
    },
    originalFilename: {
      type: String,
      required: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
    },
  },
  { _id: false }
);

const designSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Design name is required'],
      trim: true,
      maxlength: [120, 'Design name cannot exceed 120 characters'],
    },
    slug: {
      type: String,
      unique: true,
      index: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    // Public, non-sensitive preview image — safe to serve from frontend/public.
    previewImage: {
      type: String,
      required: [true, 'A preview image is required'],
    },
    // Additional gallery/preview images (still public).
    gallery: {
      type: [String],
      default: [],
    },
    specifications: {
      stitchCount: { type: Number },
      dimensions: { type: String }, // e.g. "4x4 inches"
      colors: { type: Number },
      hoopSize: { type: String },
    },
    availableFormats: {
      type: [String],
      enum: DESIGN_FORMATS,
      default: [],
    },
    // Protected, never publicly linked — only served after verified purchase.
    protectedFiles: {
      type: [protectedFileSchema],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published'],
      default: 'draft',
      index: true,
    },
    purchaseCount: {
      type: Number,
      default: 0,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  { timestamps: true }
);

designSchema.pre('validate', function generateSlug(next) {
  if (this.name && (this.isModified('name') || !this.slug)) {
    const base = this.name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    this.slug = `${base}-${Math.random().toString(36).slice(2, 7)}`;
  }
  next();
});

// Frequently queried fields
designSchema.index({ status: 1, category: 1 });
designSchema.index({ name: 'text', description: 'text' });
designSchema.index({ price: 1 });
designSchema.index({ createdAt: -1 });
designSchema.index({ purchaseCount: -1 });

designSchema.methods.toPublicObject = function toPublicObject() {
  const obj = this.toObject();
  delete obj.protectedFiles; // never expose stored filenames/paths publicly
  delete obj.__v;
  return obj;
};

const Design = mongoose.model('Design', designSchema);

export default Design;
