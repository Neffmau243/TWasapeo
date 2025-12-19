import React, { useState, useEffect } from 'react';
import * as categoryService from '../../services/categoryService';
import * as adminService from '../../services/adminService';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import Badge from '../../components/common/Badge';
import Spinner from '../../components/common/Spinner';
import { Category } from '../../types/category.types';

interface CategoryWithCount extends Category {
  _count?: {
    businesses: number;
  };
}

const CategoriesPage: React.FC = () => {
  const { showSuccess, showError } = useNotification();
  const [categories, setCategories] = useState<CategoryWithCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modales
  const [createModal, setCreateModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<CategoryWithCount | null>(null);
  
  // Formularios
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    icon: '',
    color: '#6B7280',
    order: 0,
  });
  const [saving, setSaving] = useState(false);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await categoryService.getCategories();
      
      if (response.success) {
        setCategories(response.data || []);
      } else {
        setError('Error al cargar las categorías');
      }
    } catch (err: any) {
      console.error('Error loading categories:', err);
      setError(err.response?.data?.message || 'Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const response = await adminService.createCategory(formData);
      
      if (response.success) {
        showSuccess('Categoría creada exitosamente');
        setCreateModal(false);
        resetForm();
        loadCategories();
      }
    } catch (err: any) {
      console.error('Error creating category:', err);
      showError(err.response?.data?.message || 'Error al crear la categoría');
      
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedCategory || !validateForm()) {
      return;
    }

    try {
      setSaving(true);
      const response = await adminService.updateCategory(selectedCategory.id, formData);
      
      if (response.success) {
        showSuccess('Categoría actualizada exitosamente');
        setEditModal(false);
        setSelectedCategory(null);
        resetForm();
        loadCategories();
      }
    } catch (err: any) {
      console.error('Error updating category:', err);
      showError(err.response?.data?.message || 'Error al actualizar la categoría');
      
      if (err.response?.data?.errors) {
        setFormErrors(err.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;

    try {
      setSaving(true);
      const response = await adminService.deleteCategory(selectedCategory.id);
      
      if (response.success) {
        showSuccess('Categoría eliminada exitosamente');
        setDeleteModal(false);
        setSelectedCategory(null);
        loadCategories();
      }
    } catch (err: any) {
      console.error('Error deleting category:', err);
      showError(err.response?.data?.message || 'Error al eliminar la categoría');
    } finally {
      setSaving(false);
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name || formData.name.trim().length < 2) {
      errors.name = 'El nombre debe tener al menos 2 caracteres';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      icon: '',
      color: '#6B7280',
      order: 0,
    });
    setFormErrors({});
  };

  const openCreateModal = () => {
    resetForm();
    setCreateModal(true);
  };

  const openEditModal = (category: CategoryWithCount) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      icon: category.icon || '',
      color: category.color || '#6B7280',
      order: (category as any).order || 0,
    });
    setFormErrors({});
    setEditModal(true);
  };

  const openDeleteModal = (category: CategoryWithCount) => {
    setSelectedCategory(category);
    setDeleteModal(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'order' ? parseInt(value) || 0 : value,
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">Gestión de Categorías</h1>
            <p className="text-gray-600">Crea y gestiona las categorías de negocios</p>
          </div>
          <Button onClick={openCreateModal} variant="primary">
            + Crear Categoría
          </Button>
        </div>

        {/* Mensajes */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Lista de categorías */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {categories.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg mb-4">No hay categorías registradas</p>
              <Button onClick={openCreateModal} variant="primary">
                Crear primera categoría
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Categoría
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Descripción
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Negocios
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Color/Icono
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Orden
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {categories.map((category) => (
                    <tr key={category.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">{category.name}</div>
                        <div className="text-sm text-gray-500">{category.slug}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 max-w-xs truncate">
                          {category.description || 'Sin descripción'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge variant="info">
                          {(category as CategoryWithCount)._count?.businesses || 0} negocios
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {category.icon && (
                            <span className="text-2xl">{category.icon}</span>
                          )}
                          {category.color && (
                            <div
                              className="w-6 h-6 rounded-full border border-gray-300"
                              style={{ backgroundColor: category.color }}
                            />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {(category as any).order || 0}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <Button
                            onClick={() => openEditModal(category)}
                            variant="secondary"
                            className="text-xs px-3 py-1"
                          >
                            ✏️ Editar
                          </Button>
                          <Button
                            onClick={() => openDeleteModal(category)}
                            variant="danger"
                            className="text-xs px-3 py-1"
                            disabled={(category as CategoryWithCount)._count?.businesses && (category as CategoryWithCount)._count!.businesses > 0}
                          >
                            🗑️ Eliminar
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Modal crear */}
        <Modal
          isOpen={createModal}
          onClose={() => {
            setCreateModal(false);
            resetForm();
          }}
          title="Crear Categoría"
        >
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Restaurantes"
                className={formErrors.name ? 'border-red-500' : ''}
                required
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Descripción de la categoría..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono (emoji)
                </label>
                <Input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="🍔"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <Input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden
              </label>
              <Input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Define el orden de aparición (menor número aparece primero)
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className="flex-1"
              >
                {saving ? 'Creando...' : 'Crear'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setCreateModal(false);
                  resetForm();
                }}
                variant="secondary"
                className="flex-1"
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal editar */}
        <Modal
          isOpen={editModal}
          onClose={() => {
            setEditModal(false);
            setSelectedCategory(null);
            resetForm();
          }}
          title="Editar Categoría"
        >
          <form onSubmit={handleUpdate} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre <span className="text-red-500">*</span>
              </label>
              <Input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Ej: Restaurantes"
                className={formErrors.name ? 'border-red-500' : ''}
                required
              />
              {formErrors.name && (
                <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Descripción de la categoría..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icono (emoji)
                </label>
                <Input
                  type="text"
                  name="icon"
                  value={formData.icon}
                  onChange={handleChange}
                  placeholder="🍔"
                  maxLength={2}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <Input
                  type="color"
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-10"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Orden
              </label>
              <Input
                type="number"
                name="order"
                value={formData.order}
                onChange={handleChange}
                placeholder="0"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Define el orden de aparición (menor número aparece primero)
              </p>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                type="submit"
                variant="primary"
                disabled={saving}
                className="flex-1"
              >
                {saving ? 'Guardando...' : 'Guardar cambios'}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setEditModal(false);
                  setSelectedCategory(null);
                  resetForm();
                }}
                variant="secondary"
                className="flex-1"
                disabled={saving}
              >
                Cancelar
              </Button>
            </div>
          </form>
        </Modal>

        {/* Modal eliminar */}
        <Modal
          isOpen={deleteModal}
          onClose={() => {
            setDeleteModal(false);
            setSelectedCategory(null);
          }}
          title="Eliminar Categoría"
        >
          {selectedCategory && (
            <div className="space-y-4">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-sm text-red-800 font-medium mb-2">
                  ⚠️ Confirmar eliminación
                </p>
                <p className="text-sm text-red-700">
                  ¿Estás seguro de que deseas eliminar la categoría{' '}
                  <span className="font-medium">"{selectedCategory.name}"</span>?
                </p>
                {(selectedCategory as CategoryWithCount)._count?.businesses &&
                  (selectedCategory as CategoryWithCount)._count!.businesses > 0 && (
                    <p className="text-sm text-red-700 mt-2 font-bold">
                      ⚠️ Esta categoría tiene{' '}
                      {(selectedCategory as CategoryWithCount)._count!.businesses} negocios
                      asociados y NO se puede eliminar.
                    </p>
                  )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleDelete}
                  variant="danger"
                  className="flex-1"
                  disabled={
                    saving ||
                    ((selectedCategory as CategoryWithCount)._count?.businesses &&
                      (selectedCategory as CategoryWithCount)._count!.businesses > 0)
                  }
                >
                  {saving ? 'Eliminando...' : 'Sí, eliminar'}
                </Button>
                <Button
                  onClick={() => {
                    setDeleteModal(false);
                    setSelectedCategory(null);
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

export default CategoriesPage;
