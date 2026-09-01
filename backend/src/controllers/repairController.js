import asyncHandler from '../utils/asyncHandler.js';
import ApiError from '../utils/ApiError.js';
import * as repairService from '../services/repairService.js';

// ---- Customer ----

// @route  POST /api/repairs
// @access Private
export const createRepairRequest = asyncHandler(async (req, res) => {
  const request = await repairService.createRepairRequest(req.user._id, req.body, req.files);
  res.status(201).json({ success: true, message: 'Repair request submitted.', data: { request } });
});

// @route  GET /api/repairs/my
// @access Private
export const getMyRepairRequests = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await repairService.listMyRepairRequests(req.user._id, { page, limit });
  res.status(200).json({ success: true, data: result });
});

// @route  GET /api/repairs/:id
// @access Private
export const getRepairRequest = asyncHandler(async (req, res) => {
  const request = await repairService.getRepairRequestById(req.params.id, req.user);
  res.status(200).json({ success: true, data: { request } });
});

// @route  GET /api/repairs/:id/files/:type  (type: original | reference | repaired)
// @access Private
export const downloadRepairFile = asyncHandler(async (req, res) => {
  const { filePath, downloadName } = await repairService.resolveRepairFile(req.params.id, req.params.type, req.user);
  res.download(filePath, downloadName);
});

// ---- Admin ----

// @route  GET /api/admin/repairs
// @access Private/Admin
export const getRepairRequestsAdmin = asyncHandler(async (req, res) => {
  const { page, limit, status, search } = req.query;
  const result = await repairService.listAllRepairRequestsAdmin({ page, limit, status, search });
  res.status(200).json({ success: true, data: result });
});

// @route  PATCH /api/admin/repairs/:id/status
// @access Private/Admin
export const updateRepairStatus = asyncHandler(async (req, res) => {
  const request = await repairService.updateRepairStatus(req.params.id, req.body.status, req.user._id);
  res.status(200).json({ success: true, message: 'Repair status updated.', data: { request } });
});

// @route  POST /api/admin/repairs/:id/comments
// @access Private/Admin
export const addAdminComment = asyncHandler(async (req, res) => {
  const request = await repairService.addAdminComment(req.params.id, req.user._id, req.body.comment);
  res.status(200).json({ success: true, message: 'Comment added.', data: { request } });
});

// @route  POST /api/admin/repairs/:id/repaired-file
// @access Private/Admin
export const uploadRepairedFile = asyncHandler(async (req, res) => {
  if (!req.file) throw new ApiError(400, 'A repaired file is required.');
  const request = await repairService.uploadRepairedFile(req.params.id, req.file);
  res.status(200).json({ success: true, message: 'Repaired file uploaded.', data: { request } });
});
