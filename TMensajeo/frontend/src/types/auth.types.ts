export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: 'USER' | 'OWNER';
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'GUEST' | 'USER' | 'OWNER' | 'ADMIN';
  banned: boolean;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
}
