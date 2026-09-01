import asyncHandler from '../utils/asyncHandler.js';
import * as notificationService from '../services/notificationService.js';

// @route  GET /api/notifications
// @access Private
export const getNotifications = asyncHandler(async (req, res) => {
  const unreadOnly = req.query.unreadOnly === 'true';
  const notifications = await notificationService.getUserNotifications(req.user._id, { unreadOnly });
  res.status(200).json({ success: true, data: { notifications } });
});

// @route  PATCH /api/notifications/:id/read
// @access Private
export const markAsRead = asyncHandler(async (req, res) => {
  const notification = await notificationService.markNotificationRead(req.params.id, req.user._id);
  res.status(200).json({ success: true, data: { notification } });
});

// @route  PATCH /api/notifications/read-all
// @access Private
export const markAllAsRead = asyncHandler(async (req, res) => {
  await notificationService.markAllNotificationsRead(req.user._id);
  res.status(200).json({ success: true, message: 'All notifications marked as read.' });
});
