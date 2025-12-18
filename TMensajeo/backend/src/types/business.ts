// ============================================
// BUSINESS TYPES
// ============================================
// Interfaces para negocios

export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  address: string;
  city: string;
  state: string;
  zipCode?: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  schedule: any;
  logo?: string;
  coverImage?: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'INACTIVE';
  isVerified: boolean;
  isPremium: boolean;
  viewCount: number;
  favoriteCount: number;
  reviewCount: number;
  averageRating: number;
  createdAt: Date;
  updatedAt: Date;
  ownerId: string;
}
