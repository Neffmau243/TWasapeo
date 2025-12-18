import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import * as businessService from '../../services/businessService';
import ReviewList from '../../components/review/ReviewList';
import { useAuth } from '../../hooks/useAuth';

const BusinessDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [business, setBusiness] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (slug) {
      loadBusiness();
    }
  }, [slug]);

  const loadBusiness = async () => {
    try {
      setLoading(true);
      const data = await businessService.getBusinessBySlug(slug!);
      setBusiness(data);
      
      // Cargar reseñas
      const reviewsData = await businessService.getBusinessReviews(data.id);
      setReviews(reviewsData.data || []);
    } catch (err: any) {
      setError(err?.response?.data?.error || 'Error al cargar el negocio');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error || !business) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Negocio no encontrado</h2>
          <p className="text-gray-600 mb-4">{error || 'El negocio que buscas no existe'}</p>
          <Link to="/" className="text-blue-600 hover:text-blue-700">
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Image */}
      <div className="relative h-96 bg-gray-200">
        {business.images && business.images.length > 0 ? (
          <img
            src={business.images[0].url}
            alt={business.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-400">
            <span className="text-8xl">🏪</span>
          </div>
        )}
        {business.featured && (
          <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-lg font-semibold">
            ⭐ Destacado
          </div>
        )}
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Business Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {business.name}
                  </h1>
                  {business.category && (
                    <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded">
                      {business.category.name}
                    </span>
                  )}
                </div>
                {business.averageRating && (
                  <div className="text-right">
                    <div className="flex items-center gap-2 text-2xl font-bold">
                      <span className="text-yellow-500">⭐</span>
                      <span>{business.averageRating.toFixed(1)}</span>
                    </div>
                    <p className="text-gray-500 text-sm">
                      {business.reviewCount || 0} reseñas
                    </p>
                  </div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed">
                {business.description}
              </p>

              {business.tags && business.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {business.tags.map((tag: string, index: number) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Reseñas</h2>
                {isAuthenticated && (
                  <Link
                    to={`/business/${slug}/review`}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Escribir reseña
                  </Link>
                )}
              </div>
              
              {reviews.length > 0 ? (
                <ReviewList reviews={reviews} />
              ) : (
                <p className="text-gray-500 text-center py-8">
                  No hay reseñas todavía. ¡Sé el primero en dejar una!
                </p>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Contact Info */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Información de contacto
              </h3>
              
              {business.address && (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-1">Dirección</p>
                  <p className="text-gray-900">📍 {business.address}</p>
                </div>
              )}

              {business.phone && (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-1">Teléfono</p>
                  <a
                    href={`tel:${business.phone}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    📞 {business.phone}
                  </a>
                </div>
              )}

              {business.email && (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-1">Email</p>
                  <a
                    href={`mailto:${business.email}`}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    ✉️ {business.email}
                  </a>
                </div>
              )}

              {business.website && (
                <div className="mb-4">
                  <p className="text-gray-600 text-sm mb-1">Sitio web</p>
                  <a
                    href={business.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    🌐 Visitar sitio web
                  </a>
                </div>
              )}
            </div>

            {/* Opening Hours */}
            {business.openingHours && (
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Horario de atención
                </h3>
                <div className="space-y-2">
                  {Object.entries(business.openingHours).map(([day, hours]: [string, any]) => (
                    <div key={day} className="flex justify-between text-sm">
                      <span className="text-gray-600 capitalize">{day}:</span>
                      <span className="text-gray-900">
                        {hours.open} - {hours.close}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BusinessDetailPage;
