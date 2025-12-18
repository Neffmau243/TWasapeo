import apiClient from './api';

export const getFaqs = async (businessId: string) => {
  const response = await apiClient.get(`/faqs/business/${businessId}`);
  return response.data;
};

export const createFaq = async (businessId: string, data: any) => {
  const response = await apiClient.post(`/faqs/business/${businessId}`, data);
  return response.data;
};

export const updateFaq = async (id: string, data: any) => {
  const response = await apiClient.put(`/faqs/${id}`, data);
  return response.data;
};

export const deleteFaq = async (id: string) => {
  const response = await apiClient.delete(`/faqs/${id}`);
  return response.data;
};
