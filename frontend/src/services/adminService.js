import api from './api';

// ---- Stats & Reports ----
export const fetchAdminStats = async () => {
  const { data } = await api.get('/admin/stats');
  return data.data.stats;
};

export const fetchAdminReports = async (params) => {
  const { data } = await api.get('/admin/reports', { params });
  return data.data.report;
};

// ---- Designs ----
export const fetchAdminDesigns = async (params) => {
  const { data } = await api.get('/admin/designs', { params });
  return data.data;
};

export const fetchAdminDesign = async (id) => {
  const { data } = await api.get(`/admin/designs/${id}`);
  return data.data.design;
};

export const createAdminDesign = async (formData) => {
  const { data } = await api.post('/admin/designs', formData);
  return data.data.design;
};

export const updateAdminDesign = async (id, formData) => {
  const { data } = await api.put(`/admin/designs/${id}`, formData);
  return data.data.design;
};

export const setDesignStatus = async (id, status) => {
  const { data } = await api.patch(`/admin/designs/${id}/status`, { status });
  return data.data.design;
};

export const deleteAdminDesign = async (id) => {
  const { data } = await api.delete(`/admin/designs/${id}`);
  return data;
};

export const uploadDesignFile = async (id, formData) => {
  const { data } = await api.post(`/admin/designs/${id}/files`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.data.design;
};

// ---- Categories ----
export const fetchAdminCategories = async () => {
  const { data } = await api.get('/admin/categories');
  return data.data.categories;
};

export const createCategory = async (payload) => {
  const { data } = await api.post('/categories', payload);
  return data.data.category;
};

export const updateCategory = async (id, payload) => {
  const { data } = await api.put(`/categories/${id}`, payload);
  return data.data.category;
};

export const deleteCategory = async (id) => {
  const { data } = await api.delete(`/categories/${id}`);
  return data;
};

// ---- Customers ----
export const fetchAdminCustomers = async (params) => {
  const { data } = await api.get('/admin/customers', { params });
  return data.data;
};

export const fetchAdminCustomerDetail = async (id) => {
  const { data } = await api.get(`/admin/customers/${id}`);
  return data.data;
};

export const updateCustomerStatus = async (id, status) => {
  const { data } = await api.patch(`/admin/customers/${id}/status`, { status });
  return data.data.customer;
};

// ---- Orders / Payments / Downloads ----
export const fetchAdminOrders = async (params) => {
  const { data } = await api.get('/admin/orders', { params });
  return data.data;
};

export const fetchAdminPayments = async (params) => {
  const { data } = await api.get('/admin/payments', { params });
  return data.data;
};

export const fetchAdminDownloads = async (params) => {
  const { data } = await api.get('/admin/downloads', { params });
  return data.data;
};

// ---- Repairs ----
export const fetchAdminRepairs = async (params) => {
  const { data } = await api.get('/admin/repairs', { params });
  return data.data;
};

export const fetchRepairDetail = async (id) => {
  const { data } = await api.get(`/repairs/${id}`);
  return data.data.request;
};

export const updateRepairStatusAdmin = async (id, status) => {
  const { data } = await api.patch(`/admin/repairs/${id}/status`, { status });
  return data.data.request;
};

export const addRepairComment = async (id, comment) => {
  const { data } = await api.post(`/admin/repairs/${id}/comments`, { comment });
  return data.data.request;
};

export const uploadRepairedFileAdmin = async (id, formData) => {
  const { data } = await api.post(`/admin/repairs/${id}/repaired-file`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.data.request;
};

// ---- Custom Designs ----
export const fetchAdminCustomDesigns = async (params) => {
  const { data } = await api.get('/admin/custom-designs', { params });
  return data.data;
};

export const fetchCustomDesignDetailAdmin = async (id) => {
  const { data } = await api.get(`/custom-designs/${id}`);
  return data.data.request;
};

export const sendQuotationAdmin = async (id, payload) => {
  const { data } = await api.post(`/admin/custom-designs/${id}/quotation`, payload);
  return data.data.request;
};

export const updateCustomDesignStatusAdmin = async (id, status) => {
  const { data } = await api.patch(`/admin/custom-designs/${id}/status`, { status });
  return data.data.request;
};

export const addCustomDesignCommentAdmin = async (id, comment) => {
  const { data } = await api.post(`/admin/custom-designs/${id}/comments`, { comment });
  return data.data.request;
};

export const uploadCustomDesignCompletedFileAdmin = async (id, formData) => {
  const { data } = await api.post(`/admin/custom-designs/${id}/completed-files`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.data.request;
};

export const uploadCustomDesignPreviewAdmin = async (id, formData) => {
  const { data } = await api.post(`/admin/custom-designs/${id}/preview-image`, formData, { headers: { 'Content-Type': 'multipart/form-data' } });
  return data.data.request;
};
