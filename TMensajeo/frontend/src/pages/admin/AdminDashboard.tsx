import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../../services/adminService';
import Spinner from '../../components/common/Spinner';

interface AdminStats {
  overview: {
    totalUsers: number;
    totalBusinesses: number;
    totalReviews: number;
    totalCategories: number;
  };
  businessesByStatus: {
    PENDING?: number;
    APPROVED?: number;
    REJECTED?: number;
    INACTIVE?: number;
  };
  usersByRole: {
    USER?: number;
    OWNER?: number;
    ADMIN?: number;
  };
  topRatedBusinesses: Array<{
    id: string;
    name: string;
    slug: string;
    averageRating: number;
    reviewCount: number;
  }>;
  recentActivity: Array<{
    id: string;
    name: string;
    status: string;
    createdAt: string;
    owner: {
      name: string;
      email: string;
    };
  }>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminService.getStats();
      
      if (response.success && response.data) {
        setStats(response.data);
      } else {
        setError('No se pudieron cargar las estadísticas');
      }
    } catch (err: any) {
      console.error('❌ Error loading stats:', err);
      setError(err.response?.data?.message || 'Error al cargar las estadísticas');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error || 'Error al cargar las estadísticas'}</p>
          <button
            onClick={loadStats}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  const { overview, businessesByStatus } = stats;
  const pendingBusinesses = businessesByStatus?.PENDING || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Panel de Administración</h1>
          <p className="text-gray-600 mt-1">Gestiona todos los aspectos de la plataforma</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Mensaje de error */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Usuarios</p>
                <p className="text-3xl font-bold text-gray-900">{overview.totalUsers || 0}</p>
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Negocios</p>
                <p className="text-3xl font-bold text-gray-900">{overview.totalBusinesses || 0}</p>
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
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Negocios Pendientes</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingBusinesses}</p>
              </div>
              <div className="bg-yellow-100 rounded-full p-3">
                <span className="text-3xl">⏳</span>
              </div>
            </div>
            <Link to="/admin/businesses/pending" className="text-yellow-600 hover:text-yellow-700 text-sm mt-4 inline-block">
              Revisar →
            </Link>
          </div>

          {/* Total Reviews */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Total Reseñas</p>
                <p className="text-3xl font-bold text-gray-900">{overview.totalReviews || 0}</p>
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
                      <p className="text-sm text-gray-600">Ver y editar todos los negocios</p>
                    </div>
                  </div>
                  <span className="text-gray-400">→</span>
                </div>
              </Link>

              <Link
                to="/admin/businesses/pending"
                className="block p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">⏳</span>
                    <div>
                      <p className="font-semibold text-gray-900">Negocios Pendientes</p>
                      <p className="text-sm text-gray-600">Aprobar o rechazar negocios pendientes</p>
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
                    <span className="font-semibold text-gray-900">{overview.totalCategories || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Negocios aprobados:</span>
                    <span className="font-semibold text-green-600">{businessesByStatus?.APPROVED || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Negocios rechazados:</span>
                    <span className="font-semibold text-red-600">{businessesByStatus?.REJECTED || 0}</span>
                  </div>
                  {stats.usersByRole && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Dueños:</span>
                      <span className="font-semibold text-gray-900">{stats.usersByRole.OWNER || 0}</span>
                    </div>
                  )}
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

