import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../../services/adminService';

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const response = await adminService.getStats();
      console.log('✅ Admin stats:', response);
      setStats(response.data || {});
    } catch (error) {
      console.error('❌ Error loading stats:', error);
      // Usar datos de prueba si falla
      setStats({
        totalUsers: 0,
        totalBusinesses: 0,
        pendingBusinesses: 0,
        totalReviews: 0,
        totalCategories: 0
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando estadísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-1">Gestiona todos los aspectos de la plataforma</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Usuarios</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalUsers || 0}</p>
              </div>
              <div className="bg-blue-100 rounded-full p-3">
                <span className="text-3xl">👥</span>
              </div>
            </div>
            <Link to="/admin/users" className="text-blue-600 hover:text-blue-700 text-sm mt-4 inline-block">
              Ver usuarios →
            </Link>
          </div>

          {/* Total Businesses */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Negocios</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalBusinesses || 0}</p>
              </div>
              <div className="bg-green-100 rounded-full p-3">
                <span className="text-3xl">🏪</span>
              </div>
            </div>
            <Link to="/admin/businesses" className="text-green-600 hover:text-green-700 text-sm mt-4 inline-block">
              Ver negocios →
            </Link>
          </div>

          {/* Pending Businesses */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Negocios Pendientes</p>
                <p className="text-3xl font-bold text-gray-900">{stats.pendingBusinesses || 0}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <span className="text-3xl">⏳</span>
              </div>
            </div>
            <Link to="/admin/businesses" className="text-yellow-600 hover:text-yellow-700 text-sm mt-4 inline-block">
              Revisar →
            </Link>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Reseñas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.totalReviews || 0}</p>
              </div>
              <div className="bg-purple-100 rounded-full p-3">
                <span className="text-3xl">⭐</span>
              </div>
            </div>
            <Link to="/admin/reviews" className="text-purple-600 hover:text-purple-700 text-sm mt-4 inline-block">
              Moderar →
            </Link>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Management Links */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Gestión</h2>
            <div className="space-y-3">
              <Link
                to="/admin/businesses"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🏪</span>
                    <div>
                      <p className="font-semibold text-gray-900">Gestión de Negocios</p>
                      <p className="text-sm text-gray-600">Aprobar, rechazar y gestionar negocios</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </Link>

              <Link
                to="/admin/users"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">👥</span>
                    <div>
                      <p className="font-semibold text-gray-900">Gestión de Usuarios</p>
                      <p className="text-sm text-gray-600">Administrar usuarios y roles</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </Link>

              <Link
                to="/admin/categories"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">📁</span>
                    <div>
                      <p className="font-semibold text-gray-900">Gestión de Categorías</p>
                      <p className="text-sm text-gray-600">Crear y editar categorías</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </Link>

              <Link
                to="/admin/reviews"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⭐</span>
                    <div>
                      <p className="font-semibold text-gray-900">Moderación de Reseñas</p>
                      <p className="text-sm text-gray-600">Revisar y moderar reseñas</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Stats and Info */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Estadísticas</h2>
            <Link
              to="/admin/stats"
              className="block p-4 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all text-white"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📊</span>
                  <div>
                    <p className="font-semibold">Ver Estadísticas Detalladas</p>
                    <p className="text-sm text-blue-100">Gráficos, métricas y análisis</p>
                  </div>
                </div>
                <span className="text-white">→</span>
              </div>
            </Link>

            <div className="mt-6 space-y-4">
              <div className="border-t pt-4">
                <h3 className="font-semibold text-gray-900 mb-3">Resumen</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Categorías:</span>
                    <span className="font-semibold text-gray-900">{stats.totalCategories || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuarios activos:</span>
                    <span className="font-semibold text-gray-900">{stats.activeUsers || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Reseñas hoy:</span>
                    <span className="font-semibold text-gray-900">{stats.reviewsToday || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
