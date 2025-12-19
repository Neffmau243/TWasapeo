import axios from 'axios';

// Si hay un proxy en vite.config.ts, usar ruta relativa
// Si no, usar la URL completa del backend
const API_URL = import.meta.env.VITE_API_URL || '/api';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar token
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Manejar errores 429 (Rate Limit)
    if (error.response?.status === 429) {
      console.warn('⚠️ Rate limit alcanzado. Por favor espera un momento antes de intentar de nuevo.');
      // No lanzar el error, devolver una respuesta vacía para que el componente pueda manejarlo
      return Promise.reject({
        ...error,
        isRateLimit: true,
        message: 'Demasiadas peticiones. Por favor espera un momento.',
      });
    }
    
    // Manejar errores 401/403 (No autorizado)
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Limpiar token si es inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;
