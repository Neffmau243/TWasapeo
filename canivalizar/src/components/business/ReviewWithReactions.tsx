import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { useState } from 'react';

interface Review {
  id: number;
  userName: string;
  userCity?: string;
  rating: number;
  date: string;
  comment: string;
  images?: string[];
  likes?: number;
  dislikes?: number;
}

interface ReviewWithReactionsProps {
  review: Review;
}

export function ReviewWithReactions({ review }: ReviewWithReactionsProps) {
  const [userReaction, setUserReaction] = useState<'like' | 'dislike' | null>(null);
  const [likes, setLikes] = useState(review.likes || 0);
  const [dislikes, setDislikes] = useState(review.dislikes || 0);

  const handleReaction = (reaction: 'like' | 'dislike') => {
    if (userReaction === reaction) {
      // Remove reaction
      if (reaction === 'like') {
        setLikes(likes - 1);
      } else {
        setDislikes(dislikes - 1);
      }
      setUserReaction(null);
    } else {
      // Add or change reaction
      if (userReaction === 'like') {
        setLikes(likes - 1);
        setDislikes(dislikes + 1);
      } else if (userReaction === 'dislike') {
        setDislikes(dislikes - 1);
        setLikes(likes + 1);
      } else {
        if (reaction === 'like') {
          setLikes(likes + 1);
        } else {
          setDislikes(dislikes + 1);
        }
      }
      setUserReaction(reaction);
    }
  };

  return (
    <div className="border border-[rgb(var(--border))] p-6">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-4">
          {/* User Avatar */}
          <div className="w-12 h-12 bg-[rgb(var(--muted))] flex items-center justify-center flex-shrink-0">
            <span className="text-xl">{review.userName.charAt(0).toUpperCase()}</span>
          </div>
          
          <div>
            <p className="text-xl mb-1">{review.userName}</p>
            {review.userCity && (
              <p className="text-sm text-[rgb(var(--muted-foreground))]">{review.userCity}</p>
            )}
          </div>
        </div>
        
        <div>
          <div className="flex items-center gap-1 mb-1">
            <Star className="w-5 h-5 fill-current" />
            <span>{review.rating.toFixed(1)}</span>
          </div>
          <p className="text-sm text-[rgb(var(--muted-foreground))]">{review.date}</p>
        </div>
      </div>

      {/* Comment */}
      <p className="text-[rgb(var(--muted-foreground))] leading-relaxed mb-4">
        {review.comment}
      </p>

      {/* Images */}
      {review.images && review.images.length > 0 && (
        <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
          {review.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Foto de reseña ${index + 1}`}
              className="h-32 object-cover border border-[rgb(var(--border))]"
            />
          ))}
        </div>
      )}

      {/* Reactions */}
      <div className="flex items-center gap-4 pt-4 border-t border-[rgb(var(--border))]">
        <button
          onClick={() => handleReaction('like')}
          className={`
            flex items-center gap-2 px-4 py-2 border border-[rgb(var(--border))] transition-colors
            ${userReaction === 'like' ? 'bg-[rgb(var(--foreground))] text-[rgb(var(--background))]' : 'hover:bg-[rgb(var(--muted))]'}
          `}
        >
          <ThumbsUp className={`w-4 h-4 ${userReaction === 'like' ? 'fill-current' : ''}`} />
          <span>{likes}</span>
        </button>

        <button
          onClick={() => handleReaction('dislike')}
          className={`
            flex items-center gap-2 px-4 py-2 border border-[rgb(var(--border))] transition-colors
            ${userReaction === 'dislike' ? 'bg-[rgb(var(--foreground))] text-[rgb(var(--background))]' : 'hover:bg-[rgb(var(--muted))]'}
          `}
        >
          <ThumbsDown className={`w-4 h-4 ${userReaction === 'dislike' ? 'fill-current' : ''}`} />
          <span>{dislikes}</span>
        </button>
      </div>
    </div>
  );
}
