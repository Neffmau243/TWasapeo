# 👤 FLUJO COMPLETO DEL OWNER (Dueño del Negocio)

**Fecha:** 17 de Diciembre, 2025  
**Propósito:** Documentar cómo los propietarios de negocios crean y gestionan sus locales

---

## 📋 TABLA DE CONTENIDOS

1. [Flujo General del Owner](#-flujo-general-del-owner)
2. [Creación del Negocio](#-creación-del-negocio)
3. [Sistema de Ubicación](#-sistema-de-ubicación)
4. [Sistema de Fotos](#-sistema-de-fotos)
5. [Endpoints del Owner](#-endpoints-del-owner)
6. [Interfaz de Usuario](#-interfaz-de-usuario)
7. [Gestión Post-Aprobación](#-gestión-post-aprobación)

---

## 🎯 Flujo General del Owner

```
┌─────────────────────────────────────────────────────────┐
│  1. OWNER se registra como usuario normal               │
│     - Email, contraseña, nombre                          │
│     - Role automático: USER → puede cambiar a OWNER     │
│  ↓                                                       │
│  2. Va a "Crear Local" en el menú                       │
│     - Solo disponible para usuarios OWNER                │
│  ↓                                                       │
│  3. Completa formulario multi-paso:                     │
│     ✅ Paso 1: Información Básica                       │
│     ✅ Paso 2: Ubicación (dirección + mapa)            │
│     ✅ Paso 3: Galería de Fotos                        │
│     ✅ Paso 4: Contacto y Horarios                     │
│  ↓                                                       │
│  4. Submit → Negocio pasa a estado PENDING              │
│     - Owner recibe confirmación                          │
│     - Sistema notifica al ADMIN por email                │
│  ↓                                                       │
│  5. ADMIN revisa y decide:                              │
│     ✅ APROBAR → Status = APPROVED → Visible           │
│     ❌ RECHAZAR → Status = REJECTED → Owner notificado │
│  ↓                                                       │
│  6. Si aprobado:                                        │
│     - Negocio visible públicamente                       │
│     - Owner puede gestionar: fotos, eventos, responder FAQ│
└─────────────────────────────────────────────────────────┘
```

---

## 🏪 Creación del Negocio

### Datos Requeridos

```typescript
interface CreateBusinessData {
  // PASO 1: Información Básica
  name: string;                    // Nombre del negocio
  slug?: string;                   // Auto-generado desde nombre
  description: string;             // Resumen corto (máx 200 chars)
  fullDescription: string;         // Descripción completa
  category: string;                // "restaurant", "beauty", etc.
  subcategory?: string;            // "fast-food", "cafe", etc.
  priceRange?: string;             // "$", "$$", "$$$", "$$$$"
  
  // PASO 2: Ubicación
  address: string;                 // Dirección completa
  city: string;                    // Ciudad
  state: string;                   // Estado/Provincia
  zipCode?: string;                // Código postal
  latitude: number;                // Del mapa o geocoding
  longitude: number;               // Del mapa o geocoding
  
  // PASO 3: Galería
  // Se sube después de crear el negocio
  
  // PASO 4: Contacto y Horarios
  phone?: string;
  email?: string;
  website?: string;
  contactButtons?: ContactButton[]; // Personalizable
  hours?: BusinessHours;            // Horarios por día
  features?: Feature[];             // Características (WiFi, etc)
  amenities?: string[];             // Array de amenidades
}

interface ContactButton {
  type: "whatsapp" | "messenger" | "phone" | "email" | "website";
  value: string;                   // Número, URL, etc.
  label?: string;                  // Texto personalizado
  order: number;                   // Orden de aparición
  enabled: boolean;                // Mostrar o no
}

interface BusinessHours {
  monday: DayHours;
  tuesday: DayHours;
  wednesday: DayHours;
  thursday: DayHours;
  friday: DayHours;
  saturday: DayHours;
  sunday: DayHours;
}

interface DayHours {
  open: string;    // "09:00"
  close: string;   // "18:00"
  closed: boolean; // true si está cerrado ese día
}

interface Feature {
  icon: string;    // "wifi", "parking", "wheelchair"
  label: string;   // "WiFi Gratis", "Estacionamiento"
  enabled: boolean;
}
```

---

## 📍 Sistema de Ubicación

El OWNER puede establecer la ubicación de **2 formas**:

### Opción 1: Escribir Dirección + Geocoding Automático

```typescript
// Frontend: Input de dirección
<Input 
  label="Dirección completa"
  placeholder="Av. Corrientes 1234, Ciudad Autónoma de Buenos Aires"
  value={address}
  onChange={(e) => setAddress(e.target.value)}
  onBlur={handleGeocodeAddress} // Cuando termina de escribir
/>

// Función de geocoding (puede usar Google Maps API o Nominatim)
const handleGeocodeAddress = async () => {
  try {
    // Llamar a servicio de geocoding
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
    );
    const data = await response.json();
    
    if (data[0]) {
      setLatitude(parseFloat(data[0].lat));
      setLongitude(parseFloat(data[0].lon));
      
      // Actualizar mapa con las coordenadas
      mapRef.current?.setCenter({ 
        lat: parseFloat(data[0].lat), 
        lng: parseFloat(data[0].lon) 
      });
    }
  } catch (error) {
    console.error('Error al geocodificar:', error);
  }
};
```

**Backend recibe:**
```json
{
  "address": "Av. Corrientes 1234, CABA",
  "city": "Buenos Aires",
  "state": "CABA",
  "latitude": -34.603722,
  "longitude": -58.381592
}
```

---

### Opción 2: Selector de Mapa Interactivo (Más Preciso)

```typescript
// Frontend: Mapa con pin arrastrable
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

function MapPicker({ onLocationSelect }) {
  const [position, setPosition] = useState([-34.603722, -58.381592]);
  
  function LocationMarker() {
    const map = useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setPosition([lat, lng]);
        onLocationSelect(lat, lng);
        
        // Reverse geocoding para obtener dirección
        reverseGeocode(lat, lng);
      },
      drag() {
        // Actualizar posición mientras arrastra
      }
    });
    
    return <Marker position={position} draggable />;
  }
  
  return (
    <MapContainer center={position} zoom={15} style={{ height: '400px' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <LocationMarker />
    </MapContainer>
  );
}

// Reverse geocoding (coordenadas → dirección)
const reverseGeocode = async (lat, lng) => {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
  );
  const data = await response.json();
  
  // Llenar automáticamente el campo de dirección
  setAddress(data.display_name);
  setCity(data.address.city);
  setState(data.address.state);
};
```

**Flujo visual:**
```
1. Owner hace click en el mapa
   ↓
2. Pin se coloca en ese punto
   ↓
3. Frontend obtiene coordenadas (lat, lng)
   ↓
4. Reverse geocoding obtiene dirección
   ↓
5. Campos se llenan automáticamente
   ↓
6. Owner puede ajustar el pin arrastrándolo
```

---

## 📸 Sistema de Fotos

### Flujo Completo de Upload

```
┌─────────────────────────────────────────────────────────┐
│  1. Owner selecciona fotos desde su computadora         │
│     - Input type="file" multiple accept="image/*"       │
│     - Máximo 20 fotos                                    │
│     - Máximo 5MB por foto                                │
│  ↓                                                       │
│  2. Frontend valida y muestra preview                    │
│     - Verifica tamaño y tipo                             │
│     - Genera thumbnails locales                          │
│     - Owner puede categorizar cada foto                  │
│  ↓                                                       │
│  3. Frontend crea FormData                               │
│     - Agrega archivos                                    │
│     - Agrega metadata (categorías, orden)                │
│  ↓                                                       │
│  4. POST /api/owner/businesses/:id/gallery               │
│     - Headers: Authorization Bearer token                │
│     - Body: FormData con imágenes                        │
│  ↓                                                       │
│  5. Backend (Multer middleware)                          │
│     - Verifica autenticación                             │
│     - Valida que sea owner del negocio                   │
│     - Valida tipo de archivo (solo imágenes)             │
│     - Valida tamaño (máx 5MB c/u)                        │
│     - Guarda en buffer (NO en disco)                     │
│  ↓                                                       │
│  6. Backend → Cloudinary API                             │
│     - Sube cada imagen                                   │
│     - Cloudinary procesa:                                │
│       * Comprime (3MB → 800KB automático)                │
│       * Genera thumbnails (400x300, 150x150)             │
│       * Convierte a webp/avif                            │
│       * Almacena en CDN                                  │
│     - Retorna URLs:                                      │
│       {                                                  │
│         url: "https://res.cloudinary.com/.../full.jpg",  │
│         thumbnail: "https://res.cloudinary.com/.../t.jpg"│
│         publicId: "locales/business-id/img-1"            │
│       }                                                  │
│  ↓                                                       │
│  7. Backend → PostgreSQL (tabla GalleryImage)            │
│     INSERT INTO "GalleryImage" (                         │
│       businessId: "abc123",                              │
│       url: "https://res.cloudinary.com/.../full.jpg",    │
│       thumbnail: "https://res.cloudinary.com/.../t.jpg", │
│       publicId: "locales/abc123/img1",                   │
│       category: "Exterior",                              │
│       order: 0,                                          │
│       isMain: true  // Primera foto = principal          │
│     )                                                    │
│  ↓                                                       │
│  8. Backend → Frontend (Response)                        │
│     {                                                    │
│       images: [                                          │
│         {                                                │
│           id: "img1",                                    │
│           url: "cloudinary.com/.../full.jpg",            │
│           thumbnail: "cloudinary.com/.../thumb.jpg",     │
│           category: "Exterior"                           │
│         },                                               │
│         ...                                              │
│       ]                                                  │
│     }                                                    │
│  ↓                                                       │
│  9. Frontend actualiza galería                           │
│     - Muestra thumbnails de fotos subidas                │
│     - Owner puede:                                       │
│       * Reorganizar orden (drag & drop)                  │
│       * Cambiar categorías                               │
│       * Marcar foto principal                            │
│       * Eliminar fotos                                   │
└─────────────────────────────────────────────────────────┘
```

---

### Categorías de Fotos

El owner puede categorizar cada foto para organizar la galería:

```typescript
const photoCategories = [
  { value: "exterior", label: "Exterior", icon: "building" },
  { value: "interior", label: "Interior", icon: "home" },
  { value: "menu", label: "Menú", icon: "utensils" },
  { value: "productos", label: "Productos", icon: "shopping-bag" },
  { value: "equipo", label: "Equipo", icon: "users" },
  { value: "eventos", label: "Eventos", icon: "calendar" },
  { value: "otros", label: "Otros", icon: "image" }
];
```

**En el frontend:**
```typescript
<Select
  value={photo.category}
  onChange={(value) => updatePhotoCategory(photo.id, value)}
>
  {photoCategories.map(cat => (
    <option key={cat.value} value={cat.value}>
      {cat.label}
    </option>
  ))}
</Select>
```

---

### Gestión de Galería

```typescript
// Reorganizar orden (drag & drop)
PUT /api/owner/businesses/:id/gallery/reorder
Body: {
  images: [
    { id: "img3", order: 0 },
    { id: "img1", order: 1 },
    { id: "img2", order: 2 }
  ]
}

// Actualizar metadata de una foto
PUT /api/owner/businesses/:id/gallery/:imageId
Body: {
  category: "interior",
  isMain: true
}

// Eliminar foto
DELETE /api/owner/businesses/:id/gallery/:imageId
// Esto también elimina de Cloudinary usando publicId
```

---

## 🔌 Endpoints del Owner

### Gestión de Negocios

```typescript
// ==================== CREAR NEGOCIO ====================
POST /api/owner/businesses
Headers: Authorization: Bearer <token>
Body: {
  name: "Café La Esquina",
  description: "El mejor café del barrio",
  fullDescription: "Descripción larga...",
  category: "restaurant",
  subcategory: "cafe",
  address: "Av. Corrientes 1234",
  city: "Buenos Aires",
  state: "CABA",
  latitude: -34.603722,
  longitude: -58.381592,
  phone: "+54911234567",
  contactButtons: [
    { type: "whatsapp", value: "+54911234567", order: 1, enabled: true },
    { type: "messenger", value: "cafeurlmessenger", order: 2, enabled: true }
  ],
  hours: {
    monday: { open: "08:00", close: "20:00", closed: false },
    tuesday: { open: "08:00", close: "20:00", closed: false },
    // ... resto de días
  },
  features: [
    { icon: "wifi", label: "WiFi Gratis", enabled: true },
    { icon: "parking", label: "Estacionamiento", enabled: true }
  ],
  amenities: ["WiFi", "Aire Acondicionado", "Accesible"]
}

Response: {
  business: {
    id: "abc123",
    slug: "cafe-la-esquina",
    status: "PENDING",
    createdAt: "2025-12-17T10:00:00Z",
    message: "Negocio creado. Esperando aprobación del administrador."
  }
}

// ==================== SUBIR GALERÍA ====================
POST /api/owner/businesses/:id/gallery
Headers: 
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
Body: FormData
  - images[]: File, File, File... (hasta 20)
  - categories: ["Exterior", "Interior", "Menú", ...]
  
Response: {
  images: [
    {
      id: "img1",
      url: "https://res.cloudinary.com/app/locales/abc123/img1.jpg",
      thumbnail: "https://res.cloudinary.com/app/locales/abc123/img1_thumb.jpg",
      category: "Exterior",
      order: 0,
      isMain: true
    },
    // ... más imágenes
  ]
}

// ==================== SUBIR LOGO ====================
POST /api/owner/businesses/:id/logo
Headers:
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
Body: FormData
  - logo: File (imagen cuadrada recomendada)
  
Response: {
  logoUrl: "https://res.cloudinary.com/app/locales/abc123/logo.jpg"
}

// ==================== SUBIR COVER IMAGE ====================
POST /api/owner/businesses/:id/cover
Headers:
  Authorization: Bearer <token>
  Content-Type: multipart/form-data
Body: FormData
  - cover: File (imagen horizontal recomendada 1920x600)
  
Response: {
  coverUrl: "https://res.cloudinary.com/app/locales/abc123/cover.jpg"
}

// ==================== VER MIS NEGOCIOS ====================
GET /api/owner/businesses
Headers: Authorization: Bearer <token>
Query: ?status=PENDING (opcional: filtrar por status)

Response: {
  businesses: [
    {
      id: "abc123",
      name: "Café La Esquina",
      slug: "cafe-la-esquina",
      status: "APPROVED",
      rating: 4.5,
      reviewCount: 23,
      viewCount: 1234,
      createdAt: "2025-12-17T10:00:00Z"
    },
    // ... más negocios
  ]
}

// ==================== EDITAR NEGOCIO ====================
PUT /api/owner/businesses/:id
Headers: Authorization: Bearer <token>
Body: {
  description?: "Nueva descripción",
  phone?: "+54911111111",
  hours?: { ... },
  // Cualquier campo actualizable
}

Response: {
  business: { ...updated business }
}

// ==================== ELIMINAR NEGOCIO ====================
DELETE /api/owner/businesses/:id
Headers: Authorization: Bearer <token>

Response: {
  message: "Negocio eliminado exitosamente"
}
```

---

### Gestión de Eventos/Actualizaciones

```typescript
// ==================== CREAR EVENTO ====================
POST /api/owner/businesses/:id/events
Headers: Authorization: Bearer <token>
Body: {
  title: "Nuevo Menú de Verano",
  description: "Presentamos nuestro nuevo menú con opciones frescas",
  image?: File, // FormData
  startDate: "2025-12-20T00:00:00Z",
  endDate: "2026-03-20T00:00:00Z"
}

Response: {
  event: {
    id: "event1",
    title: "Nuevo Menú de Verano",
    image: "cloudinary.com/...",
    startDate: "2025-12-20",
    published: true
  }
}

// ==================== EDITAR EVENTO ====================
PUT /api/owner/events/:eventId
Body: { title?, description?, image?, startDate?, endDate? }

// ==================== ELIMINAR EVENTO ====================
DELETE /api/owner/events/:eventId
```

---

### Gestión de FAQ

```typescript
// ==================== VER PREGUNTAS ====================
GET /api/owner/businesses/:id/faq
Headers: Authorization: Bearer <token>
Query: ?status=PENDING (ver solo pendientes)

Response: {
  faqs: [
    {
      id: "faq1",
      question: "¿Tienen opciones veganas?",
      answer: null,
      status: "PENDING",
      user: {
        name: "Juan Pérez",
        avatar: "..."
      },
      createdAt: "2025-12-17T09:00:00Z"
    },
    // ... más preguntas
  ]
}

// ==================== RESPONDER Y APROBAR ====================
PUT /api/owner/faq/:faqId/answer
Body: {
  answer: "¡Sí! Tenemos un menú completo vegano con más de 10 opciones."
}

Response: {
  faq: {
    id: "faq1",
    question: "¿Tienen opciones veganas?",
    answer: "¡Sí! Tenemos un menú completo vegano...",
    status: "APPROVED",
    answeredAt: "2025-12-17T10:00:00Z"
  }
}

// ==================== RECHAZAR PREGUNTA ====================
PUT /api/owner/faq/:faqId/reject
Body: {
  reason: "Pregunta duplicada o no relacionada"
}

// ==================== ELIMINAR PREGUNTA ====================
DELETE /api/owner/faq/:faqId
```

---

### Respuestas a Reseñas

```typescript
// ==================== RESPONDER A RESEÑA ====================
POST /api/owner/reviews/:reviewId/reply
Headers: Authorization: Bearer <token>
Body: {
  reply: "¡Gracias por tu visita! Nos alegra que hayas disfrutado."
}

Response: {
  review: {
    id: "review1",
    rating: 5,
    comment: "Excelente lugar!",
    ownerReply: "¡Gracias por tu visita!...",
    repliedAt: "2025-12-17T10:00:00Z"
  }
}

// ==================== EDITAR RESPUESTA ====================
PUT /api/owner/reviews/:reviewId/reply
Body: {
  reply: "Respuesta actualizada..."
}

// ==================== ELIMINAR RESPUESTA ====================
DELETE /api/owner/reviews/:reviewId/reply
```

---

### Estadísticas Privadas

```typescript
// ==================== ESTADÍSTICAS DEL NEGOCIO ====================
GET /api/owner/businesses/:id/stats
Headers: Authorization: Bearer <token>
Query: ?period=7d (7d, 30d, 90d, all)

Response: {
  views: 1234,                    // Vistas del perfil
  favorites: 45,                  // Usuarios que guardaron
  followers: 78,                  // Usuarios que siguen
  contactClicks: {
    whatsapp: 89,
    messenger: 34,
    phone: 23,
    website: 56
  },
  reviewsPerRating: {
    5: 20,
    4: 10,
    3: 3,
    2: 1,
    1: 0
  },
  avgRating: 4.5,
  recentReviews: [ ... ]
}

// ==================== ANALÍTICAS AVANZADAS ====================
GET /api/owner/businesses/:id/analytics
Query: ?period=30d

Response: {
  viewsOverTime: [
    { date: "2025-12-01", views: 45 },
    { date: "2025-12-02", views: 52 },
    // ... por día
  ],
  ratingsOverTime: [
    { date: "2025-12-01", avgRating: 4.3, count: 2 },
    // ... por día
  ],
  topReferrers: [
    { source: "google", count: 234 },
    { source: "direct", count: 123 }
  ]
}
```

---

## 🎨 Interfaz de Usuario

### Página "Crear Negocio" (Wizard Multi-Paso)

```typescript
// components/owner/CreateBusinessWizard.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function CreateBusinessWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Paso 1
    name: '',
    description: '',
    fullDescription: '',
    category: '',
    subcategory: '',
    priceRange: '',
    
    // Paso 2
    address: '',
    city: '',
    state: '',
    latitude: null,
    longitude: null,
    
    // Paso 3
    gallery: [],
    
    // Paso 4
    phone: '',
    contactButtons: [],
    hours: {},
    features: [],
    amenities: []
  });
  
  const navigate = useNavigate();
  
  const handleSubmit = async () => {
    try {
      // 1. Crear negocio básico
      const response = await fetch('/api/owner/businesses', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      const { business } = await response.json();
      
      // 2. Subir galería de fotos
      if (formData.gallery.length > 0) {
        const galleryFormData = new FormData();
        formData.gallery.forEach(file => {
          galleryFormData.append('images', file);
        });
        
        await fetch(`/api/owner/businesses/${business.id}/gallery`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: galleryFormData
        });
      }
      
      // 3. Redirigir a página de confirmación
      navigate(`/owner/negocio-creado/${business.id}`);
      
    } catch (error) {
      console.error('Error al crear negocio:', error);
    }
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Indicador de progreso */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <Step number={1} active={step === 1} completed={step > 1} label="Información" />
          <Step number={2} active={step === 2} completed={step > 2} label="Ubicación" />
          <Step number={3} active={step === 3} completed={step > 3} label="Fotos" />
          <Step number={4} active={step === 4} completed={step > 4} label="Contacto" />
        </div>
      </div>
      
      {/* Contenido del paso actual */}
      {step === 1 && <StepBasicInfo formData={formData} setFormData={setFormData} />}
      {step === 2 && <StepLocation formData={formData} setFormData={setFormData} />}
      {step === 3 && <StepGallery formData={formData} setFormData={setFormData} />}
      {step === 4 && <StepContact formData={formData} setFormData={setFormData} />}
      
      {/* Navegación */}
      <div className="flex justify-between mt-8">
        {step > 1 && (
          <button onClick={() => setStep(step - 1)}>← Atrás</button>
        )}
        
        {step < 4 ? (
          <button onClick={() => setStep(step + 1)}>Siguiente →</button>
        ) : (
          <button onClick={handleSubmit}>✅ Crear Negocio</button>
        )}
      </div>
    </div>
  );
}
```

---

### Paso 2: Componente de Ubicación

```typescript
// components/owner/StepLocation.tsx
import { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';

export function StepLocation({ formData, setFormData }) {
  const [mapCenter, setMapCenter] = useState([-34.603722, -58.381592]);
  
  const handleAddressChange = async (address: string) => {
    setFormData({ ...formData, address });
    
    // Geocoding automático
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json`
      );
      const data = await response.json();
      
      if (data[0]) {
        const lat = parseFloat(data[0].lat);
        const lng = parseFloat(data[0].lon);
        
        setFormData({
          ...formData,
          address,
          latitude: lat,
          longitude: lng
        });
        
        setMapCenter([lat, lng]);
      }
    } catch (error) {
      console.error('Error al geocodificar:', error);
    }
  };
  
  function LocationMarker() {
    useMapEvents({
      click(e) {
        const { lat, lng } = e.latlng;
        setFormData({
          ...formData,
          latitude: lat,
          longitude: lng
        });
      }
    });
    
    return formData.latitude && formData.longitude ? (
      <Marker 
        position={[formData.latitude, formData.longitude]} 
        draggable
        eventHandlers={{
          dragend: (e) => {
            const { lat, lng } = e.target.getLatLng();
            setFormData({
              ...formData,
              latitude: lat,
              longitude: lng
            });
          }
        }}
      />
    ) : null;
  }
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📍 Ubicación del Negocio</h2>
      
      {/* Dirección */}
      <div>
        <label>Dirección Completa</label>
        <input
          type="text"
          value={formData.address}
          onChange={(e) => handleAddressChange(e.target.value)}
          placeholder="Ej: Av. Corrientes 1234, Buenos Aires"
          className="w-full p-2 border rounded"
        />
      </div>
      
      {/* Ciudad y Estado */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label>Ciudad</label>
          <input
            type="text"
            value={formData.city}
            onChange={(e) => setFormData({ ...formData, city: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label>Estado/Provincia</label>
          <input
            type="text"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
      </div>
      
      {/* Mapa Interactivo */}
      <div>
        <label className="block mb-2">
          Selecciona la ubicación exacta en el mapa
          <span className="text-sm text-gray-500 ml-2">
            (Haz click o arrastra el pin)
          </span>
        </label>
        
        <MapContainer
          center={mapCenter}
          zoom={15}
          style={{ height: '400px', borderRadius: '8px' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap contributors'
          />
          <LocationMarker />
        </MapContainer>
        
        {/* Coordenadas actuales */}
        {formData.latitude && formData.longitude && (
          <div className="mt-2 text-sm text-gray-600">
            📌 Coordenadas: {formData.latitude.toFixed(6)}, {formData.longitude.toFixed(6)}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

### Paso 3: Componente de Galería

```typescript
// components/owner/StepGallery.tsx
import { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

export function StepGallery({ formData, setFormData }) {
  const [previews, setPreviews] = useState([]);
  
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    // Validar tamaño
    const validFiles = files.filter(file => file.size <= 5 * 1024 * 1024);
    
    if (validFiles.length < files.length) {
      alert('Algunas imágenes exceden el límite de 5MB y fueron omitidas');
    }
    
    // Validar cantidad total
    if (formData.gallery.length + validFiles.length > 20) {
      alert('Máximo 20 imágenes permitidas');
      return;
    }
    
    // Crear previews
    const newPreviews = validFiles.map(file => ({
      file,
      url: URL.createObjectURL(file),
      category: 'otros'
    }));
    
    setPreviews([...previews, ...newPreviews]);
    setFormData({
      ...formData,
      gallery: [...formData.gallery, ...validFiles]
    });
  };
  
  const handleDragEnd = (result) => {
    if (!result.destination) return;
    
    const items = Array.from(previews);
    const [reordered] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reordered);
    
    setPreviews(items);
  };
  
  const removeImage = (index: number) => {
    const newPreviews = previews.filter((_, i) => i !== index);
    const newGallery = formData.gallery.filter((_, i) => i !== index);
    
    setPreviews(newPreviews);
    setFormData({ ...formData, gallery: newGallery });
  };
  
  const updateCategory = (index: number, category: string) => {
    const newPreviews = [...previews];
    newPreviews[index].category = category;
    setPreviews(newPreviews);
  };
  
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">📸 Galería de Fotos</h2>
      
      <p className="text-gray-600">
        Sube entre 3 y 20 fotos de tu negocio. La primera foto será la principal.
      </p>
      
      {/* Botón de upload */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="gallery-upload"
        />
        <label
          htmlFor="gallery-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <span className="text-4xl mb-2">📷</span>
          <span className="text-lg font-semibold">Seleccionar fotos</span>
          <span className="text-sm text-gray-500 mt-1">
            PNG, JPG, WEBP - Máximo 5MB por imagen
          </span>
        </label>
      </div>
      
      {/* Grid de previews con drag & drop */}
      {previews.length > 0 && (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="gallery" direction="horizontal">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                className="grid grid-cols-4 gap-4"
              >
                {previews.map((preview, index) => (
                  <Draggable key={index} draggableId={`img-${index}`} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative"
                      >
                        {/* Preview de imagen */}
                        <img
                          src={preview.url}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                        
                        {/* Badge de orden */}
                        {index === 0 && (
                          <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs">
                            ⭐ Principal
                          </div>
                        )}
                        
                        {/* Selector de categoría */}
                        <select
                          value={preview.category}
                          onChange={(e) => updateCategory(index, e.target.value)}
                          className="w-full mt-2 p-1 text-sm border rounded"
                        >
                          <option value="exterior">Exterior</option>
                          <option value="interior">Interior</option>
                          <option value="menu">Menú</option>
                          <option value="productos">Productos</option>
                          <option value="equipo">Equipo</option>
                          <option value="otros">Otros</option>
                        </select>
                        
                        {/* Botón eliminar */}
                        <button
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white w-6 h-6 rounded-full"
                        >
                          ×
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      
      {/* Contador */}
      <div className="text-sm text-gray-600">
        {previews.length} / 20 fotos {previews.length < 3 && '(mínimo 3)'}
      </div>
    </div>
  );
}
```

---

## ⚙️ Gestión Post-Aprobación

Una vez que el negocio es **APROBADO** por el admin, el owner puede:

### 1. Editar Información
- Actualizar descripción
- Cambiar horarios
- Modificar contactos
- Agregar/quitar amenidades

### 2. Gestionar Galería
- Subir más fotos
- Eliminar fotos existentes
- Reorganizar orden
- Cambiar foto principal
- Recategorizar imágenes

### 3. Crear Eventos
- Anunciar promociones
- Nuevos menús
- Eventos especiales
- Con imagen y fecha de inicio/fin

### 4. Gestionar FAQ
- Ver preguntas de usuarios
- Responder y aprobar
- Rechazar spam
- Eliminar preguntas

### 5. Responder Reseñas
- Agradecer reviews positivos
- Responder críticas constructivamente
- Mostrar atención al cliente

### 6. Ver Estadísticas
- Vistas del perfil
- Clicks en contacto
- Usuarios que guardaron como favorito
- Distribución de ratings
- Tendencias temporales

---

## 🎯 Resumen: Responsabilidades del Owner

```
┌──────────────────────────────────────────────────────┐
│  LO QUE HACE EL OWNER                                │
├──────────────────────────────────────────────────────┤
│  ✅ Sube TODAS las fotos de su negocio               │
│  ✅ Define la ubicación (dirección + coordenadas)    │
│  ✅ Configura información de contacto                 │
│  ✅ Establece horarios                                │
│  ✅ Define características (WiFi, parking, etc)       │
│  ✅ Crea eventos/actualizaciones                      │
│  ✅ Responde preguntas frecuentes                     │
│  ✅ Responde a reseñas de clientes                    │
│  ✅ Gestiona galería de fotos                         │
│  ✅ Ve estadísticas de su negocio                     │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  LO QUE HACE EL BACKEND/SISTEMA                      │
├──────────────────────────────────────────────────────┤
│  ✅ Recibe y procesa fotos                            │
│  ✅ Sube imágenes a Cloudinary                        │
│  ✅ Guarda URLs en PostgreSQL                         │
│  ✅ Valida datos (tamaño, formato, etc)              │
│  ✅ Calcula rating promedio automáticamente           │
│  ✅ Genera thumbnails                                 │
│  ✅ Optimiza imágenes (webp, compresión)             │
│  ✅ Maneja búsquedas geoespaciales                    │
│  ✅ Envía notificaciones por email                    │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│  LO QUE HACE EL ADMIN                                │
├──────────────────────────────────────────────────────┤
│  ✅ Aprueba o rechaza negocios nuevos                 │
│  ✅ Modera contenido inapropiado                      │
│  ✅ Suspende negocios si violan reglas                │
│  ✅ Marca negocios como "Destacados"                  │
│  ✅ Verifica negocios (badge especial)                │
│  ✅ Gestiona categorías                               │
│  ✅ Ve estadísticas globales                          │
└──────────────────────────────────────────────────────┘
```

---

## 🚀 Stack Tecnológico Confirmado

```
Frontend:
  - React 18 + TypeScript
  - Vite
  - TailwindCSS
  - React Router v6
  - React Leaflet (mapas)
  - React Beautiful DnD (drag & drop)
  - Axios (HTTP client)

Backend:
  - Node.js 20+
  - Express.js
  - TypeScript
  - Prisma (ORM)
  - JWT (autenticación)
  - Multer (upload middleware)
  - Zod (validación)

Base de Datos:
  - PostgreSQL (Railway o Neon - gratis)
  - PostGIS (geolocalización)

Storage:
  - Cloudinary (25GB gratis)
  - CDN incluido
  - Optimización automática

Servicios:
  - Nodemailer (emails)
  - Nominatim (geocoding gratuito)
  - OpenStreetMap (mapas gratuitos)
```

---

**¿Listo para empezar a codear?** 🚀
