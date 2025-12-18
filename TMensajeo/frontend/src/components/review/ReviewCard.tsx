import React from 'react';

interface ReviewCardProps {
  review: any;
}

const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  return (
    <div className="review-card">
      <div>Rating: {review.rating} ⭐</div>
      <h4>{review.title}</h4>
      <p>{review.content}</p>
    </div>
  );
};

export default ReviewCard;
