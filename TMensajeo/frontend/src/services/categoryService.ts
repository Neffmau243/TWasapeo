import apiClient from './api';

export const getCategories = async () => {
  const response = await apiClient.get('/categories');
  return response.data;
};

export const getCategoryBySlug = async (slug: string) => {
  const response = await apiClient.get(`/categories/${slug}`);
  return response.data;
};
