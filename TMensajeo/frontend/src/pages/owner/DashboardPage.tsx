import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as ownerService from '../../services/ownerService';

const DashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await ownerService.getStats();
      console.log('✅ Owner stats:', response);
      setStats(response.data || {});
    } catch (error) {
      console.error('❌ Error loading owner stats:', error);
      // Fallback data
      setStats({
        totalBusinesses: 0,
        totalReviews: 0,
        averageRating: 0,
        totalViews: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Panel de Dueño</h1>
              <p className="text-gray-600 mt-1">Gestiona tus negocios y visualiza el rendimiento</p>
            </div>
            <Link
              to="/owner/businesses/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <span>➕</span> Nuevo Negocio
            </Link>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* My Businesses */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Mis Negocios</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBusinesses || 0}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <span className="text-2xl">🏪</span>
              </div>
            </div>
            <Link to="/owner/businesses" className="text-blue-600 hover:text-blue-700 text-sm mt-4 inline-block font-medium">
              Ver lista →
            </Link>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Reseñas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReviews || 0}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <span className="text-2xl">💬</span>
              </div>
            </div>
            <Link to="/owner/reviews" className="text-purple-600 hover:text-purple-700 text-sm mt-4 inline-block font-medium">
              Ver reseñas →
            </Link>
          </div>

          {/* Average Rating */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Calificación Promedio</p>
                <div className="flex items-end gap-2">
                  <p className="text-3xl font-bold text-gray-900">{stats.averageRating ? Number(stats.averageRating).toFixed(1) : '0.0'}</p>
                  <span className="text-yellow-500 text-xl mb-1">⭐</span>
                </div>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <span className="text-2xl">🏆</span>
              </div>
            </div>
            <p className="text-gray-500 text-xs mt-4">Basado en todas las reseñas</p>
          </div>

          {/* Total Views (Simulated for now if backend doesn't support) */}
          <div className="bg-white rounded-lg shadow p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Visitas Totales</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalViews || 0}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <span className="text-2xl">👁️</span>
              </div>
            </div>
            <p className="text-green-600 text-sm mt-4 font-medium flex items-center">
              <span className="mr-1">↗</span> +12% esta semana
            </p>
          </div>
        </div>

        {/* Quick Actions Grid */}
        <h2 className="text-xl font-bold text-gray-900 mb-4">Gestión Rápida</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link to="/owner/businesses" className="group bg-white rounded-lg shadow hover:shadow-md transition-all p-6 flex flex-col items-center text-center border border-gray-100 hover:border-blue-300">
            <div className="bg-blue-50 text-blue-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              🏢
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Gestionar Negocios</h3>
            <p className="text-gray-500 text-sm">Edita información, horarios y ubicación de tus locales.</p>
          </Link>

          <Link to="/owner/reviews" className="group bg-white rounded-lg shadow hover:shadow-md transition-all p-6 flex flex-col items-center text-center border border-gray-100 hover:border-purple-300">
            <div className="bg-purple-50 text-purple-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              💭
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Responder Reseñas</h3>
            <p className="text-gray-500 text-sm">Interactúa con tus clientes y gestiona su feedback.</p>
          </Link>

          <Link to="/owner/profile" className="group bg-white rounded-lg shadow hover:shadow-md transition-all p-6 flex flex-col items-center text-center border border-gray-100 hover:border-green-300">
            <div className="bg-green-50 text-green-600 w-16 h-16 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">
              👤
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Mi Perfil</h3>
            <p className="text-gray-500 text-sm">Actualiza tus datos de contacto y preferencias.</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
