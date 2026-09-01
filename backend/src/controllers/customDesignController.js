import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import * as customDesignService from '../services/customDesignService.js';

// ---- Customer ----

// @route  POST /api/custom-designs
// @access Private
export const createCustomDesignRequest = asyncHandler(async (req, res) => {
  const request = await customDesignService.createCustomDesignRequest(req.user._id, req.body, req.file);
  res.status(201).json({ success: true, message: 'Custom design request submitted.', data: { request } });
});

// @route  GET /api/custom-designs/my
// @access Private
export const getMyCustomDesignRequests = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await customDesignService.listMyCustomDesignRequests(req.user._id, { page, limit });
  res.status(200).json({ success: true, data: result });
});

// @route  GET /api/custom-designs/:id
// @access Private
export const getCustomDesignRequest = asyncHandler(async (req, res) => {
  const request = await customDesignService.getCustomDesignRequestById(req.params.id, req.user);
  res.status(200).json({ success: true, data: { request } });
});

// @route  POST /api/custom-designs/:id/approve-quotation
// @access Private
export const approveQuotation = asyncHandler(async (req, res) => {
  const request = await customDesignService.approveQuotation(req.params.id, req.user);
  res.status(200).json({ success: true, message: 'Quotation approved.', data: { request } });
});

// @route  POST /api/custom-designs/:id/reject-quotation
// @access Private
export const rejectQuotation = asyncHandler(async (req, res) => {
  const request = await customDesignService.rejectQuotation(req.params.id, req.user);
  res.status(200).json({ success: true, message: 'Quotation rejected.', data: { request } });
});

// @route  POST /api/custom-designs/:id/payment/initialize
// @access Private
export const initializePayment = asyncHandler(async (req, res) => {
  const { authorizationUrl, reference } = await customDesignService.initializeCustomDesignPayment(req.params.id, req.user);
  res.status(200).json({ success: true, message: 'Payment initialized.', data: { authorizationUrl, reference } });
});

// @route  GET /api/custom-designs/payment/verify/:reference
// @access Private
export const verifyPayment = asyncHandler(async (req, res) => {
  const request = await customDesignService.verifyCustomDesignPayment(req.params.reference, req.user);
  res.status(200).json({
    success: true,
    message: request.paymentStatus === 'successful' ? 'Payment verified successfully.' : 'Payment was not successful.',
    data: { request },
  });
});

// @route  GET /api/custom-designs/:id/reference-image
// @access Private
export const downloadReferenceImage = asyncHandler(async (req, res) => {
  const { filePath, downloadName } = await customDesignService.resolveReferenceImage(req.params.id, req.user);
  res.download(filePath, downloadName);
});

// @route  GET /api/custom-designs/:id/files/:format
// @access Private
export const downloadCompletedFile = asyncHandler(async (req, res) => {
  const { filePath, downloadName } = await customDesignService.resolveCompletedFile(req.params.id, req.params.format, req.user);
  res.download(filePath, downloadName);
});

// ---- Admin ----

// @route  GET /api/admin/custom-designs
// @access Private/Admin
export const getCustomDesignRequestsAdmin = asyncHandler(async (req, res) => {
  const { page, limit, status } = req.query;
  const result = await customDesignService.listAllCustomDesignRequestsAdmin({ page, limit, status });
  res.status(200).json({ success: true, data: result });
});

// @route  POST /api/admin/custom-designs/:id/quotation
// @access Private/Admin
export const sendQuotation = asyncHandler(async (req, res) => {
  const { amount, notes } = req.body;
  const request = await customDesignService.sendQuotation(req.params.id, { amount, notes }, req.user._id);
  res.status(200).json({ success: true, message: 'Quotation sent.', data: { request } });
});

// @route  PATCH /api/admin/custom-designs/:id/status
// @access Private/Admin
export const updateStatus = asyncHandler(async (req, res) => {
  const request = await customDesignService.updateCustomDesignStatus(req.params.id, req.body.status, req.user._id);
  res.status(200).json({ success: true, message: 'Status updated.', data: { request } });
});

// @route  POST /api/admin/custom-designs/:id/comments
// @access Private/Admin
export const addAdminComment = asyncHandler(async (req, res) => {
  const request = await customDesignService.addAdminComment(req.params.id, req.user._id, req.body.comment);
  res.status(200).json({ success: true, message: 'Comment added.', data: { request } });
});

// @route  POST /api/admin/custom-designs/:id/completed-files
// @access Private/Admin
export const uploadCompletedFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'A completed file is required.');
  const request = await customDesignService.uploadCompletedFile(req.params.id, req.file, req.body.format.toUpperCase());
  res.status(200).json({ success: true, message: 'Completed file uploaded.', data: { request } });
});

// @route  POST /api/admin/custom-designs/:id/preview-image
// @access Private/Admin
export const uploadPreviewImage = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'A preview image is required.');
  const request = await customDesignService.uploadPreviewImage(req.params.id, req.file);
  res.status(200).json({ success: true, message: 'Preview image uploaded.', data: { request } });
});
