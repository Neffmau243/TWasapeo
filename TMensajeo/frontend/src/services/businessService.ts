import apiClient from './api';

export const getAllBusinesses = async (params?: any) => {
  const response = await apiClient.get('/businesses', { params });
  return response.data;
};

export const getBusinessById = async (id: string) => {
  const response = await apiClient.get(`/businesses/${id}`);
  return response.data;
};

export const getBusinessBySlug = async (slug: string) => {
  const response = await apiClient.get(`/businesses/slug/${slug}`);
  return response.data;
};

export const createBusiness = async (data: any) => {
  const response = await apiClient.post('/businesses', data);
  return response.data;
};

export const updateBusiness = async (id: string, data: any) => {
  const response = await apiClient.put(`/businesses/${id}`, data);
  return response.data;
};

export const deleteBusiness = async (id: string) => {
  const response = await apiClient.delete(`/businesses/${id}`);
  return response.data;
};

export const getBusinessReviews = async (id: string, params?: any) => {
  const response = await apiClient.get(`/businesses/${id}/reviews`, { params });
  return response.data;
};

export const getBusinessEvents = async (id: string) => {
  const response = await apiClient.get(`/businesses/${id}/events`);
  return response.data;
};

export const getBusinessFaqs = async (id: string) => {
  const response = await apiClient.get(`/businesses/${id}/faqs`);
  return response.data;
};

export const getBusinessGallery = async (id: string) => {
  const response = await apiClient.get(`/businesses/${id}/gallery`);
  return response.data;
};
