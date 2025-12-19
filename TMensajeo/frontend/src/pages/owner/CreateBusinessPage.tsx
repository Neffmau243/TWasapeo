import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import * as businessService from '../../services/businessService';
import * as categoryService from '../../services/categoryService';
import { useGeolocation } from '../../hooks/useGeolocation';
import { useNotification } from '../../context/NotificationContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Spinner from '../../components/common/Spinner';
import { Category } from '../../types/category.types';
import { CreateBusinessRequest, OpeningHours, DaySchedule } from '../../types/business.types';

const DAYS = [
  { key: 'monday', label: 'Lunes' },
  { key: 'tuesday', label: 'Martes' },
  { key: 'wednesday', label: 'Miércoles' },
  { key: 'thursday', label: 'Jueves' },
  { key: 'friday', label: 'Viernes' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
] as const;

const CreateBusinessPage: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useNotification();
  const geolocation = useGeolocation({ enableHighAccuracy: true });

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateBusinessRequest & {
    schedule: OpeningHours;
  }>({
    name: '',
    description: '',
    categoryId: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    latitude: 0,
    longitude: 0,
    phone: '',
    email: '',
    website: '',
    whatsapp: '',
    facebook: '',
    instagram: '',
    schedule: {},
  });

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    // Usar geolocalización si está disponible
    if (geolocation.latitude && geolocation.longitude) {
      setFormData((prev) => ({
        ...prev,
        latitude: geolocation.latitude!,
        longitude: geolocation.longitude!,
      }));
    }
  }, [geolocation.latitude, geolocation.longitude]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getCategories();
      if (response.success && response.data) {
        setCategories(response.data);
      }
    } catch (err: any) {
      console.error('Error loading categories:', err);
      showError('Error al cargar las categorías');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleScheduleChange = (day: string, field: 'open' | 'close', value: string) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...(prev.schedule[day as keyof OpeningHours] as DaySchedule),
          [field]: value,
        },
      },
    }));
  };

  const handleScheduleClosed = (day: string, closed: boolean) => {
    setFormData((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: {
          ...(prev.schedule[day as keyof OpeningHours] as DaySchedule),
          closed,
          ...(closed ? {} : { open: '09:00', close: '18:00' }),
        },
      },
    }));
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name || formData.name.length < 3) {
      newErrors.name = 'El nombre debe tener al menos 3 caracteres';
    }

    if (!formData.description || formData.description.length < 100) {
      newErrors.description = 'La descripción debe tener al menos 100 caracteres';
    }

    if (!formData.categoryId) {
      newErrors.categoryId = 'Debes seleccionar una categoría';
    }

    if (!formData.address || formData.address.length < 5) {
      newErrors.address = 'La dirección debe tener al menos 5 caracteres';
    }

    if (!formData.city || formData.city.length < 2) {
      newErrors.city = 'La ciudad es requerida';
    }

    if (!formData.state || formData.state.length < 2) {
      newErrors.state = 'El estado es requerido';
    }

    if (!formData.latitude || !formData.longitude) {
      newErrors.location = 'Las coordenadas son requeridas. Usa el botón de geolocalización o ingrésalas manualmente.';
    }

    if (!formData.phone || formData.phone.length < 10) {
      newErrors.phone = 'El teléfono debe tener al menos 10 caracteres';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }

    if (formData.website && !/^https?:\/\/.+/.test(formData.website)) {
      newErrors.website = 'La URL del sitio web no es válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      showError('Por favor, corrige los errores en el formulario');
      return;
    }

    try {
      setSaving(true);

      // Convertir schedule a formato JSON si tiene datos
      const schedule = Object.keys(formData.schedule).length > 0 ? formData.schedule : {};

      const payload: any = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        latitude: parseFloat(formData.latitude.toString()),
        longitude: parseFloat(formData.longitude.toString()),
        phone: formData.phone,
        schedule: schedule,
      };

      // Agregar campos opcionales solo si tienen valor
      if (formData.zipCode) payload.zipCode = formData.zipCode;
      if (formData.email) payload.email = formData.email;
      if (formData.website) payload.website = formData.website;
      if (formData.whatsapp) payload.whatsapp = formData.whatsapp;
      if (formData.facebook) payload.facebook = formData.facebook;
      if (formData.instagram) payload.instagram = formData.instagram;

      const response = await businessService.createBusiness(payload);

      if (response.success) {
        showSuccess('Negocio creado exitosamente. Será revisado por un administrador.');
        navigate('/owner/businesses');
      }
    } catch (err: any) {
      console.error('Error creating business:', err);
      const errorMessage = err.response?.data?.message || 'Error al crear el negocio';
      showError(errorMessage);
      
      // Mostrar errores de validación del backend si existen
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      }
    } finally {
      setSaving(false);
    }
  };

  const useCurrentLocation = () => {
    if (geolocation.loading) {
      showError('Obteniendo ubicación...');
      return;
    }
    if (geolocation.error) {
      showError('No se pudo obtener tu ubicación. Ingresa las coordenadas manualmente.');
      return;
    }
    if (geolocation.latitude && geolocation.longitude) {
      setFormData((prev) => ({
        ...prev,
        latitude: geolocation.latitude!,
        longitude: geolocation.longitude!,
      }));
      showSuccess('Ubicación obtenida exitosamente');
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
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Crear Nuevo Negocio</h1>
          <p className="text-gray-600">
            Completa el formulario para registrar tu negocio. Será revisado por un administrador antes de ser publicado.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información Básica</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nombre del Negocio <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Ej: Mi Restaurante"
                  className={errors.name ? 'border-red-500' : ''}
                />
                {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría <span className="text-red-500">*</span>
                </label>
                <select
                  name="categoryId"
                  value={formData.categoryId}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.categoryId ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Selecciona una categoría</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Descripción <span className="text-red-500">*</span>
                  <span className="text-gray-500 text-xs ml-2">
                    (Mínimo 100 caracteres)
                  </span>
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows={6}
                  placeholder="Describe tu negocio en detalle..."
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                <p className="mt-1 text-xs text-gray-500">
                  {formData.description.length}/100 caracteres
                </p>
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>
            </div>
          </div>

          {/* Ubicación */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Ubicación</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dirección <span className="text-red-500">*</span>
                </label>
                <Input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Calle y número"
                  className={errors.address ? 'border-red-500' : ''}
                />
                {errors.address && (
                  <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ciudad <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Ciudad"
                    className={errors.city ? 'border-red-500' : ''}
                  />
                  {errors.city && (
                    <p className="mt-1 text-sm text-red-600">{errors.city}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estado <span className="text-red-500">*</span>
                  </label>
                  <Input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Estado"
                    className={errors.state ? 'border-red-500' : ''}
                  />
                  {errors.state && (
                    <p className="mt-1 text-sm text-red-600">{errors.state}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código Postal
                  </label>
                  <Input
                    type="text"
                    name="zipCode"
                    value={formData.zipCode}
                    onChange={handleChange}
                    placeholder="Código Postal"
                  />
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Coordenadas <span className="text-red-500">*</span>
                    </label>
                    <p className="text-xs text-gray-600">
                      Usa el botón para obtener tu ubicación automáticamente o ingrésalas manualmente
                    </p>
                  </div>
                  <Button
                    type="button"
                    onClick={useCurrentLocation}
                    variant="secondary"
                    disabled={geolocation.loading}
                    className="whitespace-nowrap"
                  >
                    {geolocation.loading ? 'Obteniendo...' : '📍 Usar mi ubicación'}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Latitud
                    </label>
                    <Input
                      type="number"
                      step="any"
                      name="latitude"
                      value={formData.latitude}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          latitude: parseFloat(e.target.value) || 0,
                        }));
                      }}
                      placeholder="0.0000"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Longitud
                    </label>
                    <Input
                      type="number"
                      step="any"
                      name="longitude"
                      value={formData.longitude}
                      onChange={(e) => {
                        setFormData((prev) => ({
                          ...prev,
                          longitude: parseFloat(e.target.value) || 0,
                        }));
                      }}
                      placeholder="0.0000"
                    />
                  </div>
                </div>
                {errors.location && (
                  <p className="mt-2 text-sm text-red-600">{errors.location}</p>
                )}
              </div>
            </div>
          </div>

          {/* Contacto */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Información de Contacto</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Teléfono <span className="text-red-500">*</span>
                </label>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+52 123 456 7890"
                  className={errors.phone ? 'border-red-500' : ''}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="contacto@negocio.com"
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sitio Web
                </label>
                <Input
                  type="url"
                  name="website"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://www.minegocio.com"
                  className={errors.website ? 'border-red-500' : ''}
                />
                {errors.website && (
                  <p className="mt-1 text-sm text-red-600">{errors.website}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    WhatsApp
                  </label>
                  <Input
                    type="text"
                    name="whatsapp"
                    value={formData.whatsapp}
                    onChange={handleChange}
                    placeholder="+52 123 456 7890"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Facebook
                  </label>
                  <Input
                    type="text"
                    name="facebook"
                    value={formData.facebook}
                    onChange={handleChange}
                    placeholder="facebook.com/tu-negocio"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram
                  </label>
                  <Input
                    type="text"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="@tu-negocio"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Horarios */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Horarios de Atención</h2>
            <p className="text-sm text-gray-600 mb-4">
              Define los horarios de atención de tu negocio (opcional)
            </p>
            
            <div className="space-y-3">
              {DAYS.map((day) => {
                const daySchedule = formData.schedule[day.key as keyof OpeningHours] as DaySchedule | undefined;
                const isClosed = daySchedule?.closed ?? false;

                return (
                  <div key={day.key} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <div className="w-24 font-medium text-gray-700">{day.label}</div>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={isClosed}
                        onChange={(e) => handleScheduleClosed(day.key, e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600">Cerrado</span>
                    </label>
                    {!isClosed && (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          type="time"
                          value={daySchedule?.open || '09:00'}
                          onChange={(e) => handleScheduleChange(day.key, 'open', e.target.value)}
                          className="w-32"
                        />
                        <span className="text-gray-500">a</span>
                        <Input
                          type="time"
                          value={daySchedule?.close || '18:00'}
                          onChange={(e) => handleScheduleChange(day.key, 'close', e.target.value)}
                          className="w-32"
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Botones */}
          <div className="flex gap-4 justify-end">
            <Button
              type="button"
              onClick={() => navigate('/owner/businesses')}
              variant="secondary"
              disabled={saving}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={saving}
            >
              {saving ? 'Creando...' : 'Crear Negocio'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateBusinessPage;
