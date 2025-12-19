import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import * as ownerService from '../../services/ownerService';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { Review } from '../../types/review.types';
import { useNotification } from '../../context/NotificationContext';

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

interface BusinessOption {
  id: string;
  name: string;
}

const ReviewsManagePage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [reviews, setReviews] = useState<ReviewWithDetails[]>([]);
  const [businesses, setBusinesses] = useState<BusinessOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Paginación y filtros
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  const [filters, setFilters] = useState({
    businessId: '',
    minRating: '',
    maxRating: '',
  });

  // Modales
  const [respondModal, setRespondModal] = useState(false);
  const [editResponseModal, setEditResponseModal] = useState(false);
  const [deleteResponseModal, setDeleteResponseModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState<ReviewWithDetails | null>(null);
  const [responseText, setResponseText] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadBusinesses();
    loadReviews();
  }, [pagination.page, filters]);

  const loadBusinesses = async () => {
    try {
      const response = await ownerService.getMyBusinesses({ limit: '100' });
      if (response.success && response.data?.businesses) {
        setBusinesses(
          response.data.businesses.map((b: any) => ({
            id: b.id,
            name: b.name,
          }))
        );
      }
    } catch (err: any) {
      console.error('Error loading businesses:', err);
    }
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };

      if (filters.businessId) params.businessId = filters.businessId;
      if (filters.minRating) params.minRating = filters.minRating;
      if (filters.maxRating) params.maxRating = filters.maxRating;

      const response = await ownerService.getMyReviews(params);

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

  const handleRespond = async () => {
    if (!selectedReview || !responseText.trim()) {
      showError('Por favor, escribe una respuesta');
      return;
    }

    try {
      setSaving(true);
      const response = await ownerService.respondToReview(selectedReview.id, responseText.trim());

      if (response.success) {
        showSuccess('Respuesta agregada exitosamente');
        setRespondModal(false);
        setSelectedReview(null);
        setResponseText('');
        loadReviews();
      }
    } catch (err: any) {
      console.error('Error responding to review:', err);
      showError(err.response?.data?.message || 'Error al responder a la reseña');
    } finally {
      setSaving(false);
    }
  };

  const handleUpdateResponse = async () => {
    if (!selectedReview || !responseText.trim()) {
      showError('Por favor, escribe una respuesta');
      return;
    }

    try {
      setSaving(true);
      const response = await ownerService.updateReviewResponse(
        selectedReview.id,
        responseText.trim()
      );

      if (response.success) {
        showSuccess('Respuesta actualizada exitosamente');
        setEditResponseModal(false);
        setSelectedReview(null);
        setResponseText('');
        loadReviews();
      }
    } catch (err: any) {
      console.error('Error updating response:', err);
      showError(err.response?.data?.message || 'Error al actualizar la respuesta');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteResponse = async () => {
    if (!selectedReview) return;

    try {
      setSaving(true);
      const response = await ownerService.deleteReviewResponse(selectedReview.id);

      if (response.success) {
        showSuccess('Respuesta eliminada exitosamente');
        setDeleteResponseModal(false);
        setSelectedReview(null);
        loadReviews();
      }
    } catch (err: any) {
      console.error('Error deleting response:', err);
      showError(err.response?.data?.message || 'Error al eliminar la respuesta');
    } finally {
      setSaving(false);
    }
  };

  const openRespondModal = (review: ReviewWithDetails) => {
    setSelectedReview(review);
    setResponseText('');
    setRespondModal(true);
  };

  const openEditResponseModal = (review: ReviewWithDetails) => {
    setSelectedReview(review);
    setResponseText(review.ownerResponse || review.ownerReply || '');
    setEditResponseModal(true);
  };

  const openDeleteResponseModal = (review: ReviewWithDetails) => {
    setSelectedReview(review);
    setDeleteResponseModal(true);
  };

  const formatDate = (dateString: string | undefined | null) => {
    if (!dateString) return 'Fecha desconocida';
    try {
      return new Date(dateString).toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return 'Fecha inválida';
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            key={star}
            className={`text-lg ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
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
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestionar Reseñas</h1>
          <p className="text-gray-600">Responde y gestiona las reseñas de tus negocios</p>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">{pagination.total}</div>
            <div className="text-gray-600">Total de reseñas</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-green-600 mb-2">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Negocio
              </label>
              <select
                value={filters.businessId}
                onChange={(e) => handleFilterChange('businessId', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los negocios</option>
                {businesses.map((business) => (
                  <option key={business.id} value={business.id}>
                    {business.name}
                  </option>
                ))}
              </select>
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
              <div className="divide-y divide-gray-200">
                {reviews.map((review) => (
                  <div key={review.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex flex-col md:flex-row gap-4">
                      {/* Usuario */}
                      <div className="flex items-start gap-4 flex-shrink-0">
                        {review.user && (
                          <Avatar
                            src={review.user.avatar}
                            alt={review.user.name}
                            size="md"
                          />
                        )}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium text-gray-900">
                              {review.user?.name || 'Usuario anónimo'}
                            </h3>
                            {review.business && (
                              <Link
                                to={`/business/${review.business.slug}`}
                                className="text-sm text-blue-600 hover:text-blue-700"
                              >
                                → {review.business.name}
                              </Link>
                            )}
                          </div>
                          <div className="mb-2">{renderStars(review.rating)}</div>
                          <p className="text-gray-700 mb-3">{review.comment || review.content}</p>
                          <div className="text-sm text-gray-500">
                            {formatDate(review.createdAt)}
                            {review.isEdited && (
                              <span className="ml-2 text-gray-400">(editada)</span>
                            )}
                          </div>

                          {/* Respuesta del owner */}
                          {(review.ownerResponse || review.ownerReply) && (
                            <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-blue-800">
                                  Tu respuesta:
                                </span>
                                {(review.ownerResponseDate || review.ownerReplyDate) && (
                                  <span className="text-xs text-blue-600">
                                    {formatDate(review.ownerResponseDate || review.ownerReplyDate || '')}
                                  </span>
                                )}
                              </div>
                              <p className="text-blue-900">{review.ownerResponse || review.ownerReply}</p>
                              <div className="flex gap-2 mt-3">
                                <Button
                                  onClick={() => openEditResponseModal(review)}
                                  variant="secondary"
                                  className="text-xs px-3 py-1"
                                >
                                  ✏️ Editar respuesta
                                </Button>
                                <Button
                                  onClick={() => openDeleteResponseModal(review)}
                                  variant="danger"
                                  className="text-xs px-3 py-1"
                                >
                                  🗑️ Eliminar respuesta
                                </Button>
                              </div>
                            </div>
                          )}

                          {/* Botón para responder si no hay respuesta */}
                          {!review.ownerResponse && !review.ownerReply && (
                            <div className="mt-4">
                              <Button
                                onClick={() => openRespondModal(review)}
                                variant="primary"
                                className="text-sm"
                              >
                                💬 Responder
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
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

        {/* Modal responder */}
        <Modal
          isOpen={respondModal}
          onClose={() => {
            setRespondModal(false);
            setSelectedReview(null);
            setResponseText('');
          }}
          title="Responder a la Reseña"
        >
          {selectedReview && (
            <div className="space-y-4">
              <div className="bg-gray-50 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Avatar
                    src={selectedReview.user?.avatar}
                    alt={selectedReview.user?.name || 'Usuario'}
                    size="sm"
                  />
                  <div>
                    <div className="font-medium text-gray-900">
                      {selectedReview.user?.name || 'Usuario anónimo'}
                    </div>
                    <div className="text-sm text-gray-600">
                      {selectedReview.business?.name}
                    </div>
                  </div>
                </div>
                <div className="mb-2">{renderStars(selectedReview.rating)}</div>
                <p className="text-gray-700 text-sm">{selectedReview.comment || selectedReview.content}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu respuesta
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Tu respuesta será visible públicamente en la página del negocio.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleRespond}
                  variant="primary"
                  disabled={saving || !responseText.trim()}
                  className="flex-1"
                >
                  {saving ? 'Enviando...' : 'Enviar respuesta'}
                </Button>
                <Button
                  onClick={() => {
                    setRespondModal(false);
                    setSelectedReview(null);
                    setResponseText('');
                  }}
                  variant="secondary"
                  className="flex-1"
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal editar respuesta */}
        <Modal
          isOpen={editResponseModal}
          onClose={() => {
            setEditResponseModal(false);
            setSelectedReview(null);
            setResponseText('');
          }}
          title="Editar Respuesta"
        >
          {selectedReview && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tu respuesta
                </label>
                <textarea
                  value={responseText}
                  onChange={(e) => setResponseText(e.target.value)}
                  placeholder="Escribe tu respuesta aquí..."
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUpdateResponse}
                  variant="primary"
                  disabled={saving || !responseText.trim()}
                  className="flex-1"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <Button
                  onClick={() => {
                    setEditResponseModal(false);
                    setSelectedReview(null);
                    setResponseText('');
                  }}
                  variant="secondary"
                  className="flex-1"
                  disabled={saving}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal eliminar respuesta */}
        <Modal
          isOpen={deleteResponseModal}
          onClose={() => {
            setDeleteResponseModal(false);
            setSelectedReview(null);
          }}
          title="Eliminar Respuesta"
        >
          {selectedReview && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  ⚠️ Advertencia
                </p>
                <p className="text-sm text-red-700">
                  ¿Estás seguro de que quieres eliminar tu respuesta? Esta acción no se puede deshacer.
                </p>
              </div>

              {(selectedReview.ownerResponse || selectedReview.ownerReply) && (
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Respuesta actual:</p>
                  <p className="text-sm text-gray-600">
                    {selectedReview.ownerResponse || selectedReview.ownerReply}
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleDeleteResponse}
                  variant="danger"
                  disabled={saving}
                  className="flex-1"
                >
                  {saving ? 'Eliminando...' : 'Sí, eliminar'}
                </Button>
                <Button
                  onClick={() => {
                    setDeleteResponseModal(false);
                    setSelectedReview(null);
                  }}
                  variant="secondary"
                  className="flex-1"
                  disabled={saving}
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

export default ReviewsManagePage;
