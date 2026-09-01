import api from './api';

export const fetchCategories = async () => {
  const { data } = await api.get('/categories');
  return data.data.categories;
};

export const fetchCategoryBySlug = async (slug) => {
  const { data } = await api.get(`/categories/${slug}`);
  return data.data.category;
};
