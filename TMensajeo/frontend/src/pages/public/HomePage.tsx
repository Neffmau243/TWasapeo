import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../../components/search/SearchBar';
import BusinessCard from '../../components/business/BusinessCard';
import * as businessService from '../../services/businessService';

const HomePage: React.FC = () => {
  const [businesses, setBusinesses] = useState<any[]>([]);
  const [featuredBusinesses, setFeaturedBusinesses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);

      // Cargar negocios destacados
      const featured = await businessService.getAllBusinesses({ featured: true, limit: 4 });
      console.log('✅ Featured response:', featured);
      setFeaturedBusinesses(featured.data.businesses || []);

      // Cargar negocios recientes
      const recent = await businessService.getAllBusinesses({ limit: 8 });
      console.log('✅ Recent response:', recent);
      setBusinesses(recent.data.businesses || []);
    } catch (error) {
      console.error('Error loading businesses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-4">
            Descubre los mejores negocios locales
          </h1>
          <p className="text-xl text-center mb-8 text-blue-100">
            Encuentra y reseña establecimientos cerca de ti
          </p>

          <div className="max-w-2xl mx-auto">
            <SearchBar onSearch={handleSearch} />
          </div>
        </div>
      </div>

      {/* Featured Businesses */}
      {featuredBusinesses.length > 0 && (
        <div className="container mx-auto px-4 py-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            ⭐ Negocios Destacados
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                  <div className="aspect-video bg-gray-200" />
                  <div className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded" />
                    <div className="h-3 bg-gray-200 rounded w-2/3" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredBusinesses.map((business) => (
                <BusinessCard key={business.id} business={business} />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Recent Businesses */}
      <div className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-gray-900 mb-6">
          Negocios Recientes
        </h2>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow animate-pulse">
                <div className="aspect-video bg-gray-200" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : businesses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businesses.map((business) => (
              <BusinessCard key={business.id} business={business} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No hay negocios disponibles</p>
          </div>
        )}
      </div>

      {/* CTA Section */}
      <div className="bg-blue-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            ¿Tienes un negocio?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Únete a nuestra plataforma y haz crecer tu negocio
          </p>
          <button
            onClick={() => navigate('/register')}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-blue-50 transition-colors"
          >
            Registrar mi negocio
          </button>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
