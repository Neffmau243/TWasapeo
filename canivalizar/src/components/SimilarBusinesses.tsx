import { BusinessCard } from './BusinessCard';

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

interface SimilarBusinessesProps {
  currentBusinessId: number;
  category: string;
  allBusinesses: Business[];
  onReviewClick: () => void;
  onViewDetails: (id: number) => void;
}

export function SimilarBusinesses({
  currentBusinessId,
  category,
  allBusinesses,
  onReviewClick,
  onViewDetails
}: SimilarBusinessesProps) {
  const similarBusinesses = allBusinesses
    .filter(b => b.id !== currentBusinessId && b.category === category)
    .slice(0, 3);

  if (similarBusinesses.length === 0) {
    return null;
  }

  return (
    <div className="border-t border-[rgb(var(--border))] pt-12 mt-12">
      <h2 className="text-3xl mb-8">Negocios Similares</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {similarBusinesses.map((business) => (
          <BusinessCard
            key={business.id}
            business={business}
            onReviewClick={onReviewClick}
            onViewDetails={() => onViewDetails(business.id)}
          />
        ))}
      </div>
    </div>
  );
}
