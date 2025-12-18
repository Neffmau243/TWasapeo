import apiClient from './api';

export const getStats = async () => {
  const response = await apiClient.get('/owner/stats');
  return response.data;
};

export const getMyBusinesses = async () => {
  const response = await apiClient.get('/owner/businesses');
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
