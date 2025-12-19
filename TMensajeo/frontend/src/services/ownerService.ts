import apiClient from './api';

export const getStats = async () => {
  const response = await apiClient.get('/owner/stats');
  return response.data;
};

export const getMyBusinesses = async (params?: any) => {
  const response = await apiClient.get('/owner/businesses', { params });
  return response.data;
};

export const getBusinessStats = async (businessId: string) => {
  const response = await apiClient.get(`/owner/businesses/${businessId}/stats`);
  return response.data;
};

export const getMyReviews = async (params?: any) => {
  const response = await apiClient.get('/owner/reviews', { params });
  return response.data;
};

export const respondToReview = async (reviewId: string, response: string) => {
  const result = await apiClient.post(`/owner/reviews/${reviewId}/respond`, { response });
  return result.data;
};

export const updateReviewResponse = async (reviewId: string, response: string) => {
  const result = await apiClient.put(`/owner/reviews/${reviewId}/respond`, { response });
  return result.data;
};

export const deleteReviewResponse = async (reviewId: string) => {
  const result = await apiClient.delete(`/owner/reviews/${reviewId}/respond`);
  return result.data;
};
