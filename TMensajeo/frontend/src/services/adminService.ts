import apiClient from './api';

export const getStats = async () => {
  const response = await apiClient.get('/admin/stats');
  return response.data;
};

export const getAllUsers = async (params?: any) => {
  const response = await apiClient.get('/admin/users', { params });
  return response.data;
};

export const deleteUser = async (userId: string) => {
  const response = await apiClient.delete(`/admin/users/${userId}`);
  return response.data;
};

export const changeUserRole = async (userId: string, role: string) => {
  const response = await apiClient.put(`/admin/users/${userId}/role`, { role });
  return response.data;
};

export const getPendingBusinesses = async (params?: any) => {
  console.log('🔍 adminService.getPendingBusinesses - params:', params);
  console.log('🔍 adminService.getPendingBusinesses - URL: /admin/pending');
  try {
    const response = await apiClient.get('/admin/pending', { params });
    console.log('✅ adminService.getPendingBusinesses - Response completa:', response);
    console.log('✅ adminService.getPendingBusinesses - response.data:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('❌ adminService.getPendingBusinesses - Error:', error);
    console.error('❌ adminService.getPendingBusinesses - Error response:', error.response);
    throw error;
  }
};

export const approveBusiness = async (businessId: string) => {
  const response = await apiClient.put(`/admin/approve/${businessId}`);
  return response.data;
};

export const rejectBusiness = async (businessId: string, reason: string) => {
  const response = await apiClient.put(`/admin/reject/${businessId}`, { reason });
  return response.data;
};

export const getAllReviews = async (params?: any) => {
  const response = await apiClient.get('/admin/reviews', { params });
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const response = await apiClient.delete(`/admin/reviews/${reviewId}`);
  return response.data;
};

export const createCategory = async (data: any) => {
  const response = await apiClient.post('/categories', data);
  return response.data;
};

export const updateCategory = async (id: string, data: any) => {
  const response = await apiClient.put(`/categories/${id}`, data);
  return response.data;
};

export const deleteCategory = async (id: string) => {
  const response = await apiClient.delete(`/categories/${id}`);
  return response.data;
};
