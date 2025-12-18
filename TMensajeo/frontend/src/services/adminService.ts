import apiClient from './api';

export const getStats = async () => {
  const response = await apiClient.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async (params?: any) => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

export const banUser = async (userId: string, reason: string) => {
  const response = await apiClient.post(`/admin/users/${userId}/ban`, { reason });
  return response.data;
};

export const unbanUser = async (userId: string) => {
  const response = await apiClient.post(`/admin/users/${userId}/unban`);
  return response.data;
};

export const changeUserRole = async (userId: string, role: string) => {
  const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const getPendingBusinesses = async () => {
  const response = await apiClient.get('/admin/businesses/pending');
  return response.data;
};

export const approveBusiness = async (businessId: string) => {
  const response = await apiClient.post(`/admin/businesses/${businessId}/approve`);
  return response.data;
};

export const rejectBusiness = async (businessId: string, reason: string) => {
  const response = await apiClient.post(`/admin/businesses/${businessId}/reject`, { reason });
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await apiClient.delete(`/admin/reviews/${reviewId}`);
  return response.data;
};

export const createCategory = async (data: any) => {
  const response = await apiClient.post('/admin/categories', data);
  return response.data;
};

export const updateCategory = async (id: string, data: any) => {
  const response = await apiClient.put(`/admin/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await apiClient.delete(`/admin/categories/${id}`);
  return response.data;
};
