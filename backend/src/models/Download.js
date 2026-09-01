import mongoose from 'mongoose';
import { DESIGN_FORMATS } from '../config/constants.js';

const downloadSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    design: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Design',
      required: true,
    },
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Order',
      required: true,
    },
    format: {
      type: String,
      enum: DESIGN_FORMATS,
      required: true,
    },
    ipAddress: {
      type: String,
    },
  },
  { timestamps: true }
);

downloadSchema.index({ user: 1, createdAt: -1 });

const Download = mongoose.model('Download', downloadSchema);

export default Download;
