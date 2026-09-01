import api from './api';

export const createOrder = async (designId) => {
  const { data } = await api.post('/orders', { designId });
  return data.data.order;
};

export const fetchMyOrders = async (params) => {
  const { data } = await api.get('/orders/my', { params });
  return data.data; // { orders, pagination }
};

export const fetchOrder = async (orderId) => {
  const { data } = await api.get(`/orders/${orderId}`);
  return data.data.order;
};
