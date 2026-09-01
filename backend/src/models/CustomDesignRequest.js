import mongoose from 'mongoose';
import { CUSTOM_DESIGN_STATUS, PAYMENT_STATUS, DESIGN_FORMATS } from '../config/constants.js';

const fileMetaSchema = new mongoose.Schema(
  {
    storedFilename: { type: String, required: true },
    originalFilename: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
  },
  { _id: false }
);

const completedFileSchema = new mongoose.Schema(
  {
    format: { type: String, enum: DESIGN_FORMATS, required: true },
    storedFilename: { type: String, required: true },
    originalFilename: { type: String, required: true },
    sizeBytes: { type: Number, required: true },
  },
  { _id: false }
);

const commentSchema = new mongoose.Schema(
  {
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    comment: { type: String, required: true, trim: true, maxlength: 1000 },
  },
  { timestamps: true }
);

const customDesignRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    title: {
      type: String,
      required: [true, 'Design title is required'],
      trim: true,
      maxlength: 120,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2000,
    },
    preferredSize: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    intendedUse: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    preferredFormat: {
      type: String,
      enum: DESIGN_FORMATS,
    },
    additionalInstructions: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    referenceImage: {
      type: fileMetaSchema,
    },

    status: {
      type: String,
      enum: Object.values(CUSTOM_DESIGN_STATUS),
      default: CUSTOM_DESIGN_STATUS.PENDING,
      index: true,
    },

    quotation: {
      amount: { type: Number, min: 0 },
      notes: { type: String, trim: true, maxlength: 1000 },
      sentAt: { type: Date },
    },

    paymentStatus: {
      type: String,
      enum: Object.values(PAYMENT_STATUS),
    },
    paystackReference: {
      type: String,
      unique: true,
      sparse: true,
    },
    paidAt: {
      type: Date,
    },

    // Public preview of the finished design (safe to display before download).
    previewImage: {
      type: String,
    },
    // Protected — only downloadable once status is "completed".
    completedFiles: {
      type: [completedFileSchema],
      default: [],
    },

    adminComments: {
      type: [commentSchema],
      default: [],
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    completedAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

customDesignRequestSchema.index({ user: 1, status: 1 });
customDesignRequestSchema.index({ createdAt: -1 });

const CustomDesignRequest = mongoose.model('CustomDesignRequest', customDesignRequestSchema);

export default CustomDesignRequest;
