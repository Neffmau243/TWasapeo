import { Star, TrendingUp } from 'lucide-react';

interface Business {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
}

interface FeaturedBusinessesProps {
  businesses: Business[];
  onViewDetails: (id: number) => void;
}

export function FeaturedBusinesses({ businesses, onViewDetails }: FeaturedBusinessesProps) {
  // Get top 3 businesses by rating
  const featured = [...businesses]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 3);

  return (
    <section className="py-16 px-4 bg-[rgb(var(--muted))]">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <TrendingUp className="w-6 h-6" />
            <h2 className="text-4xl">Negocios Destacados del Mes</h2>
          </div>
          <p className="text-lg text-[rgb(var(--muted-foreground))]">
            Los establecimientos mejor valorados por nuestra comunidad
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featured.map((business, index) => (
            <button
              key={business.id}
              onClick={() => onViewDetails(business.id)}
              className="border border-[rgb(var(--border))] bg-[rgb(var(--background))] hover:shadow-lg transition-shadow group text-left relative overflow-hidden"
            >
              {/* Ranking Badge */}
              <div className="absolute top-4 left-4 w-12 h-12 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] flex items-center justify-center z-10 text-2xl">
                {index + 1}
              </div>

              {/* Image */}
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={business.image}
                  alt={business.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-2xl">{business.name}</h3>
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-current" />
                    <span>{business.rating.toFixed(1)}</span>
                  </div>
                </div>
                <p className="text-[rgb(var(--muted-foreground))] mb-2">{business.category}</p>
                <p className="text-sm text-[rgb(var(--muted-foreground))]">
                  {business.reviewCount} reseñas • {business.location}
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
