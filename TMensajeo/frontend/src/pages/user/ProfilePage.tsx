import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import * as userService from '../../services/userService';
import Avatar from '../../components/common/Avatar';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { User, UpdateUserRequest, ChangePasswordRequest } from '../../types/user.types';

const ProfilePage: React.FC = () => {
  const { user: authUser, updateUser } = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // Estados para formularios
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [formData, setFormData] = useState<UpdateUserRequest>({
    name: '',
    phone: '',
  });
  const [passwordData, setPasswordData] = useState<ChangePasswordRequest & { confirmPassword: string }>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  // Estadísticas
  const [stats, setStats] = useState({
    reviewCount: 0,
    favoriteCount: 0,
    followingCount: 0,
  });

  useEffect(() => {
    // Usar datos del AuthContext si están disponibles, si no cargar del servidor
    if (authUser) {
      setUser(authUser as User);
      setFormData({
        name: authUser.name || '',
        phone: authUser.phone || '',
      });
      setLoading(false); // Ya tenemos los datos, no necesitamos cargar más
      // Solo cargar stats, no el perfil completo
      loadStats();
    } else {
      // Si no hay usuario en el contexto, cargar del servidor
      loadProfile();
      loadStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authUser]);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
      });
    }
  }, [user]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const response = await userService.getProfile();
      if (response.success && response.data) {
        setUser(response.data);
      }
    } catch (err: any) {
      console.error('Error loading profile:', err);
      // No mostrar error si es rate limit
      if (err.response?.status !== 429) {
        setError('Error al cargar el perfil');
      }
    } finally {
      setLoading(false);
    }
  };

  const loadStats = async () => {
    try {
      // Hacer las llamadas con un pequeño delay entre cada una para evitar rate limit
      const favoritesRes = await userService.getFavorites().catch(() => ({ data: [] }));
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      
      const followingRes = await userService.getFollowing().catch(() => ({ data: [] }));
      await new Promise(resolve => setTimeout(resolve, 100)); // 100ms delay
      
      const reviewsRes = await userService.getMyReviews().catch(() => ({ data: [] }));

      setStats({
        favoriteCount: favoritesRes.data?.length || 0,
        followingCount: followingRes.data?.length || 0,
        reviewCount: reviewsRes.data?.length || 0,
      });
    } catch (err: any) {
      // No mostrar error si es rate limit
      if (err.response?.status !== 429) {
        console.error('Error loading stats:', err);
      }
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await userService.updateProfile(formData);
      if (response.success) {
        setUser(response.data);
        updateUser(response.data);
        setSuccess('Perfil actualizado correctamente');
        setEditMode(false);
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Error updating profile:', err);
      setError(err.response?.data?.message || 'Error al actualizar el perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(null);

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      setSaving(false);
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setSaving(false);
      return;
    }

    try {
      const passwordPayload: ChangePasswordRequest = {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      };
      const response = await userService.changePassword(passwordPayload);
      if (response.success) {
        setSuccess('Contraseña actualizada correctamente');
        setPasswordMode(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err: any) {
      console.error('Error changing password:', err);
      setError(err.response?.data?.message || 'Error al cambiar la contraseña');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar tu cuenta? Esta acción no se puede deshacer.')) {
      return;
    }

    try {
      await userService.deleteAccount();
      window.location.href = '/';
    } catch (err: any) {
      console.error('Error deleting account:', err);
      setError(err.response?.data?.message || 'Error al eliminar la cuenta');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (!user && !authUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No se pudo cargar el perfil</h2>
          <p className="text-gray-600">Por favor, intenta iniciar sesión nuevamente.</p>
        </div>
      </div>
    );
  }

  const displayUser = user || authUser;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <div className="flex-shrink-0">
              <Avatar
                src={displayUser?.avatar}
                alt={displayUser?.name || 'Usuario'}
                size="lg"
              />
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                {displayUser?.name || 'Usuario'}
              </h1>
              <p className="text-gray-600 mb-1">{displayUser?.email}</p>
              {displayUser?.phone && (
                <p className="text-gray-600 mb-2">{displayUser.phone}</p>
              )}
              <div className="flex flex-wrap gap-2 mt-3 justify-center md:justify-start">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  displayUser?.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' :
                  displayUser?.role === 'OWNER' ? 'bg-blue-100 text-blue-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {displayUser?.role === 'ADMIN' ? 'Administrador' :
                   displayUser?.role === 'OWNER' ? 'Dueño' :
                   'Usuario'}
                </span>
                {displayUser?.isVerified && (
                  <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                    ✓ Verificado
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">{stats.reviewCount}</div>
            <div className="text-gray-600">Reseñas</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-red-600 mb-2">{stats.favoriteCount}</div>
            <div className="text-gray-600">Favoritos</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">{stats.followingCount}</div>
            <div className="text-gray-600">Siguiendo</div>
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

        {/* Editar Perfil */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Información Personal</h2>
            {!editMode && (
              <Button
                onClick={() => setEditMode(true)}
                variant="secondary"
              >
                Editar
              </Button>
            )}
          </div>

          {editMode ? (
            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre
                </label>
                <Input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Tu nombre"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono
                </label>
                <Input
                  type="tel"
                  value={formData.phone || ''}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Tu teléfono"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={saving}
                  variant="primary"
                >
                  {saving ? 'Guardando...' : 'Guardar cambios'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setEditMode(false);
                    setFormData({
                      name: displayUser?.name || '',
                      phone: displayUser?.phone || '',
                    });
                  }}
                  variant="secondary"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div>
                <span className="text-sm font-medium text-gray-500">Nombre:</span>
                <p className="text-gray-800">{displayUser?.name}</p>
              </div>
              {displayUser?.phone && (
                <div>
                  <span className="text-sm font-medium text-gray-500">Teléfono:</span>
                  <p className="text-gray-800">{displayUser.phone}</p>
                </div>
              )}
              <div>
                <span className="text-sm font-medium text-gray-500">Email:</span>
                <p className="text-gray-800">{displayUser?.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* Cambiar Contraseña */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-800">Seguridad</h2>
            {!passwordMode && (
              <Button
                onClick={() => setPasswordMode(true)}
                variant="secondary"
              >
                Cambiar contraseña
              </Button>
            )}
          </div>

          {passwordMode && (
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Contraseña actual
                </label>
                <Input
                  type="password"
                  value={passwordData.currentPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                  placeholder="Contraseña actual"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nueva contraseña
                </label>
                <Input
                  type="password"
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                  placeholder="Nueva contraseña (mín. 6 caracteres)"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmar nueva contraseña
                </label>
                <Input
                  type="password"
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                  placeholder="Confirma la nueva contraseña"
                />
              </div>
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={saving}
                  variant="primary"
                >
                  {saving ? 'Cambiando...' : 'Cambiar contraseña'}
                </Button>
                <Button
                  type="button"
                  onClick={() => {
                    setPasswordMode(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  variant="secondary"
                >
                  Cancelar
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Eliminar Cuenta */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Zona de Peligro</h2>
          <p className="text-gray-600 mb-4">
            Una vez que elimines tu cuenta, no hay vuelta atrás. Por favor, ten cuidado.
          </p>
          <Button
            onClick={handleDeleteAccount}
            variant="danger"
          >
            Eliminar mi cuenta
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
