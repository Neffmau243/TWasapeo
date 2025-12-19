import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as adminService from '../../services/adminService';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { Review } from '../../types/review.types';

interface ReviewWithDetails extends Review {
  business?: {
    id: string;
    name: string;
    slug: string;
    logo?: string;
  };
  _count?: {
    reactions: number;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const ReviewsModerate: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Paginación y filtros
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    businessId: '',
    userId: '',
    minRating: '',
    maxRating: '',
  });
  
  // Modales
  const [deleteModal, setDeleteModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewWithDetails | null>(null);
  const [deleteReason, setDeleteReason] = useState('');

  useEffect(() => {
    loadReviews();
  }, [pagination.page, filters]);

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };
      
      if (filters.businessId) params.businessId = filters.businessId;
      if (filters.userId) params.userId = filters.userId;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.maxRating) params.maxRating = filters.maxRating;

      const response = await adminService.getAllReviews(params);
      
      if (response.success) {
        setReviews(response.data.reviews || []);
        setPagination(response.data.pagination || pagination);
      }
    } catch (err: any) {
      console.error('Error loading reviews:', err);
      if (err.response?.status !== 429) {
        setError(err.response?.data?.message || 'Error al cargar las reseñas');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedReview) return;

    try {
      setError(null);
      const response = await adminService.deleteReview(selectedReview.id);
      
      if (response.success) {
        setSuccess('Reseña eliminada exitosamente');
        setDeleteModal(false);
        setSelectedReview(null);
        setDeleteReason('');
        loadReviews();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Error deleting review:', err);
      setError(err.response?.data?.message || 'Error al eliminar la reseña');
    }
  };

  const openDeleteModal = (review: ReviewWithDetails) => {
    setSelectedReview(review);
    setDeleteReason('');
    setDeleteModal(true);
  };

  const openDetailModal = (review: ReviewWithDetails) => {
    setSelectedReview(review);
    setDetailModal(true);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          >
            ★
          </span>
        ))}
        <span className="ml-2 text-sm text-gray-600">({rating}/5)</span>
      </div>
    );
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters({ ...filters, [key]: value });
    setPagination({ ...pagination, page: 1 });
  };

  const clearFilters = () => {
    setFilters({
      businessId: '',
      userId: '',
      minRating: '',
      maxRating: '',
    });
    setPagination({ ...pagination, page: 1 });
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Moderar Reseñas</h1>
          <p className="text-gray-600">Gestiona y modera las reseñas de la plataforma</p>
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

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">{pagination.total}</div>
            <div className="text-gray-600">Total de reseñas</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600 mb-2">
              {reviews.filter(r => r.rating >= 4).length}
            </div>
            <div className="text-gray-600">Reseñas positivas (4+)</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-orange-600 mb-2">
              {reviews.filter(r => r.rating === 3).length}
            </div>
            <div className="text-gray-600">Reseñas neutras (3)</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-red-600 mb-2">
              {reviews.filter(r => r.rating <= 2).length}
            </div>
            <div className="text-gray-600">Reseñas negativas (≤2)</div>
          </div>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Filtros</h2>
            <Button
              onClick={clearFilters}
              variant="secondary"
              className="text-xs"
            >
              Limpiar filtros
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de Negocio
              </label>
              <Input
                type="text"
                placeholder="Filtrar por negocio..."
                value={filters.businessId}
                onChange={(e) => handleFilterChange('businessId', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de Usuario
              </label>
              <Input
                type="text"
                placeholder="Filtrar por usuario..."
                value={filters.userId}
                onChange={(e) => handleFilterChange('userId', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating mínimo
              </label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="1">1 estrella</option>
                <option value="2">2 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="5">5 estrellas</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rating máximo
              </label>
              <select
                value={filters.maxRating}
                onChange={(e) => handleFilterChange('maxRating', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos</option>
                <option value="1">1 estrella</option>
                <option value="2">2 estrellas</option>
                <option value="3">3 estrellas</option>
                <option value="4">4 estrellas</option>
                <option value="5">5 estrellas</option>
              </select>
            </div>
          </div>
        </div>

        {/* Lista de reseñas */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontraron reseñas</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Usuario
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Negocio
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rating
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Reseña
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
                    {reviews.map((review) => (
                      <tr key={review.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.user && (
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <Avatar
                                  src={review.user.avatar}
                                  alt={review.user.name}
                                  size="sm"
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {review.user.name}
                                </div>
                                <div className="text-sm text-gray-500">{review.user.email}</div>
                              </div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {review.business && (
                            <Link
                              to={`/business/${review.business.slug}`}
                              className="flex items-center hover:text-blue-600 transition-colors"
                            >
                              {review.business.logo && (
                                <img
                                  src={review.business.logo}
                                  alt={review.business.name}
                                  className="h-8 w-8 rounded mr-2 object-cover"
                                />
                              )}
                              <div>
                                <div className="text-sm font-medium text-gray-900">
                                  {review.business.name}
                                </div>
                                <div className="text-xs text-gray-500">Ver negocio →</div>
                              </div>
                            </Link>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {renderStars(review.rating)}
                        </td>
                        <td className="px-6 py-4">
                          <div className="max-w-md">
                            {review.title && (
                              <div className="text-sm font-medium text-gray-900 mb-1">
                                {review.title}
                              </div>
                            )}
                            <div className="text-sm text-gray-600 line-clamp-2">
                              {review.comment || review.content || 'Sin comentario'}
                            </div>
                            {review.images && review.images.length > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                📷 {review.images.length} imagen(es)
                              </div>
                            )}
                            {review._count && review._count.reactions > 0 && (
                              <div className="text-xs text-gray-500 mt-1">
                                👍 {review._count.reactions} reacciones
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(review.createdAt)}
                          {review.updatedAt !== review.createdAt && (
                            <div className="text-xs text-gray-400 mt-1">(editada)</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openDetailModal(review)}
                              variant="secondary"
                              className="text-xs px-3 py-1"
                            >
                              Ver detalles
                            </Button>
                            <Button
                              onClick={() => openDeleteModal(review)}
                              variant="danger"
                              className="text-xs px-3 py-1"
                            >
                              Eliminar
                            </Button>
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

        {/* Modal de detalles */}
        <Modal
          isOpen={detailModal}
          onClose={() => {
            setDetailModal(false);
            setSelectedReview(null);
          }}
          title="Detalles de la Reseña"
        >
          {selectedReview && (
            <div className="space-y-4">
              {/* Usuario */}
              {selectedReview.user && (
                <div className="flex items-center gap-4 pb-4 border-b">
                  <Avatar
                    src={selectedReview.user.avatar}
                    alt={selectedReview.user.name}
                    size="md"
                  />
                  <div>
                    <div className="font-medium text-gray-900">{selectedReview.user.name}</div>
                    <div className="text-sm text-gray-500">{selectedReview.user.email}</div>
                  </div>
                </div>
              )}

              {/* Negocio */}
              {selectedReview.business && (
                <div className="pb-4 border-b">
                  <span className="text-sm font-medium text-gray-500">Negocio:</span>
                  <Link
                    to={`/business/${selectedReview.business.slug}`}
                    className="flex items-center gap-2 mt-1 text-blue-600 hover:text-blue-700"
                  >
                    {selectedReview.business.logo && (
                      <img
                        src={selectedReview.business.logo}
                        alt={selectedReview.business.name}
                        className="h-8 w-8 rounded object-cover"
                      />
                    )}
                    <span className="font-medium">{selectedReview.business.name}</span>
                  </Link>
                </div>
              )}

              {/* Rating */}
              <div>
                <span className="text-sm font-medium text-gray-500">Calificación:</span>
                <div className="mt-1">{renderStars(selectedReview.rating)}</div>
              </div>

              {/* Contenido */}
              <div>
                <span className="text-sm font-medium text-gray-500">Título:</span>
                <p className="mt-1 text-gray-900 font-medium">
                  {selectedReview.title || 'Sin título'}
                </p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-500">Comentario:</span>
                <p className="mt-1 text-gray-900 whitespace-pre-wrap">
                  {selectedReview.comment || selectedReview.content || 'Sin comentario'}
                </p>
              </div>

              {/* Imágenes */}
              {selectedReview.images && selectedReview.images.length > 0 && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Imágenes:</span>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {selectedReview.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Imagen ${index + 1}`}
                        className="w-full h-32 object-cover rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Respuesta del dueño */}
              {selectedReview.ownerResponse && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <span className="text-sm font-medium text-blue-800">Respuesta del dueño:</span>
                  <p className="mt-1 text-blue-900">{selectedReview.ownerResponse}</p>
                  {selectedReview.ownerResponseDate && (
                    <p className="text-xs text-blue-700 mt-1">
                      {formatDate(selectedReview.ownerResponseDate)}
                    </p>
                  )}
                </div>
              )}

              {/* Estadísticas */}
              {selectedReview._count && (
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Reacciones:</span> {selectedReview._count.reactions}
                </div>
              )}

              {/* Fechas */}
              <div className="text-sm text-gray-500 pt-4 border-t">
                <div>
                  <span className="font-medium">Creada:</span> {formatDate(selectedReview.createdAt)}
                </div>
                {selectedReview.updatedAt !== selectedReview.createdAt && (
                  <div className="mt-1">
                    <span className="font-medium">Editada:</span> {formatDate(selectedReview.updatedAt)}
                  </div>
                )}
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setDetailModal(false);
                    openDeleteModal(selectedReview);
                  }}
                  variant="danger"
                  className="flex-1"
                >
                  Eliminar reseña
                </Button>
                <Button
                  onClick={() => {
                    setDetailModal(false);
                    setSelectedReview(null);
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cerrar
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal eliminar */}
        <Modal
          isOpen={deleteModal}
          onClose={() => {
            setDeleteModal(false);
            setSelectedReview(null);
            setDeleteReason('');
          }}
          title="Eliminar Reseña"
        >
          {selectedReview && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  ⚠️ Advertencia
                </p>
                <p className="text-sm text-red-700">
                  Esta acción eliminará permanentemente la reseña. Esta acción no se puede deshacer.
                </p>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="text-sm font-medium text-gray-700 mb-2">Reseña a eliminar:</div>
                <div className="text-sm text-gray-600">
                  <div className="mb-1">
                    <span className="font-medium">Usuario:</span> {selectedReview.user?.name}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Negocio:</span> {selectedReview.business?.name}
                  </div>
                  <div className="mb-1">
                    <span className="font-medium">Rating:</span> {renderStars(selectedReview.rating)}
                  </div>
                  <div className="line-clamp-2">
                    <span className="font-medium">Comentario:</span>{' '}
                    {selectedReview.comment || selectedReview.content || 'Sin comentario'}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón de eliminación (opcional)
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  placeholder="Motivo de la eliminación (para registro interno)..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  className="flex-1"
                >
                  Eliminar permanentemente
                </Button>
                <Button
                  onClick={() => {
                    setDeleteModal(false);
                    setSelectedReview(null);
                    setDeleteReason('');
                  }}
                  variant="secondary"
                  className="flex-1"
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default ReviewsModerate;
