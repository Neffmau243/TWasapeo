import apiClient from './api';

export const search = async (params: any) => {
  const response = await apiClient.get('/search', { params });
  return response.data;
};

export const autocomplete = async (query: string) => {
  const response = await apiClient.get('/search/autocomplete', { params: { q: query } });
  return response.data;
};
