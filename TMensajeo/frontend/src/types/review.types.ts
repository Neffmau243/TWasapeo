export interface Review {
  id: string;
  rating: number;
  title: string;
  content: string;
  images: string[];
  userId: string;
  businessId: string;
  ownerResponse?: string;
  ownerResponseDate?: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    avatar?: string;
  };
}

export interface CreateReviewRequest {
  rating: number;
  title: string;
  content: string;
  businessId: string;
  images?: string[];
}

export interface UpdateReviewRequest {
  rating?: number;
  title?: string;
  content?: string;
  images?: string[];
}

export interface ReviewResponse {
  response: string;
}

export interface ReviewFilters {
  businessId?: string;
  userId?: string;
  minRating?: number;
  maxRating?: number;
  isVerified?: boolean;
}

export interface ReviewStats {
  totalReviews: number;
  averageRating: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}
