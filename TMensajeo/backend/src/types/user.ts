// ============================================
// USER TYPES
// ============================================
// Interfaces para usuarios

export interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'USER' | 'OWNER' | 'ADMIN';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPublic {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: string;
}
