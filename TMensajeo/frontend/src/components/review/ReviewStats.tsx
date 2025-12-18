import React from 'react';

interface ReviewStatsProps {
  stats: any;
}

const ReviewStats: React.FC<ReviewStatsProps> = ({ stats }) => {
  return (
    <div className="review-stats">
      <p>Promedio: {stats?.averageRating}</p>
      <p>Total: {stats?.totalReviews}</p>
    </div>
  );
};

export default ReviewStats;
