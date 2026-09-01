import fs from 'fs';
import path from 'path';
import CustomDesignRequest from '../models/CustomDesignRequest.js';
import ApiError from '../utils/ApiError.js';
import generateReference from '../utils/generateReference.js';
import * as paystackService from './paystackService.js';
import { createNotification } from './notificationService.js';
import { NOTIFICATION_TYPES, CUSTOM_DESIGN_STATUS, PAYMENT_STATUS } from '../config/constants.js';

const REFERENCES_DIR = path.resolve('src/storage/custom-designs/references');
const COMPLETED_DIR = path.resolve('src/storage/custom-designs/completed');

const toFileMeta = (file) => ({
  storedFilename: file.filename,
  originalFilename: file.originalname,
  sizeBytes: file.size,
});

// ---- Customer ----

export const createCustomDesignRequest = async (userId, payload, referenceImageFile) => {
  const request = await CustomDesignRequest.create({
    user: userId,
    title: payload.title,
    category: payload.category,
    description: payload.description,
    preferredSize: payload.preferredSize,
    intendedUse: payload.intendedUse,
    preferredFormat: payload.preferredFormat,
    additionalInstructions: payload.additionalInstructions || '',
    referenceImage: referenceImageFile ? toFileMeta(referenceImageFile) : undefined,
    status: CUSTOM_DESIGN_STATUS.PENDING,
  });

  await createNotification({
    user: userId,
    type: NOTIFICATION_TYPES.CUSTOM_REQUEST_SUBMITTED,
    title: 'Custom design request submitted',
    message: 'Your request has been received. Our team will review it shortly.',
    link: '/dashboard/custom-designs',
  });

  return request;
};

export const listMyCustomDesignRequests = async (userId, { page = 1, limit = 10 } = {}) => {
  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(50, Math.max(1, Number(limit) || 10));
  const skip = (pageNum - 1) * limitNum;

  const [requests, total] = await Promise.all([
    CustomDesignRequest.find({ user: userId })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    CustomDesignRequest.countDocuments({ user: userId }),
  ]);

  return {
    requests,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};

const getOwnedRequest = async (id, requestingUser) => {
  const request = await CustomDesignRequest.findById(id);
  if (!request) throw new ApiError(404, 'Custom design request not found.');

  if (String(request.user) !== String(requestingUser._id) && requestingUser.role !== 'admin') {
    throw new ApiError(403, 'You do not have access to this request.');
  }
  return request;
};

export const getCustomDesignRequestById = async (id, requestingUser) => {
  const request = await CustomDesignRequest.findById(id)
    .populate('category', 'name slug')
    .populate('user', 'fullName email')
    .populate('adminComments.author', 'fullName role');
  if (!request) throw new ApiError(404, 'Custom design request not found.');

  if (String(request.user._id) !== String(requestingUser._id) && requestingUser.role !== 'admin') {
    throw new ApiError(403, 'You do not have access to this request.');
  }
  return request;
};

export const approveQuotation = async (id, user) => {
  const request = await getOwnedRequest(id, user);

  if (request.status !== CUSTOM_DESIGN_STATUS.AWAITING_CUSTOMER_APPROVAL) {
    throw new ApiError(400, 'This request does not have a quotation awaiting approval.');
  }

  request.status = request.quotation?.amount > 0
    ? CUSTOM_DESIGN_STATUS.AWAITING_PAYMENT
    : CUSTOM_DESIGN_STATUS.APPROVED;
  await request.save();

  return request;
};

export const rejectQuotation = async (id, user) => {
  const request = await getOwnedRequest(id, user);

  if (request.status !== CUSTOM_DESIGN_STATUS.AWAITING_CUSTOMER_APPROVAL) {
    throw new ApiError(400, 'This request does not have a quotation awaiting approval.');
  }

  request.status = CUSTOM_DESIGN_STATUS.CANCELLED;
  await request.save();

  return request;
};

// ---- Payment (self-contained — mirrors the design-purchase Paystack flow) ----

export const initializeCustomDesignPayment = async (id, user) => {
  const request = await getOwnedRequest(id, user);

  if (request.status !== CUSTOM_DESIGN_STATUS.AWAITING_PAYMENT) {
    throw new ApiError(400, 'This request is not awaiting payment.');
  }
  if (!request.quotation?.amount) {
    throw new ApiError(400, 'This request has no quotation amount set.');
  }

  const paystackReference = generateReference('CDR');
  const amountKobo = Math.round(request.quotation.amount * 100);
  const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';

  const transaction = await paystackService.initializeTransaction({
    email: user.email,
    amountKobo,
    reference: paystackReference,
    callbackUrl: `${clientUrl}/custom-design-payment/callback`,
    metadata: { requestId: String(request._id), userId: String(user._id) },
  });

  request.paystackReference = paystackReference;
  request.paymentStatus = PAYMENT_STATUS.PENDING;
  await request.save();

  return { authorizationUrl: transaction.authorization_url, reference: paystackReference };
};

export const verifyCustomDesignPayment = async (reference, user) => {
  const request = await CustomDesignRequest.findOne({ paystackReference: reference });
  if (!request) throw new ApiError(404, 'Payment record not found.');

  if (String(request.user) !== String(user._id) && user.role !== 'admin') {
    throw new ApiError(403, 'You do not have access to this payment.');
  }

  if (request.paymentStatus === PAYMENT_STATUS.SUCCESSFUL) {
    return request;
  }

  const transaction = await paystackService.verifyTransaction(reference);
  const expectedAmountKobo = Math.round(request.quotation.amount * 100);
  const isGenuinelySuccessful = transaction.status === 'success' && transaction.amount === expectedAmountKobo;

  if (isGenuinelySuccessful) {
    request.paymentStatus = PAYMENT_STATUS.SUCCESSFUL;
    request.paidAt = transaction.paid_at ? new Date(transaction.paid_at) : new Date();
    request.status = CUSTOM_DESIGN_STATUS.APPROVED;
    await request.save();

    await createNotification({
      user: request.user,
      type: NOTIFICATION_TYPES.CUSTOM_PAYMENT,
      title: 'Payment successful',
      message: 'Your payment was verified. Work on your custom design will begin shortly.',
      link: '/dashboard/custom-designs',
    });
  } else {
    request.paymentStatus = transaction.status === 'abandoned' ? PAYMENT_STATUS.CANCELLED : PAYMENT_STATUS.FAILED;
    await request.save();

    await createNotification({
      user: request.user,
      type: NOTIFICATION_TYPES.CUSTOM_PAYMENT,
      title: 'Payment not completed',
      message: 'Your payment could not be verified. You can try again from your dashboard.',
      link: '/dashboard/custom-designs',
    });
  }

  return request;
};

// ---- Secure file access ----

export const resolveReferenceImage = async (id, requestingUser) => {
  const request = await getOwnedRequest(id, requestingUser);
  if (!request.referenceImage) throw new ApiError(404, 'No reference image was uploaded for this request.');

  const filePath = path.join(REFERENCES_DIR, request.referenceImage.storedFilename);
  if (!fs.existsSync(filePath)) throw new ApiError(404, 'File missing from storage.');

  return { filePath, downloadName: request.referenceImage.originalFilename };
};

export const resolveCompletedFile = async (id, format, requestingUser) => {
  const request = await getOwnedRequest(id, requestingUser);

  if (request.status !== CUSTOM_DESIGN_STATUS.COMPLETED) {
    throw new ApiError(403, 'This design is not marked as completed yet.');
  }
  if (request.quotation?.amount > 0 && request.paymentStatus !== PAYMENT_STATUS.SUCCESSFUL) {
    throw new ApiError(403, 'Payment must be verified before downloading this file.');
  }

  const fileRecord = request.completedFiles.find((f) => f.format === format.toUpperCase());
  if (!fileRecord) throw new ApiError(404, `No ${format.toUpperCase()} file is available for this request.`);

  const filePath = path.join(COMPLETED_DIR, fileRecord.storedFilename);
  if (!fs.existsSync(filePath)) throw new ApiError(404, 'File missing from storage.');

  return { filePath, downloadName: fileRecord.originalFilename };
};

// ---- Admin ----

export const listAllCustomDesignRequestsAdmin = async ({ page = 1, limit = 20, status } = {}) => {
  const filter = {};
  if (status) filter.status = status;

  const pageNum = Math.max(1, Number(page) || 1);
  const limitNum = Math.min(100, Math.max(1, Number(limit) || 20));
  const skip = (pageNum - 1) * limitNum;

  const [requests, total] = await Promise.all([
    CustomDesignRequest.find(filter)
      .populate('user', 'fullName email')
      .populate('category', 'name slug')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum),
    CustomDesignRequest.countDocuments(filter),
  ]);

  return {
    requests,
    pagination: { page: pageNum, limit: limitNum, total, totalPages: Math.max(1, Math.ceil(total / limitNum)) },
  };
};

export const sendQuotation = async (id, { amount, notes }, adminId) => {
  const request = await CustomDesignRequest.findById(id);
  if (!request) throw new ApiError(404, 'Custom design request not found.');

  request.quotation = { amount, notes, sentAt: new Date() };
  request.status = CUSTOM_DESIGN_STATUS.AWAITING_CUSTOMER_APPROVAL;
  request.reviewedBy = adminId;
  await request.save();

  await createNotification({
    user: request.user,
    type: NOTIFICATION_TYPES.CUSTOM_QUOTATION,
    title: 'Quotation ready',
    message: `A quotation of ₦${amount.toLocaleString()} is ready for your review.`,
    link: '/dashboard/custom-designs',
  });

  return request;
};

export const updateCustomDesignStatus = async (id, status, adminId) => {
  const request = await CustomDesignRequest.findById(id);
  if (!request) throw new ApiError(404, 'Custom design request not found.');

  if (status === CUSTOM_DESIGN_STATUS.COMPLETED && request.completedFiles.length === 0) {
    throw new ApiError(400, 'Upload at least one completed file before marking this request as completed.');
  }

  request.status = status;
  request.reviewedBy = adminId;
  if (status === CUSTOM_DESIGN_STATUS.COMPLETED) request.completedAt = new Date();
  await request.save();

  const copy = {
    [CUSTOM_DESIGN_STATUS.UNDER_REVIEW]: 'Your custom design request is under review.',
    [CUSTOM_DESIGN_STATUS.IN_PROGRESS]: 'Work has started on your custom design.',
    [CUSTOM_DESIGN_STATUS.REVISION_REQUESTED]: 'A revision is being made to your design.',
    [CUSTOM_DESIGN_STATUS.COMPLETED]: 'Your custom design is complete and ready to download!',
    [CUSTOM_DESIGN_STATUS.REJECTED]: 'Your custom design request was not accepted. Check admin comments for details.',
  };

  await createNotification({
    user: request.user,
    type: status === CUSTOM_DESIGN_STATUS.COMPLETED ? NOTIFICATION_TYPES.CUSTOM_COMPLETED : NOTIFICATION_TYPES.CUSTOM_PROGRESS,
    title: status === CUSTOM_DESIGN_STATUS.COMPLETED ? 'Custom design completed' : 'Request status updated',
    message: copy[status] || `Your request status changed to ${status}.`,
    link: '/dashboard/custom-designs',
  });

  return request;
};

export const addAdminComment = async (id, adminId, comment) => {
  const request = await CustomDesignRequest.findById(id);
  if (!request) throw new ApiError(404, 'Custom design request not found.');

  request.adminComments.push({ author: adminId, comment });
  await request.save();

  await createNotification({
    user: request.user,
    type: NOTIFICATION_TYPES.CUSTOM_PROGRESS,
    title: 'New comment on your custom design request',
    message: comment.length > 100 ? `${comment.slice(0, 100)}…` : comment,
    link: '/dashboard/custom-designs',
  });

  return CustomDesignRequest.findById(id).populate('adminComments.author', 'fullName role');
};

export const uploadCompletedFile = async (id, file, format) => {
  const request = await CustomDesignRequest.findById(id);
  if (!request) throw new ApiError(404, 'Custom design request not found.');

  request.completedFiles = request.completedFiles.filter((f) => f.format !== format);
  request.completedFiles.push({ format, ...toFileMeta(file) });
  await request.save();

  return request;
};

export const uploadPreviewImage = async (id, file) => {
  const request = await CustomDesignRequest.findByIdAndUpdate(
    id,
    { previewImage: `/assets/images/designs/${file.filename}` },
    { new: true }
  );
  if (!request) throw new ApiError(404, 'Custom design request not found.');
  return request;
};
