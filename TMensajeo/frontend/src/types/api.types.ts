export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface ApiError {
  success: false;
  error: string;
  message?: string;
  statusCode?: number;
  details?: any;
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface UploadResponse {
  url: string;
  publicId: string;
  format: string;
  width?: number;
  height?: number;
}

export interface SearchParams {
  query: string;
  type?: 'business' | 'event' | 'all';
  latitude?: number;
  longitude?: number;
  radius?: number;
}

export interface SearchResult {
  businesses: Array<any>;
  events: Array<any>;
  total: number;
}
