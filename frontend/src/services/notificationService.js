import api from './api';

export const fetchNotifications = async (unreadOnly = false) => {
  const { data } = await api.get('/notifications', { params: unreadOnly ? { unreadOnly: 'true' } : {} });
  return data.data.notifications;
};

export const markNotificationRead = async (id) => {
  const { data } = await api.patch(`/notifications/${id}/read`);
  return data.data.notification;
};

export const markAllNotificationsRead = async () => {
  const { data } = await api.patch('/notifications/read-all');
  return data;
};
