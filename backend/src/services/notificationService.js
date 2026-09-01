import Notification from '../models/Notification.js';

/**
 * Creates an in-app notification for a user. Used by auth, orders,
 * repairs, and custom-design services so notification logic lives
 * in one place instead of being duplicated across controllers.
 */
export const createNotification = async ({ user, type, title, message, link = null }) => {
  return Notification.create({ user, type, title, message, link });
};

export const getUserNotifications = async (userId, { unreadOnly = false } = {}) => {
  const filter = { user: userId };
  if (unreadOnly) filter.isRead = false;
  return Notification.find(filter).sort({ createdAt: -1 });
};

export const markNotificationRead = async (notificationId, userId) => {
  return Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { isRead: true },
    { new: true }
  );
};

export const markAllNotificationsRead = async (userId) => {
  return Notification.updateMany({ user: userId, isRead: false }, { isRead: true });
};
