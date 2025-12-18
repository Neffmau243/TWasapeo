import apiClient from './api';

export const uploadAvatar = async (file: File) => {
  const formData = new FormData();
  formData.append('avatar', file);
  const response = await apiClient.post('/upload/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteAvatar = async () => {
  const response = await apiClient.delete('/upload/avatar');
  return response.data;
};

export const uploadBusinessLogo = async (businessId: string, file: File) => {
  const formData = new FormData();
  formData.append('logo', file);
  const response = await apiClient.post(`/upload/business/${businessId}/logo`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadBusinessCover = async (businessId: string, file: File) => {
  const formData = new FormData();
  formData.append('cover', file);
  const response = await apiClient.post(`/upload/business/${businessId}/cover`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const uploadGallery = async (businessId: string, files: File[]) => {
  const formData = new FormData();
  files.forEach(file => {
    formData.append('gallery', file);
  });
  const response = await apiClient.post(`/upload/business/${businessId}/gallery`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

export const deleteImage = async (publicId: string) => {
  const response = await apiClient.delete('/upload/image', { data: { publicId } });
  return response.data;
};
