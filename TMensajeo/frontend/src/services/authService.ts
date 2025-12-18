import apiClient from './api';

export const register = async (data: any) => {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
};

export const login = async (credentials: { email: string; password: string }) => {
  const response = await apiClient.post('/auth/login', credentials);
  return response.data;
};

export const logout = async () => {
  const response = await apiClient.post('/auth/logout');
  return response.data;
};

export const verifyEmail = async (token: string) => {
  const response = await apiClient.get(`/auth/verify-email/${token}`);
  return response.data;
};

export const resendVerification = async (email: string) => {
  const response = await apiClient.post('/auth/resend-verification', { email });
  return response.data;
};

export const forgotPassword = async (email: string) => {
  const response = await apiClient.post('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string) => {
  const response = await apiClient.post('/auth/reset-password', { token, password });
  return response.data;
};

export const refreshToken = async () => {
  const response = await apiClient.post('/auth/refresh-token');
  return response.data;
};
