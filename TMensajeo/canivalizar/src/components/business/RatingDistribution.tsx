import { Star } from 'lucide-react';

interface RatingDistributionProps {
  distribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
  totalReviews: number;
  averageRating: number;
}

export function RatingDistribution({ distribution, totalReviews, averageRating }: RatingDistributionProps) {
  const getPercentage = (count: number) => {
    return totalReviews > 0 ? (count / totalReviews) * 100 : 0;
  };

  return (
    <div className="border border-[rgb(var(--border))] p-6 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Overall Rating */}
        <div className="text-center md:border-r md:border-[rgb(var(--border))]">
          <div className="text-6xl mb-2">{averageRating.toFixed(1)}</div>
          <div className="flex items-center justify-center gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-6 h-6 ${star <= Math.round(averageRating) ? 'fill-current' : ''}`}
              />
            ))}
          </div>
          <p className="text-[rgb(var(--muted-foreground))]">
            {totalReviews} {totalReviews === 1 ? 'reseña' : 'reseñas'}
          </p>
        </div>

        {/* Rating Breakdown */}
        <div className="space-y-2">
          {[5, 4, 3, 2, 1].map((rating) => {
            const count = distribution[rating as keyof typeof distribution];
            const percentage = getPercentage(count);
            
            return (
              <div key={rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span>{rating}</span>
                  <Star className="w-4 h-4 fill-current" />
                </div>
                
                <div className="flex-1 h-2 bg-[rgb(var(--muted))] relative overflow-hidden">
                  <div
                    className="h-full bg-[rgb(var(--foreground))] transition-all duration-300"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
                
                <span className="w-12 text-right text-sm text-[rgb(var(--muted-foreground))]">
                  {count}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
