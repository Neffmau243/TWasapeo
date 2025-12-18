// ============================================
// IMAGE SERVICE
// ============================================
// Servicio para subir imágenes a Cloudinary
// Maneja upload, eliminación y optimización

import { cloudinary } from '../config/cloudinary';
import fs from 'fs';

/**
 * Subir imagen a Cloudinary
 * @param filePath - Ruta del archivo temporal
 * @param folder - Carpeta en Cloudinary (businesses, profiles, etc)
 */
export const uploadImage = async (filePath: string, folder: string = 'businesses') => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `locales/${folder}`,
      transformation: [
        { width: 1200, height: 800, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });

    // Eliminar archivo temporal
    fs.unlinkSync(filePath);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    // Eliminar archivo temporal en caso de error
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    throw error;
  }
};

/**
 * Eliminar imagen de Cloudinary
 * @param publicId - Public ID de Cloudinary
 */
export const deleteImage = async (publicId: string) => {
  try {
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error('Error al eliminar imagen:', error);
    throw error;
  }
};

/**
 * Subir múltiples imágenes
 */
export const uploadMultipleImages = async (files: Express.Multer.File[], folder: string = 'businesses') => {
  const uploadPromises = files.map(file => uploadImage(file.path, folder));
  return Promise.all(uploadPromises);
};
