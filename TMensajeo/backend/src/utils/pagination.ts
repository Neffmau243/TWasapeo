// ============================================
// PAGINATION UTILS
// ============================================
// Utilidades para paginación

import { PAGINATION } from '../config/constants';

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

/**
 * Parsear parámetros de paginación
 */
export const parsePaginationParams = (page?: string, limit?: string): PaginationParams => {
  const parsedPage = parseInt(page || String(PAGINATION.DEFAULT_PAGE));
  const parsedLimit = parseInt(limit || String(PAGINATION.DEFAULT_LIMIT));

  return {
    page: parsedPage > 0 ? parsedPage : PAGINATION.DEFAULT_PAGE,
    limit: Math.min(parsedLimit > 0 ? parsedLimit : PAGINATION.DEFAULT_LIMIT, PAGINATION.MAX_LIMIT),
  };
};

/**
 * Calcular skip y take para Prisma
 */
export const getPaginationSkipTake = (params: PaginationParams) => {
  return {
    skip: (params.page - 1) * params.limit,
    take: params.limit,
  };
};

/**
 * Generar metadata de paginación
 */
export const generatePaginationMeta = (
  params: PaginationParams,
  total: number
): PaginationMeta => {
  const totalPages = Math.ceil(total / params.limit);

  return {
    page: params.page,
    limit: params.limit,
    total,
    totalPages,
    hasNextPage: params.page < totalPages,
    hasPrevPage: params.page > 1,
  };
};
