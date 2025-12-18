import { Star, MessageSquare } from 'lucide-react';

interface Review {
  id: number;
  businessId: number;
  businessName: string;
  userName: string;
  rating: number;
  date: string;
  comment: string;
  userCity?: string;
}

interface RecentReviewsProps {
  reviews: Review[];
  onBusinessClick: (id: number) => void;
}

export function RecentReviews({ reviews, onBusinessClick }: RecentReviewsProps) {
  return (
    <section className="py-16 px-4 border-t border-[rgb(var(--border))]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageSquare className="w-6 h-6" />
            <h2 className="text-4xl">Reseñas Recientes</h2>
          </div>
          <p className="text-lg text-[rgb(var(--muted-foreground))]">
            Lo que nuestra comunidad está diciendo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.slice(0, 6).map((review) => (
            <div
              key={review.id}
              className="border border-[rgb(var(--border))] p-6 hover:bg-[rgb(var(--muted))] transition-colors"
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <p className="text-lg mb-1">{review.userName}</p>
                  {review.userCity && (
                    <p className="text-sm text-[rgb(var(--muted-foreground))]">
                      {review.userCity}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span>{review.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Comment */}
              <p className="text-[rgb(var(--muted-foreground))] mb-4 line-clamp-3">
                {review.comment}
              </p>

              {/* Business Info */}
              <div className="border-t border-[rgb(var(--border))] pt-4">
                <button
                  onClick={() => onBusinessClick(review.businessId)}
                  className="hover:underline"
                >
                  {review.businessName}
                </button>
                <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">
                  {review.date}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
