import api from './api';

export const submitRepairRequest = async (formData) => {
  const { data } = await api.post('/repairs', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data.request;
};

export const fetchMyRepairRequests = async (params) => {
  const { data } = await api.get('/repairs/my', { params });
  return data.data; // { requests, pagination }
};

export const fetchRepairRequest = async (id) => {
  const { data } = await api.get(`/repairs/${id}`);
  return data.data.request;
};

export const downloadRepairFile = async (id, type, suggestedName) => {
  const response = await api.get(`/repairs/${id}/files/${type}`, { responseType: 'blob' });
  const disposition = response.headers['content-disposition'];
  const match = disposition?.match(/filename="?([^"]+)"?/);
  const filename = match?.[1] || suggestedName || 'file';

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
