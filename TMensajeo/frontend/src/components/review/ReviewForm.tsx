import React, { useState } from 'react';

interface ReviewFormProps {
  onSubmit: (data: any) => void;
}

const ReviewForm: React.FC<ReviewFormProps> = ({ onSubmit }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState('');

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit({ rating, content }); }}>
      <input type="number" min="1" max="5" value={rating} onChange={(e) => setRating(Number(e.target.value))} />
      <textarea value={content} onChange={(e) => setContent(e.target.value)} />
      <button type="submit">Enviar reseña</button>
    </form>
  );
};

export default ReviewForm;
