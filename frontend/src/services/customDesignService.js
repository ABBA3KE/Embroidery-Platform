import api from './api';

export const submitCustomDesignRequest = async (formData) => {
  const { data } = await api.post('/custom-designs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.request;
};

export const fetchMyCustomDesignRequests = async (params) => {
  const { data } = await api.get('/custom-designs/my', { params });
  return data.data; // { requests, pagination }
};

export const fetchCustomDesignRequest = async (id) => {
  const { data } = await api.get(`/custom-designs/${id}`);
  return data.data.request;
};

export const approveQuotation = async (id) => {
  const { data } = await api.post(`/custom-designs/${id}/approve-quotation`);
  return data.data.request;
};

export const rejectQuotation = async (id) => {
  const { data } = await api.post(`/custom-designs/${id}/reject-quotation`);
  return data.data.request;
};

export const initializeCustomDesignPayment = async (id) => {
  const { data } = await api.post(`/custom-designs/${id}/payment/initialize`);
  return data.data; // { authorizationUrl, reference }
};

export const verifyCustomDesignPayment = async (reference) => {
  const { data } = await api.get(`/custom-designs/payment/verify/${reference}`);
  return data.data.request;
};

export const downloadCompletedFile = async (id, format) => {
  const response = await api.get(`/custom-designs/${id}/files/${format}`, { responseType: 'blob' });
  const disposition = response.headers['content-disposition'];
  const match = disposition?.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] || `design.${format.toLowerCase()}`;

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
