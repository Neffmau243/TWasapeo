import React, { useState, useEffect } from 'react';
import * as adminService from '../../services/adminService';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Pagination from '../../components/common/Pagination';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { User } from '../../types/user.types';

interface UserWithStats extends User {
  _count?: {
    businesses: number;
    reviews: number;
    favorites: number;
  };
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

const UsersManagePage: React.FC = () => {
  const [users, setUsers] = useState<UserWithStats[]>([]);
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
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modales
  const [changeRoleModal, setChangeRoleModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserWithStats | null>(null);
  const [newRole, setNewRole] = useState<string>('');

  useEffect(() => {
    loadUsers();
  }, [pagination.page, roleFilter]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params: any = {
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
      };
      
      if (roleFilter) {
        params.role = roleFilter;
      }

      const response = await adminService.getAllUsers(params);
      
      if (response.success) {
        setUsers(response.data.users || []);
        setPagination(response.data.pagination || pagination);
      }
    } catch (err: any) {
      console.error('Error loading users:', err);
      setError(err.response?.data?.message || 'Error al cargar los usuarios');
    } finally {
      setLoading(false);
    }
  };

  const handleChangeRole = async () => {
    if (!selectedUser || !newRole) return;

    try {
      setError(null);
      const response = await adminService.changeUserRole(selectedUser.id, newRole);
      
      if (response.success) {
        setSuccess(`Rol de ${selectedUser.name} actualizado a ${newRole}`);
        setChangeRoleModal(false);
        setSelectedUser(null);
        setNewRole('');
        loadUsers();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Error changing role:', err);
      setError(err.response?.data?.message || 'Error al cambiar el rol');
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;

    try {
      setError(null);
      const response = await adminService.deleteUser(selectedUser.id);
      
      if (response.success) {
        setSuccess(`Usuario ${selectedUser.name} eliminado correctamente`);
        setDeleteModal(false);
        setSelectedUser(null);
        loadUsers();
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Error deleting user:', err);
      setError(err.response?.data?.message || 'Error al eliminar el usuario');
    }
  };

  const openChangeRoleModal = (user: UserWithStats) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setChangeRoleModal(true);
  };

  const openDeleteModal = (user: UserWithStats) => {
    setSelectedUser(user);
    setDeleteModal(true);
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'danger';
      case 'OWNER':
        return 'primary';
      case 'USER':
        return 'info';
      default:
        return 'secondary';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'ADMIN':
        return 'Administrador';
      case 'OWNER':
        return 'Dueño';
      case 'USER':
        return 'Usuario';
      default:
        return role;
    }
  };

  const filteredUsers = users.filter(user => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query) ||
      (user.phone && user.phone.includes(query))
    );
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Usuarios</h1>
          <p className="text-gray-600">Administra los usuarios de la plataforma</p>
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

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Buscar usuario
              </label>
              <Input
                type="text"
                placeholder="Buscar por nombre, email o teléfono..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Filtrar por rol
              </label>
              <select
                value={roleFilter}
                onChange={(e) => {
                  setRoleFilter(e.target.value);
                  setPagination({ ...pagination, page: 1 });
                }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Todos los roles</option>
                <option value="USER">Usuario</option>
                <option value="OWNER">Dueño</option>
                <option value="ADMIN">Administrador</option>
              </select>
            </div>
          </div>
        </div>

        {/* Tabla de usuarios */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Spinner />
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600">No se encontraron usuarios</p>
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
                        Rol
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estado
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Estadísticas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fecha de registro
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <Avatar
                                src={user.avatar}
                                alt={user.name}
                                size="sm"
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                              {user.phone && (
                                <div className="text-sm text-gray-500">{user.phone}</div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge variant={getRoleBadgeVariant(user.role) as any}>
                            {getRoleLabel(user.role)}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex flex-col gap-1">
                            {user.isVerified ? (
                              <Badge variant="success">Verificado</Badge>
                            ) : (
                              <Badge variant="warning">No verificado</Badge>
                            )}
                            {user.banned && (
                              <Badge variant="danger">Baneado</Badge>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user._count && (
                            <div className="space-y-1">
                              <div>Negocios: {user._count.businesses}</div>
                              <div>Reseñas: {user._count.reviews}</div>
                              <div>Favoritos: {user._count.favorites}</div>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString('es-ES', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end gap-2">
                            <Button
                              onClick={() => openChangeRoleModal(user)}
                              variant="secondary"
                              className="text-xs px-3 py-1"
                            >
                              Cambiar rol
                            </Button>
                            <Button
                              onClick={() => openDeleteModal(user)}
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

        {/* Modal cambiar rol */}
        <Modal
          isOpen={changeRoleModal}
          onClose={() => {
            setChangeRoleModal(false);
            setSelectedUser(null);
            setNewRole('');
          }}
          title="Cambiar Rol de Usuario"
        >
          {selectedUser && (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Usuario: <span className="font-medium">{selectedUser.name}</span>
                </p>
                <p className="text-sm text-gray-600">
                  Email: <span className="font-medium">{selectedUser.email}</span>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nuevo rol
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="USER">Usuario</option>
                  <option value="OWNER">Dueño</option>
                  <option value="ADMIN">Administrador</option>
                </select>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleChangeRole}
                  variant="primary"
                  className="flex-1"
                >
                  Confirmar cambio
                </Button>
                <Button
                  onClick={() => {
                    setChangeRoleModal(false);
                    setSelectedUser(null);
                    setNewRole('');
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

        {/* Modal eliminar usuario */}
        <Modal
          isOpen={deleteModal}
          onClose={() => {
            setDeleteModal(false);
            setSelectedUser(null);
          }}
          title="Eliminar Usuario"
        >
          {selectedUser && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  ⚠️ Advertencia
                </p>
                <p className="text-sm text-red-700">
                  Esta acción eliminará permanentemente al usuario{' '}
                  <span className="font-medium">{selectedUser.name}</span> y todos sus datos asociados.
                  Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Email:</span> {selectedUser.email}
                </p>
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Rol:</span> {getRoleLabel(selectedUser.role)}
                </p>
                {selectedUser._count && (
                  <div className="text-sm text-gray-600">
                    <span className="font-medium">Datos asociados:</span>
                    <ul className="list-disc list-inside ml-2 mt-1">
                      <li>{selectedUser._count.businesses} negocios</li>
                      <li>{selectedUser._count.reviews} reseñas</li>
                      <li>{selectedUser._count.favorites} favoritos</li>
                    </ul>
                  </div>
                )}
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleDeleteUser}
                  variant="danger"
                  className="flex-1"
                >
                  Eliminar permanentemente
                </Button>
                <Button
                  onClick={() => {
                    setDeleteModal(false);
                    setSelectedUser(null);
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

export default UsersManagePage;
