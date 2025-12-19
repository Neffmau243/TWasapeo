export interface Business {
  id: string;
  name: string;
  slug: string;
  description: string;
  categoryId: string;
  address: string;
  latitude: number;
  longitude: number;
  phone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  facebook?: string;
  instagram?: string;
  logo?: string;
  images: string[];
  openingHours?: OpeningHours;
  isVerified: boolean;
  isFeatured: boolean;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  ownerId: string;
  averageRating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface OpeningHours {
  monday?: DaySchedule;
  tuesday?: DaySchedule;
  wednesday?: DaySchedule;
  thursday?: DaySchedule;
  friday?: DaySchedule;
  saturday?: DaySchedule;
  sunday?: DaySchedule;
}

export interface DaySchedule {
  open: string;
  close: string;
  closed?: boolean;
}

export interface CreateBusinessRequest {
  name: string;
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
  schedule?: OpeningHours | Record<string, any>;
  openingHours?: OpeningHours; // Deprecated, usar schedule
}

export interface UpdateBusinessRequest extends Partial<CreateBusinessRequest> {
  logo?: string;
  images?: string[];
}

export interface BusinessFilters {
  categoryId?: string;
  search?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  minRating?: number;
  isVerified?: boolean;
  isFeatured?: boolean;
}
