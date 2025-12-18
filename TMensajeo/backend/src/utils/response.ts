// ============================================
// RESPONSE UTILS
// ============================================
// Utilidades para respuestas estandarizadas

import { Response } from 'express';

/**
 * Respuesta exitosa
 */
export const successResponse = (res: Response, data: any, messageOrStatusCode?: string | number, statusCode?: number) => {
  // Si el tercer parámetro es un número, es el statusCode
  let actualMessage: string | undefined;
  let actualStatusCode = 200;
  
  if (typeof messageOrStatusCode === 'number') {
    actualStatusCode = messageOrStatusCode;
  } else if (typeof messageOrStatusCode === 'string') {
    actualMessage = messageOrStatusCode;
    if (typeof statusCode === 'number') {
      actualStatusCode = statusCode;
    }
  }

  return res.status(actualStatusCode).json({
    success: true,
    message: actualMessage,
    data,
  });
};

/**
 * Respuesta de error
 */
export const errorResponse = (res: Response, message: string, statusCode = 400, errors?: any) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
  });
};
