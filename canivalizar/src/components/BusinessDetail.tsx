import { Star, MapPin, Clock, Phone, Mail, Globe, ChevronLeft, X } from 'lucide-react';
import { useState } from 'react';
import { Breadcrumbs } from './Breadcrumbs';
import { SimilarBusinesses } from './SimilarBusinesses';

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
  phone?: string;
  email?: string;
  website?: string;
  fullDescription?: string;
  amenities?: string[];
  gallery?: string[];
  coordinates?: { lat: number; lng: number };
  badges?: string[];
  isOpen?: boolean;
  openStatus?: string;
}

interface Review {
  id: number;
  userName: string;
  rating: number;
  date: string;
  comment: string;
}

interface BusinessDetailProps {
  business: Business;
  reviews: Review[];
  onBack: () => void;
  onReviewClick: () => void;
  allBusinesses: Business[];
  onViewDetails: (id: number) => void;
}

export function BusinessDetail({ 
  business, 
  reviews, 
  onBack, 
  onReviewClick,
  allBusinesses,
  onViewDetails
}: BusinessDetailProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Combinar la imagen principal con las de la galería
  const allImages = business.gallery 
    ? [business.image, ...business.gallery]
    : [business.image];

  return (
    <div className="min-h-screen">
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={onBack}
          className="flex items-center gap-2 hover:text-[rgb(var(--muted-foreground))] transition-colors mb-6"
        >
          <ChevronLeft className="w-5 h-5" />
          <span>Volver a Negocios</span>
        </button>
      </div>

      {/* Photo Gallery */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="grid grid-cols-4 gap-4">
          {/* Main Image */}
          <div 
            className="col-span-4 md:col-span-2 md:row-span-2 aspect-16/10 md:aspect-auto md:h-full overflow-hidden cursor-pointer group"
            onClick={() => allImages[0] && setSelectedImage(allImages[0])}
          >
            <img
              src={allImages[0]}
              alt={`${business.name} - Principal`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Gallery Images */}
          {allImages.slice(1, 5).map((image, index) => (
            <div
              key={index}
              className="col-span-2 md:col-span-1 aspect-16/10 overflow-hidden cursor-pointer group"
              onClick={() => setSelectedImage(image)}
            >
              <img
                src={image}
                alt={`${business.name} - ${index + 2}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}

          {allImages.length > 5 && (
            <div className="col-span-2 md:col-span-1 aspect-16/10 overflow-hidden cursor-pointer relative group">
              <img
                src={allImages[5]}
                alt={`${business.name} - más fotos`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <span className="text-white text-2xl">+{allImages.length - 5}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Full Screen Image Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <button
            onClick={() => setSelectedImage(null)}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 transition-colors text-white"
            aria-label="Cerrar"
          >
            <X className="w-6 h-6" />
          </button>
          <img
            src={selectedImage}
            alt={business.name}
            className="max-w-full max-h-full object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumbs */}
        <div className="mb-8">
          <Breadcrumbs
            items={[
              { label: 'Inicio', onClick: onBack },
              { label: business.category, onClick: onBack },
              { label: business.name }
            ]}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-4xl md:text-5xl mb-2">{business.name}</h1>
                  <p className="text-xl text-[rgb(var(--muted-foreground))]">{business.category}</p>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 border border-[rgb(var(--border))]">
                  <Star className="w-6 h-6 fill-current" />
                  <span className="text-2xl">{business.rating.toFixed(1)}</span>
                </div>
              </div>
              <p className="text-[rgb(var(--muted-foreground))]">
                {business.reviewCount} reseñas
              </p>
            </div>

            {/* Description */}
            <div className="border-t border-[rgb(var(--border))] pt-8">
              <h2 className="text-3xl mb-4">Acerca de</h2>
              <p className="text-lg leading-relaxed text-[rgb(var(--muted-foreground))]">
                {business.fullDescription || business.description}
              </p>
            </div>

            {/* Amenities */}
            {business.amenities && business.amenities.length > 0 && (
              <div className="border-t border-[rgb(var(--border))] pt-8">
                <h2 className="text-3xl mb-4">Servicios y Comodidades</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {business.amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="px-4 py-3 border border-[rgb(var(--border))] bg-[rgb(var(--muted))]"
                    >
                      {amenity}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Map */}
            <div className="border-t border-[rgb(var(--border))] pt-8">
              <h2 className="text-3xl mb-4">Ubicación</h2>
              <div className="aspect-video w-full border border-[rgb(var(--border))] bg-[rgb(var(--muted))] relative overflow-hidden">
                {/* Placeholder map - En producción usarías Google Maps o Mapbox */}
                <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-[rgb(var(--muted))] to-[rgb(var(--background))]">
                  <div className="text-center space-y-4">
                    <MapPin className="w-16 h-16 mx-auto text-[rgb(var(--muted-foreground))]" />
                    <div>
                      <p className="text-lg">{business.location}</p>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(business.location)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-[rgb(var(--muted-foreground))] hover:text-[rgb(var(--foreground))] underline mt-2 inline-block"
                      >
                        Ver en Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Reviews */}
            <div className="border-t border-[rgb(var(--border))] pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-3xl">Reseñas</h2>
                <button
                  onClick={onReviewClick}
                  className="px-6 py-3 bg-[rgb(var(--foreground))] text-[rgb(var(--background))] hover:opacity-90 transition-opacity"
                >
                  Escribir Reseña
                </button>
              </div>

              <div className="space-y-6">
                {reviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-[rgb(var(--border))] p-6"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-xl mb-1">{review.userName}</p>
                        <p className="text-sm text-[rgb(var(--muted-foreground))]">{review.date}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        <Star className="w-5 h-5 fill-current" />
                        <span>{review.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <p className="text-[rgb(var(--muted-foreground))] leading-relaxed">
                      {review.comment}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="border border-[rgb(var(--border))] p-6 sticky top-24 space-y-6">
              <h3 className="text-2xl mb-4">Información de Contacto</h3>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-[rgb(var(--muted-foreground))] mb-1">Dirección</p>
                    <p>{business.location}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 mt-1 shrink-0" />
                  <div>
                    <p className="text-sm text-[rgb(var(--muted-foreground))] mb-1">Horario</p>
                    <p>{business.hours}</p>
                  </div>
                </div>

                {business.phone && (
                  <div className="flex items-start gap-3">
                    <Phone className="w-5 h-5 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-[rgb(var(--muted-foreground))] mb-1">Teléfono</p>
                      <a href={`tel:${business.phone}`} className="hover:underline">
                        {business.phone}
                      </a>
                    </div>
                  </div>
                )}

                {business.email && (
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-[rgb(var(--muted-foreground))] mb-1">Email</p>
                      <a href={`mailto:${business.email}`} className="hover:underline break-all">
                        {business.email}
                      </a>
                    </div>
                  </div>
                )}

                {business.website && (
                  <div className="flex items-start gap-3">
                    <Globe className="w-5 h-5 mt-1 shrink-0" />
                    <div>
                      <p className="text-sm text-[rgb(var(--muted-foreground))] mb-1">Sitio Web</p>
                      <a
                        href={business.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:underline break-all"
                      >
                        Visitar sitio
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={onReviewClick}
                className="w-full py-3 border border-[rgb(var(--border))] hover:bg-[rgb(var(--muted))] transition-colors mt-6"
              >
                Dejar una Reseña
              </button>
            </div>
          </div>
        </div>

        {/* Similar Businesses */}
        <SimilarBusinesses
          currentBusinessId={business.id}
          category={business.category}
          allBusinesses={allBusinesses}
          onReviewClick={onReviewClick}
          onViewDetails={onViewDetails}
        />
      </div>
    </div>
  );
}