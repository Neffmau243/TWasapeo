import apiClient from './api';

export const getProfile = async () => {
  const response = await apiClient.get('/users/profile');
  return response.data;
};

export const updateProfile = async (data: any) => {
  const response = await apiClient.put('/users/profile', data);
  return response.data;
};

export const changePassword = async (data: any) => {
  const response = await apiClient.put('/users/password', data);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await apiClient.delete('/users/account');
  return response.data;
};

export const getFavorites = async () => {
  const response = await apiClient.get('/users/favorites');
  return response.data;
};

export const addFavorite = async (businessId: string) => {
  const response = await apiClient.post(`/users/favorites/${businessId}`);
  return response.data;
};

export const removeFavorite = async (businessId: string) => {
  const response = await apiClient.delete(`/users/favorites/${businessId}`);
  return response.data;
};

export const getFollowing = async () => {
  const response = await apiClient.get('/users/following');
  return response.data;
};

export const followBusiness = async (businessId: string) => {
  const response = await apiClient.post(`/users/following/${businessId}`);
  return response.data;
};

export const unfollowBusiness = async (businessId: string) => {
  const response = await apiClient.delete(`/users/following/${businessId}`);
  return response.data;
};

export const getMyReviews = async () => {
  const response = await apiClient.get('/users/reviews');
  return response.data;
};
