import mongoose from 'mongoose';
import { REPAIR_STATUS, REPAIR_SERVICE_TYPES } from '../config/constants.js';

const fileMetaSchema = new mongoose.Schema(
  {
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

const repairRequestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    serviceType: {
      type: String,
      enum: Object.values(REPAIR_SERVICE_TYPES),
      required: [true, 'Service type is required'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: 2000,
    },
    additionalInstructions: {
      type: String,
      trim: true,
      maxlength: 1000,
      default: '',
    },
    // The customer's existing embroidery file that needs repair/modification.
    originalFile: {
      type: fileMetaSchema,
      required: true,
    },
    // Optional photo/reference of the desired outcome or the problem.
    referenceImage: {
      type: fileMetaSchema,
    },
    // Uploaded by admin once work is done.
    repairedFile: {
      type: fileMetaSchema,
    },
    status: {
      type: String,
      enum: Object.values(REPAIR_STATUS),
      default: REPAIR_STATUS.PENDING,
      index: true,
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

repairRequestSchema.index({ user: 1, status: 1 });
repairRequestSchema.index({ createdAt: -1 });

const RepairRequest = mongoose.model('RepairRequest', repairRequestSchema);

export default RepairRequest;
