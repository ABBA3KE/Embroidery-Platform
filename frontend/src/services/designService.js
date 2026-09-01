import api from './api';

export const fetchDesigns = async (params) => {
  const { data } = await api.get('/designs', { params });
  return data.data; // { designs, pagination }
};

export const fetchDesignBySlug = async (slug) => {
  const { data } = await api.get(`/designs/${slug}`);
  return data.data.design;
};
