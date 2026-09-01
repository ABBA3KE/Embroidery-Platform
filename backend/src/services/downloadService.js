import fs from 'fs';
import path from 'path';
import Design from '../models/Design.js';
import Order from '../models/Order.js';
import Download from '../models/Download.js';
import ApiError from '../utils/ApiError.js';
import { ORDER_STATUS } from '../config/constants.js';

const FORMAT_TO_FOLDER = { EMB: 'emb', EMX: 'emx', DST: 'dst', PNG: 'png' };
const STORAGE_BASE = path.resolve('src/storage/design-files');

/**
 * Resolves a protected file for download only after verifying, in order:
 * 1. The design exists and offers a file in the requested format.
 * 2. The requesting user has an order for this design with status "paid"
 *    (i.e. a Paystack payment has been server-side verified as successful).
 * 3. The file still exists on disk.
 * Every successful resolution is logged to the Download collection.
 */
export const resolveProtectedFile = async ({ userId, designId, format, ipAddress }) => {
  const normalizedFormat = format.toUpperCase();

  const design = await Design.findById(designId);
  if (!design) throw new ApiError(404, 'Design not found.');

  const fileRecord = design.protectedFiles.find((f) => f.format === normalizedFormat);
  if (!fileRecord) {
    throw new ApiError(404, `This design does not have a ${normalizedFormat} file available.`);
  }

  const paidOrder = await Order.findOne({ user: userId, design: designId, status: ORDER_STATUS.PAID }).sort({
    createdAt: -1,
  });
  if (!paidOrder) {
    throw new ApiError(403, 'You must complete a verified purchase before downloading this file.');
  }

  const filePath = path.join(STORAGE_BASE, FORMAT_TO_FOLDER[normalizedFormat], fileRecord.storedFilename);
  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, 'The requested file is missing from storage. Please contact support.');
  }

  await Download.create({
    user: userId,
    design: designId,
    order: paidOrder._id,
    format: normalizedFormat,
    ipAddress,
  });

  return { filePath, downloadName: fileRecord.originalFilename };
};

export const listMyDownloads = async (userId, { page = 1, limit = 20 } = {}) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [downloads, total] = await Promise.all([
    Download.find({ user: userId })
      .populate('design', 'name slug previewImage')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    Download.countDocuments({ user: userId }),
  ]);

  return {
    downloads,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};
