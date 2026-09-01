import mongoose from 'mongoose';
import { ORDER_STATUS } from '../config/constants.js';

const orderSchema = new mongoose.Schema(
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
    orderReference: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Snapshot of the design price at the time of order — protects the
    // customer and the ledger from later price changes on the design.
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    currency: {
      type: String,
      default: 'NGN',
    },
    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
      index: true,
    },
    paidAt: {
      type: Date,
    },
  },
  { timestamps: true }
);

orderSchema.index({ user: 1, status: 1 });
orderSchema.index({ createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
