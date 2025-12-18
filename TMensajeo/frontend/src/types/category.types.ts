export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  businessCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCategoryRequest {
  name: string;
  description?: string;
  icon?: string;
  image?: string;
}

export interface UpdateCategoryRequest extends Partial<CreateCategoryRequest> {
  isActive?: boolean;
}

export interface CategoryWithBusinesses extends Category {
  businesses: Array<{
    id: string;
    name: string;
    slug: string;
    logo?: string;
    averageRating: number;
  }>;
}
