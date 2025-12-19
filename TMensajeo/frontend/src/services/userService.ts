import apiClient from './api';

export const getProfile = async () => {
  const response = await apiClient.get('/user/profile');
  return response.data;
};

export const updateProfile = async (data: any) => {
  const response = await apiClient.put('/user/profile', data);
  return response.data;
};

export const changePassword = async (data: any) => {
  const response = await apiClient.put('/user/password', data);
  return response.data;
};

export const deleteAccount = async () => {
  const response = await apiClient.delete('/user/account');
  return response.data;
};

export const getFavorites = async () => {
  const response = await apiClient.get('/user/favorites');
  return response.data;
};

export const addFavorite = async (businessId: string) => {
  const response = await apiClient.post(`/user/favorites/${businessId}`);
  return response.data;
};

export const removeFavorite = async (businessId: string) => {
  const response = await apiClient.delete(`/user/favorites/${businessId}`);
  return response.data;
};

export const getFollowing = async () => {
  const response = await apiClient.get('/user/following');
  return response.data;
};

export const followBusiness = async (businessId: string) => {
  const response = await apiClient.post(`/user/following/${businessId}`);
  return response.data;
};

export const unfollowBusiness = async (businessId: string) => {
  const response = await apiClient.delete(`/user/following/${businessId}`);
  return response.data;
};

export const getMyReviews = async () => {
  const response = await apiClient.get('/user/reviews');
  return response.data;
};
