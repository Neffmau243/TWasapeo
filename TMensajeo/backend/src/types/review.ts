// ============================================
// REVIEW TYPES
// ============================================
// Interfaces para reseñas

export interface Review {
  id: string;
  rating: number;
  comment: string;
  helpfulCount: number;
  isEdited: boolean;
  ownerReply?: string;
  ownerReplyDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  businessId: string;
}
