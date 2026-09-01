import asyncHandler from '../utils/asyncHandler.js';
import * as downloadService from '../services/downloadService.js';

// @route  GET /api/downloads/my
// @access Private
export const getMyDownloads = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await downloadService.listMyDownloads(req.user._id, { page, limit });
  res.status(200).json({ success: true, data: result });
});

// @route  GET /api/downloads/:designId/:format
// @access Private
// Streams the protected file only after ownership + verified-payment checks pass.
export const downloadDesignFile = asyncHandler(async (req, res) => {
  const { designId, format } = req.params;
  const ipAddress = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || req.socket.remoteAddress;

  const { filePath, downloadName } = await downloadService.resolveProtectedFile({
    userId: req.user._id,
    designId,
    format,
    ipAddress,
  });

  res.download(filePath, downloadName);
});
