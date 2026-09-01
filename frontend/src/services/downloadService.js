import api from './api';

export const fetchMyDownloads = async (params) => {
  const { data } = await api.get('/downloads/my', { params });
  return data.data; // { downloads, pagination }
};

/**
 * Downloads a protected design file. The backend only serves this after
 * verifying the requester owns a paid order for the design, so the auth
 * header (attached by the shared axios instance) is what grants access.
 */
export const downloadDesignFile = async (designId, format) => {
  const response = await api.get(`/downloads/${designId}/${format}`, { responseType: 'blob' });

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
