import apiClient from './api';

export const getEvents = async (params?: any) => {
  const response = await apiClient.get('/events', { params });
  return response.data;
};

export const getEventById = async (id: string) => {
  const response = await apiClient.get(`/events/${id}`);
  return response.data;
};

export const createEvent = async (businessId: string, data: any) => {
  const response = await apiClient.post(`/events/business/${businessId}`, data);
  return response.data;
};

export const updateEvent = async (id: string, data: any) => {
  const response = await apiClient.put(`/events/${id}`, data);
  return response.data;
};

export const deleteEvent = async (id: string) => {
  const response = await apiClient.delete(`/events/${id}`);
  return response.data;
};
