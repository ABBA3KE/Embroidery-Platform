import fs from 'fs';
import path from 'path';
import RepairRequest from '../models/RepairRequest.js';
import ApiError from '../utils/ApiError.js';
import { createNotification } from './notificationService.js';
import { NOTIFICATION_TYPES, REPAIR_STATUS } from '../config/constants.js';

const REPAIR_DIR = path.resolve('src/uploads/repairs');

const toFileMeta = (file) => ({
  storedFilename: file.filename,
  originalFilename: file.originalname,
  sizeBytes: file.size,
});

export const createRepairRequest = async (userId, payload, files) => {
  const originalFile = files?.originalFile?.[0];
  if (!originalFile) {
    throw new ApiError(400, 'The embroidery file that needs repair is required.');
  }
  const referenceImage = files?.referenceImage?.[0];

  const repairRequest = await RepairRequest.create({
    user: userId,
    serviceType: payload.serviceType,
    description: payload.description,
    additionalInstructions: payload.additionalInstructions || '',
    originalFile: toFileMeta(originalFile),
    referenceImage: referenceImage ? toFileMeta(referenceImage) : undefined,
    status: REPAIR_STATUS.PENDING,
  });

  await createNotification({
    user: userId,
    type: NOTIFICATION_TYPES.REPAIR_SUBMITTED,
    title: 'Repair request submitted',
    message: 'Your repair request has been received and is pending review.',
    link: '/dashboard/repairs',
  });

  return repairRequest;
};

export const listMyRepairRequests = async (userId, { page = 1, limit = 10 } = {}) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [requests, total] = await Promise.all([
    RepairRequest.find({ user: userId }).sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    RepairRequest.countDocuments({ user: userId }),
  ]);

  return {
    requests,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};

export const getRepairRequestById = async (id, requestingUser) => {
  const request = await RepairRequest.findById(id)
    .populate('user', 'fullName email')
    .populate('adminComments.author', 'fullName role');
  if (!request) throw new ApiError(404, 'Repair request not found.');

  if (String(request.user._id) !== String(requestingUser._id) && requestingUser.role !== 'admin') {
    throw new ApiError(403, 'You do not have access to this repair request.');
  }

  return request;
};

// ---- Admin ----

export const listAllRepairRequestsAdmin = async ({ page = 1, limit = 20, status, search } = {}) => {
  const filter = {};
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  let query = RepairRequest.find(filter).populate('user', 'fullName email');

  if (search) {
    query = query.populate({
      path: 'user',
      match: { $or: [{ fullName: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }] },
    });
  }

  const [requests, total] = await Promise.all([
    query.sort({ createdAt: -1 }).skip(skip).limit(limitNum),
    RepairRequest.countDocuments(filter),
  ]);

  return {
    requests: search ? requests.filter((r) => r.user) : requests,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};

export const updateRepairStatus = async (id, status, adminId) => {
  const request = await RepairRequest.findById(id);
  if (!request) throw new ApiError(404, 'Repair request not found.');

  if (status === REPAIR_STATUS.COMPLETED && !request.repairedFile) {
    throw new ApiError(400, 'Upload the repaired file before marking this request as completed.');
  }

  request.status = status;
  request.reviewedBy = adminId;
  if (status === REPAIR_STATUS.COMPLETED) request.completedAt = new Date();
  await request.save();

  const notificationCopy = {
    [REPAIR_STATUS.UNDER_REVIEW]: 'Your repair request is now under review.',
    [REPAIR_STATUS.ACCEPTED]: 'Your repair request has been accepted and will begin shortly.',
    [REPAIR_STATUS.REJECTED]: 'Your repair request was not accepted. Check admin comments for details.',
    [REPAIR_STATUS.IN_PROGRESS]: 'Work has started on your repair request.',
    [REPAIR_STATUS.COMPLETED]: 'Your repair is complete! The repaired file is ready to download.',
  };

  await createNotification({
    user: request.user,
    type: status === REPAIR_STATUS.COMPLETED ? NOTIFICATION_TYPES.REPAIR_COMPLETED : NOTIFICATION_TYPES.REPAIR_STATUS,
    title: status === REPAIR_STATUS.COMPLETED ? 'Repair completed' : 'Repair status updated',
    message: notificationCopy[status] || `Your repair request status changed to ${status}.`,
    link: '/dashboard/repairs',
  });

  return request;
};

export const addAdminComment = async (id, adminId, comment) => {
  const request = await RepairRequest.findById(id);
  if (!request) throw new ApiError(404, 'Repair request not found.');

  request.adminComments.push({ author: adminId, comment });
  await request.save();

  await createNotification({
    user: request.user,
    type: NOTIFICATION_TYPES.REPAIR_STATUS,
    title: 'New comment on your repair request',
    message: comment.length > 100 ? `${comment.slice(0, 100)}…` : comment,
    link: '/dashboard/repairs',
  });

  return RepairRequest.findById(id).populate('adminComments.author', 'fullName role');
};

export const uploadRepairedFile = async (id, file) => {
  const request = await RepairRequest.findById(id);
  if (!request) throw new ApiError(404, 'Repair request not found.');

  request.repairedFile = toFileMeta(file);
  await request.save();

  return request;
};

// ---- Secure file access (original / reference / repaired) ----

const FIELD_TO_KEY = { original: 'originalFile', reference: 'referenceImage', repaired: 'repairedFile' };

export const resolveRepairFile = async (id, type, requestingUser) => {
  const key = FIELD_TO_KEY[type];
  if (!key) throw new ApiError(400, 'Invalid file type requested.');

  const request = await RepairRequest.findById(id);
  if (!request) throw new ApiError(404, 'Repair request not found.');

  if (String(request.user) !== String(requestingUser._id) && requestingUser.role !== 'admin') {
    throw new ApiError(403, 'You do not have access to this file.');
  }

  const fileMeta = request[key];
  if (!fileMeta) throw new ApiError(404, 'This file has not been uploaded yet.');

  const filePath = path.join(REPAIR_DIR, fileMeta.storedFilename);
  if (!fs.existsSync(filePath)) {
    throw new ApiError(404, 'The requested file is missing from storage. Please contact support.');
  }

  return { filePath, downloadName: fileMeta.originalFilename };
};
