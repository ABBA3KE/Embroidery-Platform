import api from './api';

export const initializePayment = async (orderId) => {
  const { data } = await api.post('/payments/initialize', { orderId });
  return data.data; // { authorizationUrl, reference }
};

export const verifyPayment = async (reference) => {
  const { data } = await api.get(`/payments/verify/${reference}`);
  return data.data; // { order, payment }
};
