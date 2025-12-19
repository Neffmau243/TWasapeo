import React, { useState, useEffect } from 'react';
import * as adminService from '../../services/adminService';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { Business } from '../../types/business.types';

interface BusinessWithDetails extends Business {
  owner?: {
    id: string;
    name: string;
    email: string;
    phone?: string;
  };
  category?: {
    id: string;
    name: string;
    slug: string;
  };
  _count?: {
    images: number;
    events: number;
    faqs: number;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const PendingBusinessesPage: React.FC = () => {
  const [businesses, setBusinesses] = useState<BusinessWithDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Paginación
  const [pagination, setPagination] = useState<PaginationMeta>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
  });
  
  // Modales
  const [approveModal, setApproveModal] = useState(false);
  const [rejectModal, setRejectModal] = useState(false);
  const [detailModal, setDetailModal] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<BusinessWithDetails | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  useEffect(() => {
    loadPendingBusinesses();
  }, [pagination.page]);

  const loadPendingBusinesses = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };

      const response = await adminService.getPendingBusinesses(params);
      
      if (response.success) {
        setBusinesses(response.data?.businesses || []);
        setPagination(response.data?.pagination || pagination);
      } else {
        setError(response.message || 'Error al cargar los negocios pendientes');
      }
    } catch (err: any) {
      console.error('Error loading businesses:', err);
      if (err.response?.status !== 429) {
        setError(err.response?.data?.message || 'Error al cargar los negocios pendientes');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async () => {
    if (!selectedBusiness) return;

    try {
      setError(null);
      const response = await adminService.approveBusiness(selectedBusiness.id);
      
      if (response.success) {
        setSuccess(`Negocio "${selectedBusiness.name}" aprobado exitosamente`);
        setApproveModal(false);
        setSelectedBusiness(null);
        loadPendingBusinesses();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Error approving business:', err);
      setError(err.response?.data?.message || 'Error al aprobar el negocio');
    }
  };

  const handleReject = async () => {
    if (!selectedBusiness) return;

    if (!rejectReason.trim()) {
      setError('Por favor proporciona una razón para el rechazo');
      return;
    }

    try {
      setError(null);
      const response = await adminService.rejectBusiness(selectedBusiness.id, rejectReason);
      
      if (response.success) {
        setSuccess(`Negocio "${selectedBusiness.name}" rechazado`);
        setRejectModal(false);
        setSelectedBusiness(null);
        setRejectReason('');
        loadPendingBusinesses();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Error rejecting business:', err);
      setError(err.response?.data?.message || 'Error al rechazar el negocio');
    }
  };

  const openApproveModal = (business: BusinessWithDetails) => {
    setSelectedBusiness(business);
    setApproveModal(true);
  };

  const openRejectModal = (business: BusinessWithDetails) => {
    setSelectedBusiness(business);
    setRejectReason('');
    setRejectModal(true);
  };

  const openDetailModal = (business: BusinessWithDetails) => {
    setSelectedBusiness(business);
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Negocios Pendientes</h1>
          <p className="text-gray-600">Revisa y aprueba los negocios que están esperando aprobación</p>
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-yellow-600 mb-2">{pagination.total}</div>
            <div className="text-gray-600">Negocios pendientes</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-blue-600 mb-2">{businesses.length}</div>
            <div className="text-gray-600">En esta página</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="text-2xl font-bold text-gray-600 mb-2">{pagination.totalPages}</div>
            <div className="text-gray-600">Páginas totales</div>
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
              <p className="text-gray-600 text-lg mb-2">🎉 ¡Excelente trabajo!</p>
              <p className="text-gray-500">No hay negocios pendientes de aprobación en este momento.</p>
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
                        Dueño
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Información
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de solicitud
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
                              <div className="text-sm text-gray-500 line-clamp-2">
                                {business.description}
                              </div>
                              <div className="text-xs text-gray-400 mt-1">
                                {business.address}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {business.owner && (
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {business.owner.name}
                              </div>
                              <div className="text-sm text-gray-500">{business.owner.email}</div>
                              {business.owner.phone && (
                                <div className="text-sm text-gray-500">{business.owner.phone}</div>
                              )}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {business.category && (
                            <Badge variant="info">{business.category.name}</Badge>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {business._count && (
                            <div className="space-y-1">
                              <div>📸 {business._count.images} imágenes</div>
                              <div>📅 {business._count.events} eventos</div>
                              <div>❓ {business._count.faqs} FAQs</div>
                            </div>
                          )}
                          {business.phone && (
                            <div className="mt-2">📞 {business.phone}</div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {formatDate(business.createdAt)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openDetailModal(business)}
                              variant="secondary"
                              className="text-xs px-3 py-1"
                            >
                              Ver detalles
                            </Button>
                            <Button
                              onClick={() => openApproveModal(business)}
                              variant="primary"
                              className="text-xs px-3 py-1"
                            >
                              ✓ Aprobar
                            </Button>
                            <Button
                              onClick={() => openRejectModal(business)}
                              variant="danger"
                              className="text-xs px-3 py-1"
                            >
                              ✗ Rechazar
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
            setSelectedBusiness(null);
          }}
          title="Detalles del Negocio"
        >
          {selectedBusiness && (
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">{selectedBusiness.name}</h3>
                <p className="text-gray-600">{selectedBusiness.description}</p>
              </div>
              
              {selectedBusiness.logo && (
                <div>
                  <img
                    src={selectedBusiness.logo}
                    alt={selectedBusiness.name}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Categoría:</span>
                  <p className="text-gray-800">{selectedBusiness.category?.name}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Estado:</span>
                  <p>
                    <Badge variant="warning">
                      {selectedBusiness.status}
                    </Badge>
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Dirección:</span>
                  <p className="text-gray-800">{selectedBusiness.address}</p>
                </div>
                {selectedBusiness.phone && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                    <p className="text-gray-800">{selectedBusiness.phone}</p>
                  </div>
                )}
                {selectedBusiness.email && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Email:</span>
                    <p className="text-gray-800">{selectedBusiness.email}</p>
                  </div>
                )}
                {selectedBusiness.website && (
                  <div>
                    <span className="text-sm font-medium text-gray-500">Website:</span>
                    <a
                      href={selectedBusiness.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {selectedBusiness.website}
                    </a>
                  </div>
                )}
              </div>

              {selectedBusiness.owner && (
                <div className="border-t pt-4">
                  <h4 className="font-medium text-gray-800 mb-2">Información del Dueño</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-sm font-medium text-gray-500">Nombre:</span>
                      <p className="text-gray-800">{selectedBusiness.owner.name}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-500">Email:</span>
                      <p className="text-gray-800">{selectedBusiness.owner.email}</p>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4 border-t">
                <Button
                  onClick={() => {
                    setDetailModal(false);
                    openApproveModal(selectedBusiness);
                  }}
                  variant="primary"
                  className="flex-1"
                >
                  Aprobar
                </Button>
                <Button
                  onClick={() => {
                    setDetailModal(false);
                    openRejectModal(selectedBusiness);
                  }}
                  variant="danger"
                  className="flex-1"
                >
                  Rechazar
                </Button>
              </div>
            </div>
          )}
        </Modal>

        {/* Modal aprobar */}
        <Modal
          isOpen={approveModal}
          onClose={() => {
            setApproveModal(false);
            setSelectedBusiness(null);
          }}
          title="Aprobar Negocio"
        >
          {selectedBusiness && (
            <div className="space-y-4">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-800 font-medium mb-2">
                  ✓ Confirmar aprobación
                </p>
                <p className="text-sm text-green-700">
                  ¿Estás seguro de que deseas aprobar el negocio{' '}
                  <span className="font-medium">"{selectedBusiness.name}"</span>?
                </p>
                <p className="text-sm text-green-700 mt-2">
                  El dueño recibirá una notificación por email y el negocio será visible públicamente.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleApprove}
                  variant="primary"
                  className="flex-1"
                >
                  Sí, aprobar
                </Button>
                <Button
                  onClick={() => {
                    setApproveModal(false);
                    setSelectedBusiness(null);
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

        {/* Modal rechazar */}
        <Modal
          isOpen={rejectModal}
          onClose={() => {
            setRejectModal(false);
            setSelectedBusiness(null);
            setRejectReason('');
          }}
          title="Rechazar Negocio"
        >
          {selectedBusiness && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  ⚠️ Confirmar rechazo
                </p>
                <p className="text-sm text-red-700">
                  ¿Estás seguro de que deseas rechazar el negocio{' '}
                  <span className="font-medium">"{selectedBusiness.name}"</span>?
                </p>
                <p className="text-sm text-red-700 mt-2">
                  El dueño recibirá una notificación por email con la razón del rechazo.
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Razón del rechazo <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Explica por qué se rechaza el negocio..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Esta razón será enviada al dueño del negocio.
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleReject}
                  variant="danger"
                  className="flex-1"
                  disabled={!rejectReason.trim()}
                >
                  Rechazar
                </Button>
                <Button
                  onClick={() => {
                    setRejectModal(false);
                    setSelectedBusiness(null);
                    setRejectReason('');
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

export default PendingBusinessesPage;

