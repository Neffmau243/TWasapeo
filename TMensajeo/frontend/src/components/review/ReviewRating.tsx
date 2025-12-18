import React from 'react';

interface ReviewRatingProps {
  rating: number;
  onChange?: (rating: number) => void;
}

const ReviewRating: React.FC<ReviewRatingProps> = ({ rating, onChange }) => {
  return (
    <div className="review-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} onClick={() => onChange?.(star)}>
          {star <= rating ? '⭐' : '☆'}
        </span>
      ))}
    </div>
  );
};

export default ReviewRating;
