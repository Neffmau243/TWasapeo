import { Heart, Share2, Bell } from 'lucide-react';
import { useState } from 'react';

interface BusinessActionsProps {
  translations: any;
}

export function BusinessActions({ translations }: BusinessActionsProps) {
  const [isFollowing, setIsFollowing] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: document.title,
        url: window.location.href
      }).catch(() => {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(window.location.href);
        alert('Enlace copiado al portapapeles');
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Enlace copiado al portapapeles');
    }
  };

  return (
    <div className="flex items-center gap-4 flex-wrap">
      <button
        onClick={() => setIsFollowing(!isFollowing)}
        className={`
          flex items-center gap-2 px-6 py-3 border border-[rgb(var(--border))] transition-colors
          ${isFollowing ? 'bg-[rgb(var(--foreground))] text-[rgb(var(--background))]' : 'hover:bg-[rgb(var(--muted))]'}
        `}
      >
        <Bell className="w-5 h-5" />
        <span>{isFollowing ? 'Siguiendo' : translations.business.follow}</span>
      </button>

      <button
        onClick={() => setIsFavorite(!isFavorite)}
        className={`
          flex items-center gap-2 px-6 py-3 border border-[rgb(var(--border))] transition-colors
          ${isFavorite ? 'bg-[rgb(var(--foreground))] text-[rgb(var(--background))]' : 'hover:bg-[rgb(var(--muted))]'}
        `}
      >
        <Heart className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`} />
        <span>{translations.business.favorite}</span>
      </button>

      <button
        onClick={handleShare}
        className="flex items-center gap-2 px-6 py-3 border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors"
      >
        <Share2 className="w-5 h-5" />
        <span>{translations.business.share}</span>
      </button>
    </div>
  );
}
