// ============================================
// UPLOAD MIDDLEWARE
// ============================================
// Configuración de Multer para subir archivos
// Sube imágenes temporalmente a /uploads antes de Cloudinary
// Uso: router.post('/upload', upload.single('image'), controller)

import multer from 'multer';
import path from 'path';
import { FILE_LIMITS } from '../config/constants';

// Configuración de almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Carpeta temporal
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Filtro de archivos (solo imágenes)
const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (FILE_LIMITS.ALLOWED_TYPES.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido. Solo: JPEG, PNG, WebP'));
  }
};

// Configuración de Multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: FILE_LIMITS.MAX_SIZE,
  }
});
