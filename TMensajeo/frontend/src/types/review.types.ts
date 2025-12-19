export interface Review {
  id: string;
  rating: number;
  title?: string;
  content?: string;
  comment?: string; // Backend usa 'comment', frontend puede usar 'content'
  images?: string[];
  userId: string;
  businessId: string;
  ownerResponse?: string; // También puede ser ownerReply
  ownerReply?: string; // Campo del backend
  ownerResponseDate?: string; // También puede ser ownerReplyDate
  ownerReplyDate?: string; // Campo del backend
  isVerified?: boolean;
  isEdited?: boolean;
  helpfulCount?: number;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email?: string;
    avatar?: string;
  };
  business?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  _count?: {
    reactions: number;
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
