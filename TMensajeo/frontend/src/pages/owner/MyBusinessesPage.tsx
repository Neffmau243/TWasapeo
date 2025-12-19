import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import * as ownerService from '../../services/ownerService';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { Business } from '../../types/business.types';

interface BusinessWithDetails extends Business {
  category?: {
    id: string;
    name: string;
    slug: string;
    icon?: string;
  };
  _count?: {
    reviews: number;
    images: number;
    events: number;
    faqs: number;
    favorites: number;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface OwnerStats {
  totalBusinesses: number;
  totalReviews: number;
  totalViews: number;
  averageRating: number;
}

const MyBusinessesPage: React.FC = () => {
  const navigate = useNavigate();
  const [businesses, setBusinesses] = useState<BusinessWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estadísticas generales
  const [stats, setStats] = useState<OwnerStats>({
    totalBusinesses: 0,
    totalReviews: 0,
    totalViews: 0,
    averageRating: 0,
  });
  
  // Paginación y filtros
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
  });
  const [statusFilter, setStatusFilter] = useState<string>('');
  
  // Modal de estadísticas
  const [statsModal, setStatsModal] = useState(false);
  const [selectedBusinessStats, setSelectedBusinessStats] = useState<any>(null);
  const [loadingStats, setLoadingStats] = useState(false);

  useEffect(() => {
    loadBusinesses();
    loadOwnerStats();
  }, [pagination.page, statusFilter]);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };
      
      if (statusFilter) {
        params.status = statusFilter;
      }

      const response = await ownerService.getMyBusinesses(params);
      
      if (response.success) {
        setBusinesses(response.data.businesses || []);
        setPagination(response.data.pagination || pagination);
      }
    } catch (err: any) {
      console.error('Error loading businesses:', err);
      if (err.response?.status !== 429) {
        setError(err.response?.data?.message || 'Error al cargar tus negocios');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadOwnerStats = async () => {
    try {
      const response = await ownerService.getStats();
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error('Error loading owner stats:', err);
    }
  };

  const loadBusinessStats = async (businessId: string) => {
    try {
      setLoadingStats(true);
      const response = await ownerService.getBusinessStats(businessId);
      if (response.success && response.data) {
        setSelectedBusinessStats(response.data);
        setStatsModal(true);
      }
    } catch (err: any) {
      console.error('Error loading business stats:', err);
      setError('Error al cargar las estadísticas del negocio');
    } finally {
      setLoadingStats(false);
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'success';
      case 'PENDING':
        return 'warning';
      case 'REJECTED':
        return 'danger';
      case 'INACTIVE':
        return 'secondary';
      default:
        return 'info';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'Aprobado';
      case 'PENDING':
        return 'Pendiente';
      case 'REJECTED':
        return 'Rechazado';
      case 'INACTIVE':
        return 'Inactivo';
      default:
        return status;
    }
  };

  const renderStars = (rating: number) => {
    if (!rating || rating === 0) return <span className="text-gray-400">Sin calificación</span>;
    
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-sm ${
              star <= Math.round(rating) ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating.toFixed(1)})</span>
      </div>
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Mis Negocios</h1>
            <p className="text-gray-600">Gestiona todos tus negocios en un solo lugar</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Button
              onClick={() => navigate('/owner/businesses/create')}
              variant="primary"
            >
              + Crear Nuevo Negocio
            </Button>
          </div>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {/* Estadísticas generales */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">{stats.totalBusinesses}</div>
            <div className="text-gray-600">Total de negocios</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600 mb-2">{stats.totalReviews}</div>
            <div className="text-gray-600">Total de reseñas</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-purple-600 mb-2">{stats.totalViews}</div>
            <div className="text-gray-600">Total de vistas</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {stats.averageRating > 0 ? stats.averageRating.toFixed(1) : '0.0'}
            </div>
            <div className="text-gray-600">Rating promedio</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los estados</option>
                <option value="PENDING">Pendientes</option>
                <option value="APPROVED">Aprobados</option>
                <option value="REJECTED">Rechazados</option>
                <option value="INACTIVE">Inactivos</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de negocios */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : businesses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">
                {statusFilter 
                  ? `No tienes negocios con estado "${getStatusLabel(statusFilter)}"`
                  : 'Aún no has creado ningún negocio'}
              </p>
              {!statusFilter && (
                <Button
                  onClick={() => navigate('/owner/businesses/create')}
                  variant="primary"
                >
                  Crear mi primer negocio
                </Button>
              )}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Negocio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estadísticas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {businesses.map((business) => (
                      <tr key={business.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            {business.logo && (
                              <div className="flex-shrink-0 h-12 w-12 mr-4">
                                <img
                                  src={business.logo}
                                  alt={business.name}
                                  className="h-12 w-12 rounded-lg object-cover"
                                />
                              </div>
                            )}
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {business.name}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {business.description}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {business.address}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {business.category && (
                            <Badge variant="info">{business.category.name}</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getStatusBadgeVariant(business.status) as any}>
                            {getStatusLabel(business.status)}
                          </Badge>
                          {business.isVerified && (
                            <Badge variant="success" className="ml-2">✓ Verificado</Badge>
                          )}
                          {business.isFeatured && (
                            <Badge variant="primary" className="ml-2">⭐ Destacado</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {business._count && (
                            <div className="space-y-1">
                              <div>👁️ {business.viewCount || 0} vistas</div>
                              <div>⭐ {business._count.reviews} reseñas</div>
                              <div>📸 {business._count.images} imágenes</div>
                              <div>❤️ {business._count.favorites || 0} favoritos</div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStars(business.averageRating)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(business.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => loadBusinessStats(business.id)}
                              variant="secondary"
                              className="text-xs px-3 py-1"
                              disabled={loadingStats}
                            >
                              📊 Stats
                            </Button>
                            <Link to={`/business/${business.slug}`}>
                              <Button
                                variant="secondary"
                                className="text-xs px-3 py-1"
                              >
                                👁️ Ver
                              </Button>
                            </Link>
                            <Link to={`/owner/businesses/${business.id}/edit`}>
                              <Button
                                variant="primary"
                                className="text-xs px-3 py-1"
                              >
                                ✏️ Editar
                              </Button>
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Paginación */}
              {pagination.totalPages > 1 && (
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.totalPages}
                  onPageChange={(page) => setPagination({ ...pagination, page })}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                />
              )}
            </>
          )}
        </div>

        {/* Modal de estadísticas */}
        <Modal
          isOpen={statsModal}
          onClose={() => {
            setStatsModal(false);
            setSelectedBusinessStats(null);
          }}
          title="Estadísticas del Negocio"
        >
          {loadingStats ? (
            <div className="flex items-center justify-center py-8">
              <Spinner />
            </div>
          ) : selectedBusinessStats ? (
            <div className="space-y-6">
              {/* Información básica */}
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">
                  {selectedBusinessStats.business?.name}
                </h3>
                <Badge variant={getStatusBadgeVariant(selectedBusinessStats.business?.status) as any}>
                  {getStatusLabel(selectedBusinessStats.business?.status)}
                </Badge>
              </div>

              {/* Estadísticas principales */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {selectedBusinessStats.counts?.reviews || 0}
                  </div>
                  <div className="text-sm text-gray-600">Reseñas</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {selectedBusinessStats.business?.averageRating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-gray-600">Rating promedio</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {selectedBusinessStats.business?.viewCount || 0}
                  </div>
                  <div className="text-sm text-gray-600">Vistas</div>
                </div>
                <div className="bg-red-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-red-600">
                    {selectedBusinessStats.counts?.favorites || 0}
                  </div>
                  <div className="text-sm text-gray-600">Favoritos</div>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {selectedBusinessStats.counts?.images || 0}
                  </div>
                  <div className="text-sm text-gray-600">Imágenes</div>
                </div>
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="text-2xl font-bold text-indigo-600">
                    {selectedBusinessStats.counts?.following || 0}
                  </div>
                  <div className="text-sm text-gray-600">Siguiendo</div>
                </div>
              </div>

              {/* Distribución de ratings */}
              {selectedBusinessStats.ratingDistribution && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Distribución de Ratings</h4>
                  <div className="space-y-2">
                    {[5, 4, 3, 2, 1].map((rating) => {
                      const count = selectedBusinessStats.ratingDistribution.find(
                        (r: any) => r.rating === rating
                      )?._count?.rating || 0;
                      const total = selectedBusinessStats.counts?.reviews || 1;
                      const percentage = (count / total) * 100;
                      
                      return (
                        <div key={rating} className="flex items-center gap-3">
                          <div className="w-8 text-sm font-medium text-gray-600">
                            {rating} ⭐
                          </div>
                          <div className="flex-1 bg-gray-200 rounded-full h-4">
                            <div
                              className="bg-yellow-400 h-4 rounded-full"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <div className="w-12 text-sm text-gray-600 text-right">
                            {count}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Reseñas recientes */}
              {selectedBusinessStats.recentReviews && selectedBusinessStats.recentReviews.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-800 mb-3">Reseñas Recientes</h4>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {selectedBusinessStats.recentReviews.map((review: any) => (
                      <div key={review.id} className="bg-gray-50 rounded-lg p-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            {review.user?.avatar && (
                              <Avatar src={review.user.avatar} alt={review.user.name} size="sm" />
                            )}
                            <span className="text-sm font-medium text-gray-900">
                              {review.user?.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <span
                                key={star}
                                className={`text-xs ${
                                  star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                }`}
                              >
                                ★
                              </span>
                            ))}
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {review.comment}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Link
                  to={`/owner/businesses/${selectedBusinessStats.business?.id}/edit`}
                  className="flex-1"
                >
                  <Button variant="primary" className="w-full">
                    Editar Negocio
                  </Button>
                </Link>
                <Link
                  to={`/business/${selectedBusinessStats.business?.slug || selectedBusinessStats.business?.id}`}
                  className="flex-1"
                >
                  <Button variant="secondary" className="w-full">
                    Ver Público
                  </Button>
                </Link>
              </div>
            </div>
          ) : null}
        </Modal>
      </div>
    </div>
  );
};

export default MyBusinessesPage;
