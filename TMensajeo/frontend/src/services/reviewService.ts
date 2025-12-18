import apiClient from './api';

export const createReview = async (businessId: string, data: any) => {
  const response = await apiClient.post(`/reviews/business/${businessId}`, data);
  return response.data;
};

export const updateReview = async (id: string, data: any) => {
  const response = await apiClient.put(`/reviews/${id}`, data);
  return response.data;
};

export const deleteReview = async (id: string) => {
  const response = await apiClient.delete(`/reviews/${id}`);
  return response.data;
};

export const addReaction = async (id: string, type: string) => {
  const response = await apiClient.post(`/reviews/${id}/reactions`, { type });
  return response.data;
};

export const removeReaction = async (id: string) => {
  const response = await apiClient.delete(`/reviews/${id}/reactions`);
  return response.data;
};
