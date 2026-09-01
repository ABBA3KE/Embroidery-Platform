import api from './api';

export const registerRequest = async (payload) => {
  const { data } = await api.post('/auth/register', payload);
  return data.data;
};

export const loginRequest = async (payload) => {
  const { data } = await api.post('/auth/login', payload);
  return data.data;
};

export const logoutRequest = async () => {
  const { data } = await api.post('/auth/logout');
  return data;
};

export const getMeRequest = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};

export const forgotPasswordRequest = async (email) => {
  const { data } = await api.post('/auth/forgot-password', { email });
  return data;
};

export const resetPasswordRequest = async (payload) => {
  const { data } = await api.post('/auth/reset-password', payload);
  return data.data;
};
