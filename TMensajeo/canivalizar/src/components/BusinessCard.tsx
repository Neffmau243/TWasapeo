import { Star, MapPin, Clock, Award, Sparkles, TrendingUp } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Business {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  description: string;
  hours: string;
  badges?: string[];
  isOpen?: boolean;
  openStatus?: string;
}

interface BusinessCardProps {
  business: Business;
  onReviewClick: () => void;
  onViewDetails: () => void;
}

export function BusinessCard({ business, onReviewClick, onViewDetails }: BusinessCardProps) {
  const [isVisible, setIsVisible] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => {
      if (cardRef.current) {
        observer.unobserve(cardRef.current);
      }
    };
  }, []);

  const getBadgeIcon = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'popular':
        return <TrendingUp className="w-3 h-3" />;
      case 'nuevo':
        return <Sparkles className="w-3 h-3" />;
      case 'verificado':
        return <Award className="w-3 h-3" />;
      default:
        return null;
    }
  };

  const getBadgeColor = (badge: string) => {
    switch (badge.toLowerCase()) {
      case 'popular':
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300';
      case 'nuevo':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'verificado':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      default:
        return 'bg-[rgb(var(--muted))] text-[rgb(var(--foreground))]';
    }
  };

  const getStatusColor = (status?: string) => {
    if (!status) return '';
    if (status.toLowerCase().includes('abierto')) {
      return 'text-green-600 dark:text-green-400';
    }
    if (status.toLowerCase().includes('cierra pronto')) {
      return 'text-orange-600 dark:text-orange-400';
    }
    return 'text-red-600 dark:text-red-400';
  };

  return (
    <div
      ref={cardRef}
      className={`
        border border-[rgb(var(--border))] bg-[rgb(var(--card))] overflow-hidden hover:shadow-lg transition-all duration-500 group
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
    >
      <button onClick={onViewDetails} className="w-full aspect-[4/3] overflow-hidden relative">
        <img
          src={business.image}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        {business.badges && business.badges.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            {business.badges.map((badge, index) => (
              <span
                key={index}
                className={`
                  px-2 py-1 text-xs uppercase tracking-wider flex items-center gap-1
                  ${getBadgeColor(badge)}
                `}
              >
                {getBadgeIcon(badge)}
                {badge}
              </span>
            ))}
          </div>
        )}
      </button>
      
      <div className="p-6">
        <button onClick={onViewDetails} className="w-full text-left">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="text-2xl mb-1 hover:text-[rgb(var(--muted-foreground))] transition-colors">
                {business.name}
              </h3>
              <p className="text-[rgb(var(--muted-foreground))]">{business.category}</p>
              
              {/* Open Status */}
              {business.openStatus && (
                <p className={`text-sm mt-1 ${getStatusColor(business.openStatus)}`}>
                  {business.openStatus}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1">
              <Star className="w-5 h-5 fill-current" />
              <span>{business.rating.toFixed(1)}</span>
            </div>
          </div>

          <p className="text-[rgb(var(--muted-foreground))] mb-4 line-clamp-2">
            {business.description}
          </p>

          <div className="space-y-2 mb-4">
            <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted-foreground))]">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{business.location}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[rgb(var(--muted-foreground))]">
              <Clock className="w-4 h-4" />
              <span>{business.hours}</span>
            </div>
          </div>
        </button>

        <div className="flex items-center justify-between pt-4 border-t border-[rgb(var(--border))]">
          <span className="text-sm text-[rgb(var(--muted-foreground))]">
            {business.reviewCount} reseñas
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onReviewClick();
            }}
            className="px-4 py-2 border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors"
          >
            Dejar Reseña
          </button>
        </div>
      </div>
    </div>
  );
}
