# 🏗️ ARQUITECTURA FULLSTACK - LOCALES

**Fecha:** 17 de Diciembre, 2025  
**Objetivo:** Transformar la SPA actual en una aplicación fullstack con backend, autenticación y roles

---

## 📋 TABLA DE CONTENIDOS

1. [Arquitectura General](#-arquitectura-general)
2. [Sistema de Autenticación](#-sistema-de-autenticación)
3. [Roles y Permisos](#-roles-y-permisos)
4. [Rutas Dinámicas](#-rutas-dinámicas-páginas-escalables)
5. [Backend API](#-backend-api)
6. [Frontend Actualizado](#-frontend-actualizado)
7. [Base de Datos](#-base-de-datos)
8. [Flujos de Usuario](#-flujos-de-usuario)
9. [Plan de Implementación](#-plan-de-implementación)
10. [Stack Tecnológico Recomendado](#-stack-tecnológico-recomendado)

---

## 🎯 ARQUITECTURA GENERAL

### Concepto: Una Vista Dinámica, Infinitos Locales

**❌ MAL (No escalable):**
```
/local-la-maison
/local-cafe-moderne
/local-boutique-elegance
... (crear un componente/página por cada local)
```

**✅ BIEN (Escalable):**
```
/local/:id          → Una sola página que se adapta según el ID
/local/1            → La Maison
/local/2            → Café Moderne
/local/999999       → Cualquier local
```

### Diagrama de Arquitectura

```
┌─────────────────────────────────────────────────────────┐
│                     FRONTEND (React)                     │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Public   │  │   User Auth  │  │     Admin    │   │
│  │   Routes   │  │    Routes    │  │    Routes    │   │
│  └────────────┘  └──────────────┘  └──────────────┘   │
│         ↓                ↓                 ↓            │
│  ┌─────────────────────────────────────────────────┐   │
│  │         React Router (Navegación)                │   │
│  └─────────────────────────────────────────────────┘   │
│         ↓                ↓                 ↓            │
│  ┌─────────────────────────────────────────────────┐   │
│  │    Context API / Zustand (Estado Global)        │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
                          ↕ HTTP/HTTPS (Axios/Fetch)
┌─────────────────────────────────────────────────────────┐
│                  BACKEND API (Node.js)                   │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────┐   │
│  │   Auth     │  │   Business   │  │     Admin    │   │
│  │  Routes    │  │    Routes    │  │    Routes    │   │
│  └────────────┘  └──────────────┘  └──────────────┘   │
│         ↓                ↓                 ↓            │
│  ┌─────────────────────────────────────────────────┐   │
│  │         Middleware (Auth, Roles)                 │   │
│  └─────────────────────────────────────────────────┘   │
│         ↓                ↓                 ↓            │
│  ┌─────────────────────────────────────────────────┐   │
│  │        Database (PostgreSQL / MongoDB)           │   │
│  └─────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

---

## 🔐 SISTEMA DE AUTENTICACIÓN

### Estrategia: JWT (JSON Web Tokens)

#### ¿Cómo funciona?

1. **Usuario se registra/loguea** → Backend genera un JWT
2. **Frontend guarda el token** → En localStorage o httpOnly cookie
3. **Cada request al backend** → Frontend envía el token en headers
4. **Backend valida el token** → Permite o rechaza la acción

```typescript
// Ejemplo de estructura del JWT
{
  "userId": "abc123",
  "email": "juan@example.com",
  "role": "user", // guest, user, owner, admin
  "iat": 1703001600,  // Fecha de emisión
  "exp": 1703088000   // Fecha de expiración (24h)
}
```

### Flujo de Autenticación

```
1. Login/Register
   ↓
2. Backend valida credenciales
   ↓
3. Backend genera JWT
   ↓
4. Frontend guarda token
   ↓
5. Frontend incluye token en requests
   Authorization: Bearer <token>
   ↓
6. Backend valida token en cada request
```

---

## 👥 ROLES Y PERMISOS

### 4 Tipos de Usuarios

| Rol | Permisos | Descripción |
|-----|----------|-------------|
| **Guest** | Ver locales, buscar, filtrar | Usuario sin login |
| **User** | Todo lo de Guest + dejar reseñas, favoritos | Usuario registrado |
| **Owner** | Todo lo de User + crear/editar su local | Dueño de negocio |
| **Admin** | Todo + aprobar/rechazar locales, moderar | Administrador |

### Tabla de Permisos Detallada

| Acción | Guest | User | Owner | Admin |
|--------|-------|------|-------|-------|
| Ver locales | ✅ | ✅ | ✅ | ✅ |
| Buscar/Filtrar | ✅ | ✅ | ✅ | ✅ |
| Ver reseñas | ✅ | ✅ | ✅ | ✅ |
| Crear reseña | ❌ | ✅ | ✅ | ✅ |
| Editar/eliminar propia reseña | ❌ | ✅ | ✅ | ✅ |
| Añadir a favoritos | ❌ | ✅ | ✅ | ✅ |
| Crear local | ❌ | ❌ | ✅ | ✅ |
| Editar propio local | ❌ | ❌ | ✅ | ✅ |
| Subir fotos del local | ❌ | ❌ | ✅ | ✅ |
| Responder a reseñas | ❌ | ❌ | ✅ | ✅ |
| Aprobar/rechazar locales | ❌ | ❌ | ❌ | ✅ |
| Moderar reseñas | ❌ | ❌ | ❌ | ✅ |
| Eliminar cualquier local | ❌ | ❌ | ❌ | ✅ |
| Ver estadísticas globales | ❌ | ❌ | ❌ | ✅ |

---

## 🛣️ RUTAS DINÁMICAS (Páginas Escalables)

### ✅ BUENA PRÁCTICA: Una Página, Múltiples Locales

```typescript
// App.tsx con React Router
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* RUTAS PÚBLICAS */}
        <Route path="/" element={<HomePage />} />
        <Route path="/local/:id" element={<BusinessDetail />} />
        <Route path="/categoria/:slug" element={<CategoryPage />} />
        <Route path="/buscar" element={<SearchResults />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* RUTAS DE AUTENTICACIÓN */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* RUTAS PROTEGIDAS - USUARIO */}
        <Route path="/perfil" element={<ProtectedRoute role="user"><ProfilePage /></ProtectedRoute>} />
        <Route path="/favoritos" element={<ProtectedRoute role="user"><FavoritesPage /></ProtectedRoute>} />
        
        {/* RUTAS PROTEGIDAS - OWNER */}
        <Route path="/mis-locales" element={<ProtectedRoute role="owner"><MyBusinesses /></ProtectedRoute>} />
        <Route path="/crear-local" element={<ProtectedRoute role="owner"><CreateBusiness /></ProtectedRoute>} />
        <Route path="/editar-local/:id" element={<ProtectedRoute role="owner"><EditBusiness /></ProtectedRoute>} />
        
        {/* RUTAS PROTEGIDAS - ADMIN */}
        <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/aprobar" element={<ProtectedRoute role="admin"><ApprovalsPage /></ProtectedRoute>} />
        
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}
```

### Componente de Detalle Dinámico

```typescript
// BusinessDetail.tsx
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';

function BusinessDetail() {
  const { id } = useParams(); // Captura el ID de la URL
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Fetch del local específico
    fetch(`/api/businesses/${id}`)
      .then(res => res.json())
      .then(data => {
        setBusiness(data);
        setLoading(false);
      })
      .catch(err => console.error(err));
  }, [id]); // Se ejecuta cada vez que cambia el ID
  
  if (loading) return <Loading />;
  if (!business) return <NotFound />;
  
  return (
    <div>
      <h1>{business.name}</h1>
      <p>{business.description}</p>
      {/* Renderiza toda la info del local */}
    </div>
  );
}
```

### Ventajas de Rutas Dinámicas

✅ **Escalabilidad infinita** - Un componente maneja 1, 100 o 1 millón de locales  
✅ **SEO mejorado** - Cada local tiene su propia URL  
✅ **Navegación nativa del navegador** - Botones atrás/adelante funcionan  
✅ **Compartir links** - Cada local tiene URL única  
✅ **Menos código** - No duplicas componentes  

---

## 🔌 BACKEND API

### Stack Recomendado

```
Runtime: Node.js 20+
Framework: Express.js o Fastify
Base de datos: PostgreSQL 15+ (RECOMENDADO para este proyecto)
ORM: Prisma (type-safe, excelente con TypeScript)
Autenticación: JWT + bcrypt
Validación: Zod (type-safe validation)
Upload: Multer (middleware) + Cloudinary (storage + CDN)
Geolocalización: PostGIS (extensión de PostgreSQL)
Rate Limiting: express-rate-limit
Seguridad: Helmet, CORS
Testing: Jest + Supertest
```

### ¿Por qué PostgreSQL + Cloudinary?

**PostgreSQL:**
- ✅ Excelente para datos relacionales (usuarios → negocios → reseñas)
- ✅ PostGIS para búsquedas geoespaciales eficientes
- ✅ Transacciones ACID (integridad de datos)
- ✅ Full-text search nativo
- ✅ JSON support para datos flexibles (amenidades, horarios)

**Cloudinary:**
- ✅ CDN global (imágenes rápidas en todo el mundo)
- ✅ Optimización automática (compresión, formatos webp/avif)
- ✅ Transformaciones on-the-fly (thumbnails, crops, filters)
- ✅ 25GB gratis + 25k transformaciones/mes
- ✅ No satura tu servidor con imágenes

### Estructura de Carpetas del Backend (DETALLADA)

```
backend/
├── prisma/
│   ├── schema.prisma        # Definición de modelos y DB
│   ├── migrations/          # Historial de cambios en DB
│   └── seed.ts              # Datos iniciales (categorías, admin)
├── src/
│   ├── config/
│   │   ├── database.ts      # Cliente Prisma
│   │   ├── cloudinary.ts    # Configuración Cloudinary
│   │   ├── jwt.ts           # Config JWT (secret, expiration)
│   │   └── constants.ts     # Constantes globales
│   ├── middleware/
│   │   ├── auth.ts          # Verificar JWT y attachear user
│   │   ├── roleCheck.ts     # Verificar roles específicos
│   │   ├── upload.ts        # Multer config (límites, tipos)
│   │   ├── validate.ts      # Validación con Zod
│   │   ├── errorHandler.ts  # Manejo centralizado de errores
│   │   └── rateLimiter.ts   # Rate limiting por endpoint
│   ├── models/              # (Si usas Prisma, esto es opcional)
│   │   └── types.ts         # Types exportados de Prisma
│   ├── routes/
│   │   ├── auth.routes.ts   # Login, register, verify, logout
│   │   ├── business.routes.ts     # CRUD de negocios (owner)
│   │   ├── public.routes.ts       # Endpoints públicos
│   │   ├── review.routes.ts       # CRUD de reseñas
│   │   ├── user.routes.ts         # Perfil, favoritos
│   │   ├── admin.routes.ts        # Aprobaciones, stats
│   │   ├── event.routes.ts        # Eventos/actualizaciones
│   │   ├── faq.routes.ts          # Preguntas frecuentes
│   │   └── category.routes.ts     # Categorías
│   ├── controllers/
│   │   ├── authController.ts      # Lógica de autenticación
│   │   ├── businessController.ts  # CRUD de negocios
│   │   ├── reviewController.ts    # Reseñas y reacciones
│   │   ├── userController.ts      # Perfil y favoritos
│   │   ├── adminController.ts     # Aprobaciones y moderación
│   │   ├── eventController.ts     # Eventos del negocio
│   │   ├── faqController.ts       # FAQ del negocio
│   │   ├── searchController.ts    # Búsqueda y filtros
│   │   └── geoController.ts       # Búsqueda geoespacial
│   ├── services/
│   │   ├── emailService.ts        # Nodemailer + templates
│   │   ├── imageService.ts        # Upload a Cloudinary
│   │   ├── geoService.ts          # Cálculos de distancia
│   │   ├── notificationService.ts # Notificaciones
│   │   └── statsService.ts        # Cálculo de estadísticas
│   ├── utils/
│   │   ├── validators.ts          # Schemas Zod reutilizables
│   │   ├── helpers.ts             # Funciones auxiliares
│   │   ├── slugify.ts             # Generar slugs únicos
│   │   └── password.ts            # Bcrypt helpers
│   ├── types/
│   │   ├── express.d.ts           # Extender tipos Express
│   │   └── index.ts               # Types exportados
│   └── index.ts                   # Entry point del servidor
├── uploads/                       # Carpeta temporal (git ignored)
├── .env                           # Variables de entorno
├── .env.example                   # Plantilla de .env
├── .gitignore
├── package.json
├── tsconfig.json
└── README.md
```

### Endpoints de la API (COMPLETOS)

#### 🔓 Públicos (sin autenticación)

```typescript
// ==================== AUTENTICACIÓN ====================
POST   /api/auth/register          
// Body: { name, email, password, role? }
// Response: { user, token }

POST   /api/auth/login             
// Body: { email, password }
// Response: { user, token }

POST   /api/auth/refresh           
// Headers: Authorization: Bearer <refresh_token>
// Response: { token }

POST   /api/auth/forgot-password   
// Body: { email }
// Response: { message: "Email enviado" }

POST   /api/auth/reset-password    
// Body: { token, newPassword }
// Response: { message: "Contraseña actualizada" }

// ==================== NEGOCIOS (PÚBLICOS) ====================
GET    /api/businesses             
// Query: ?page=1&limit=20&category=restaurant&city=CDMX&featured=true
// Response: { data: Business[], meta: { page, totalPages, total } }

GET    /api/businesses/:id         
// Incluye: toda la info + galería + eventos + stats públicos
// Response: { business: Business }

GET    /api/businesses/:slug       
// Acceso por slug único (ej: /api/businesses/cafe-la-maison)
// Response: { business: Business }

GET    /api/businesses/search      
// Query: ?q=cafe&category=restaurant&city=CDMX&priceRange=$$&minRating=4
// Full-text search + filtros combinados
// Response: { data: Business[], meta: {...} }

GET    /api/businesses/featured    
// Negocios destacados (featured=true)
// Response: { businesses: Business[] }

GET    /api/businesses/nearby      
// Query: ?lat=-34.603722&lng=-58.381592&radius=5000&category=restaurant
// Búsqueda geoespacial con PostGIS
// Response: { businesses: BusinessWithDistance[] }

// ==================== CATEGORÍAS ====================
GET    /api/categories             
// Lista todas las categorías con contador de negocios
// Response: { categories: Category[] }

GET    /api/categories/:slug/businesses
// Negocios de una categoría específica (con mapa)
// Query: ?lat=<lat>&lng=<lng>&radius=10000
// Response: { businesses: Business[], total: number }

// ==================== RESEÑAS (PÚBLICAS) ====================
GET    /api/reviews/business/:businessId
// Query: ?page=1&limit=10&rating=5&sortBy=recent
// Response: { reviews: Review[], stats: { distribution, average } }

GET    /api/reviews/recent         
// Últimas reseñas de todos los negocios
// Response: { reviews: Review[] }

GET    /api/reviews/search
// Query: ?businessId=<id>&keyword=excelente
// Buscar por palabras clave en reseñas
// Response: { reviews: Review[] }

// ==================== FAQ (PÚBLICAS) ====================
GET    /api/faq/business/:businessId
// Preguntas aprobadas de un negocio
// Response: { faqs: FAQ[] }

// ==================== EVENTOS (PÚBLICOS) ====================
GET    /api/events/business/:businessId
// Eventos/actualizaciones de un negocio
// Response: { events: Event[] }

GET    /api/events/recent
// Eventos recientes de todos los negocios
// Response: { events: Event[] }
```

#### 🔐 Protegidos - USER (requiere login)

```typescript
// ==================== RESEÑAS ====================
POST   /api/reviews                
// Body: { businessId, rating, title?, comment, images?: File[] }
// Solo puede dejar una reseña por negocio
// Response: { review: Review }

PUT    /api/reviews/:id            
// Body: { rating?, title?, comment? }
// Solo puede editar su propia reseña
// Response: { review: Review }

DELETE /api/reviews/:id            
// Solo puede eliminar su propia reseña
// Response: { message: "Reseña eliminada" }

POST   /api/reviews/:id/reaction   
// Body: { type: "helpful" | "not_helpful" }
// Reaccionar a una reseña (útil/no útil)
// Response: { helpful: number, notHelpful: number }

POST   /api/reviews/:id/images     
// FormData: images[] (máx 5 imágenes)
// Subir imágenes a una reseña existente
// Response: { images: string[] }

// ==================== FAVORITOS ====================
GET    /api/user/favorites         
// Lista de negocios favoritos del usuario
// Response: { favorites: Business[] }

POST   /api/user/favorites/:businessId
// Añadir negocio a favoritos
// Response: { message: "Añadido a favoritos" }

DELETE /api/user/favorites/:businessId
// Quitar de favoritos
// Response: { message: "Eliminado de favoritos" }

GET    /api/user/favorites/check/:businessId
// Verificar si un negocio está en favoritos
// Response: { isFavorite: boolean }

// ==================== PERFIL ====================
GET    /api/user/profile           
// Ver perfil completo
// Response: { user: User, stats: { reviews: number, favorites: number } }

PUT    /api/user/profile           
// Body: { name?, avatar?, city?, bio? }
// Response: { user: User }

PUT    /api/user/password          
// Body: { currentPassword, newPassword }
// Response: { message: "Contraseña actualizada" }

POST   /api/user/avatar            
// FormData: avatar (File)
// Upload de foto de perfil a Cloudinary
// Response: { avatarUrl: string }

GET    /api/user/reviews           
// Todas las reseñas del usuario
// Response: { reviews: Review[] }

// ==================== FAQ - USER ====================
POST   /api/faq/business/:businessId
// Body: { question: string }
// Crear pregunta (pasa a estado PENDING)
// Response: { faq: FAQ }

// ==================== SEGUIR NEGOCIOS ====================
POST   /api/user/follow/:businessId
// Seguir un negocio para recibir actualizaciones
// Response: { message: "Siguiendo negocio" }

DELETE /api/user/follow/:businessId
// Dejar de seguir
// Response: { message: "Dejaste de seguir" }

GET    /api/user/following
// Lista de negocios que sigue
// Response: { businesses: Business[] }
```

#### 🏢 Protegidos - OWNER (dueño de local)

```typescript
// ==================== GESTIÓN DE NEGOCIOS ====================
POST   /api/owner/businesses       
// Body: { name, description, category, address, ... }
// Crea negocio con status=PENDING (espera aprobación admin)
// Response: { business: Business, message: "Enviado para aprobación" }

GET    /api/owner/businesses       
// Ver todos mis negocios (PENDING, APPROVED, REJECTED)
// Response: { businesses: Business[] }

GET    /api/owner/businesses/:id   
// Ver detalle de mi negocio + stats privados
// Response: { business: Business, stats: {...} }

PUT    /api/owner/businesses/:id   
// Body: { name?, description?, ... }
// Solo puede editar sus propios negocios
// Response: { business: Business }

DELETE /api/owner/businesses/:id   
// Eliminar mi negocio (soft delete: status=DELETED)
// Response: { message: "Negocio eliminado" }

// ==================== GALERÍA DE FOTOS ====================
POST   /api/owner/businesses/:id/gallery
// FormData: images[] (máx 20 imágenes), categories[] (ej: ["exterior", "menu"])
// Upload múltiple a Cloudinary con categorización
// Response: { images: GalleryImage[] }

PUT    /api/owner/businesses/:id/gallery/:imageId
// Body: { category?: string, order?: number, isMain?: boolean }
// Actualizar metadata de una imagen
// Response: { image: GalleryImage }

DELETE /api/owner/businesses/:id/gallery/:imageId
// Eliminar imagen de la galería
// Response: { message: "Imagen eliminada" }

POST   /api/owner/businesses/:id/logo
// FormData: logo (File)
// Upload de logo del negocio
// Response: { logoUrl: string }

// ==================== EVENTOS/ACTUALIZACIONES ====================
POST   /api/owner/businesses/:id/events
// Body: { title, description, image?, startDate, endDate? }
// Crear evento/actualización (ej: menú nuevo, promoción)
// Response: { event: Event }

GET    /api/owner/businesses/:id/events
// Ver todos los eventos de mi negocio
// Response: { events: Event[] }

PUT    /api/owner/events/:eventId
// Body: { title?, description?, ... }
// Editar evento
// Response: { event: Event }

DELETE /api/owner/events/:eventId
// Eliminar evento
// Response: { message: "Evento eliminado" }

// ==================== FAQ - GESTIÓN ====================
GET    /api/owner/businesses/:id/faq
// Ver todas las preguntas (PENDING, APPROVED, REJECTED)
// Response: { faqs: FAQ[] }

PUT    /api/owner/faq/:faqId/answer
// Body: { answer: string }
// Responder y aprobar pregunta (status=APPROVED)
// Response: { faq: FAQ }

PUT    /api/owner/faq/:faqId/reject
// Body: { reason?: string }
// Rechazar pregunta (status=REJECTED)
// Response: { message: "Pregunta rechazada" }

DELETE /api/owner/faq/:faqId
// Eliminar pregunta
// Response: { message: "Pregunta eliminada" }

// ==================== RESPUESTAS A RESEÑAS ====================
POST   /api/owner/reviews/:reviewId/reply
// Body: { reply: string }
// Responder a una reseña de mi negocio
// Response: { review: Review }

PUT    /api/owner/reviews/:reviewId/reply
// Body: { reply: string }
// Editar mi respuesta
// Response: { review: Review }

DELETE /api/owner/reviews/:reviewId/reply
// Eliminar mi respuesta
// Response: { review: Review }

// ==================== CARACTERÍSTICAS DEL NEGOCIO ====================
PUT    /api/owner/businesses/:id/features
// Body: { features: Feature[] }
// Features: [{ icon: "wifi", label: "WiFi Gratis", enabled: true }, ...]
// Actualizar características mostradas con íconos
// Response: { features: Feature[] }

// ==================== BOTONES DE CONTACTO ====================
PUT    /api/owner/businesses/:id/contact-buttons
// Body: { buttons: ContactButton[] }
// Buttons: [{ type: "whatsapp", value: "+123456", order: 1, enabled: true }, ...]
// Definir qué botones mostrar y en qué orden
// Response: { buttons: ContactButton[] }

// ==================== HORARIOS ====================
PUT    /api/owner/businesses/:id/hours
// Body: { hours: Hours }
// Hours: { monday: { open: "09:00", close: "18:00", closed: false }, ... }
// Response: { hours: Hours }

// ==================== ESTADÍSTICAS PRIVADAS ====================
GET    /api/owner/businesses/:id/stats
// Stats del negocio (vistas, clicks en contacto, etc.)
// Query: ?period=7d (7d, 30d, 90d, all)
// Response: { 
//   views: number,
//   favorites: number,
//   followers: number,
//   contactClicks: { whatsapp: 10, messenger: 5, ... },
//   reviewsPerRating: { 5: 20, 4: 10, ... },
//   avgRating: 4.5
// }

GET    /api/owner/businesses/:id/analytics
// Analíticas detalladas (gráficos temporales)
// Response: { viewsOverTime: [], ratingsOverTime: [] }
```

#### 👑 Protegidos - ADMIN (administrador)

```typescript
// ==================== APROBACIONES ====================
GET    /api/admin/pending-businesses
// Lista de negocios con status=PENDING
// Response: { businesses: Business[] }

PUT    /api/admin/businesses/:id/approve
// Body: { message?: string }
// Aprobar negocio (status=APPROVED)
// Envía email al owner
// Response: { business: Business }

PUT    /api/admin/businesses/:id/reject
// Body: { reason: string }
// Rechazar negocio (status=REJECTED)
// Envía email al owner con el motivo
// Response: { business: Business }

PUT    /api/admin/businesses/:id/suspend
// Body: { reason: string }
// Suspender negocio aprobado (status=SUSPENDED)
// Response: { business: Business }

PUT    /api/admin/businesses/:id/unsuspend
// Reactivar negocio suspendido (status=APPROVED)
// Response: { business: Business }

// ==================== GESTIÓN DE NEGOCIOS ====================
GET    /api/admin/businesses
// Todos los negocios (con filtros por status)
// Query: ?status=APPROVED&page=1&limit=50
// Response: { businesses: Business[], meta: {...} }

PUT    /api/admin/businesses/:id
// Editar cualquier negocio (full control)
// Response: { business: Business }

DELETE /api/admin/businesses/:id
// Eliminar permanentemente cualquier negocio
// Response: { message: "Negocio eliminado" }

PUT    /api/admin/businesses/:id/featured
// Body: { featured: boolean }
// Marcar/desmarcar como destacado
// Response: { business: Business }

PUT    /api/admin/businesses/:id/verified
// Body: { verified: boolean }
// Marcar/desmarcar como verificado (badge especial)
// Response: { business: Business }

// ==================== GESTIÓN DE USUARIOS ====================
GET    /api/admin/users
// Listar todos los usuarios
// Query: ?role=owner&page=1&search=juan
// Response: { users: User[], meta: {...} }

GET    /api/admin/users/:id
// Ver detalle de usuario + actividad
// Response: { user: User, activity: {...} }

PUT    /api/admin/users/:id/role
// Body: { role: "user" | "owner" | "admin" }
// Cambiar rol de usuario
// Response: { user: User }

PUT    /api/admin/users/:id/ban
// Body: { reason: string, duration?: number }
// Banear usuario (temporal o permanente)
// Response: { user: User }

DELETE /api/admin/users/:id
// Eliminar usuario permanentemente
// Response: { message: "Usuario eliminado" }

// ==================== MODERACIÓN DE RESEÑAS ====================
GET    /api/admin/reviews
// Todas las reseñas (con filtros)
// Query: ?flagged=true&page=1
// Response: { reviews: Review[] }

DELETE /api/admin/reviews/:id
// Eliminar cualquier reseña (spam, abuso)
// Body: { reason: string }
// Response: { message: "Reseña eliminada" }

GET    /api/admin/reports
// Ver reportes de usuarios sobre reseñas/negocios
// Response: { reports: Report[] }

PUT    /api/admin/reports/:id/resolve
// Body: { action: "delete" | "warn" | "ignore", note?: string }
// Resolver reporte
// Response: { report: Report }

// ==================== GESTIÓN DE CATEGORÍAS ====================
POST   /api/admin/categories
// Body: { name, slug, description, icon, subcategories[] }
// Crear nueva categoría
// Response: { category: Category }

PUT    /api/admin/categories/:id
// Editar categoría
// Response: { category: Category }

DELETE /api/admin/categories/:id
// Eliminar categoría (si no tiene negocios)
// Response: { message: "Categoría eliminada" }

PUT    /api/admin/categories/reorder
// Body: { categories: [{ id, order }, ...] }
// Reordenar categorías en el frontend
// Response: { categories: Category[] }

// ==================== ESTADÍSTICAS GLOBALES ====================
GET    /api/admin/stats
// Dashboard principal con métricas globales
// Response: {
//   users: { total, new: { today, week, month } },
//   businesses: { total, pending, approved, rejected },
//   reviews: { total, avgRating, recent },
//   activity: { viewsToday, searchesToday }
// }

GET    /api/admin/analytics
// Analíticas avanzadas con gráficos
// Query: ?period=30d
// Response: { 
//   usersOverTime: [],
//   businessesOverTime: [],
//   popularCategories: [],
//   topBusinesses: []
// }

// ==================== CONFIGURACIÓN DEL SISTEMA ====================
GET    /api/admin/settings
// Configuración global de la app
// Response: { settings: Settings }

PUT    /api/admin/settings
// Body: { maintenanceMode?, featuredLimit?, ... }
// Actualizar configuración
// Response: { settings: Settings }

// ==================== NOTIFICACIONES ====================
POST   /api/admin/notifications/broadcast
// Body: { title, message, target: "all" | "owners" | "users" }
// Enviar notificación masiva
// Response: { sent: number }
```

### 🔧 IMPLEMENTACIÓN TÉCNICA DEL BACKEND

---

#### 1. Sistema de Upload de Imágenes con Cloudinary

```typescript
// services/imageService.ts
import { v2 as cloudinary } from 'cloudinary';
import { Readable } from 'stream';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

interface UploadOptions {
  folder: string;
  category?: string;
  businessId?: string;
}

export const imageService = {
  /**
   * Upload múltiple de imágenes
   * Comprime automáticamente y genera thumbnails
   */
  uploadImages: async (files: Express.Multer.File[], options: UploadOptions) => {
    const uploadPromises = files.map(file => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder,
            resource_type: 'image',
            // Transformaciones automáticas
            transformation: [
              { width: 1920, height: 1080, crop: 'limit', quality: 'auto:good' },
              { fetch_format: 'auto' } // Convierte a webp/avif según browser
            ],
            // Eager transformations (thumbnails)
            eager: [
              { width: 400, height: 300, crop: 'fill' }, // Card thumbnail
              { width: 150, height: 150, crop: 'fill' }  // Avatar
            ],
            tags: [options.category, options.businessId].filter(Boolean)
          },
          (error, result) => {
            if (error) reject(error);
            else resolve({
              publicId: result.public_id,
              url: result.secure_url,
              thumbnail: result.eager[0].secure_url,
              avatar: result.eager[1].secure_url,
              category: options.category
            });
          }
        );
        
        Readable.from(file.buffer).pipe(uploadStream);
      });
    });
    
    return Promise.all(uploadPromises);
  },
  
  /**
   * Eliminar imagen de Cloudinary
   */
  deleteImage: async (publicId: string) => {
    return cloudinary.uploader.destroy(publicId);
  },
  
  /**
   * Eliminar múltiples imágenes
   */
  deleteImages: async (publicIds: string[]) => {
    return cloudinary.api.delete_resources(publicIds);
  }
};
```

```typescript
// middleware/upload.ts
import multer from 'multer';

// Configuración de Multer (memoria, no disco)
const storage = multer.memoryStorage();

const fileFilter = (req: any, file: Express.Multer.File, cb: any) => {
  // Solo permitir imágenes
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Solo se permiten imágenes (jpg, png, webp)'), false);
  }
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB por imagen
    files: 20 // Máximo 20 imágenes por request
  }
});

// Uso en rutas
// router.post('/gallery', upload.array('images', 20), uploadGalleryHandler);
```

---

#### 2. Búsqueda Geoespacial con PostGIS

```typescript
// services/geoService.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const geoService = {
  /**
   * Buscar negocios cercanos a una ubicación
   * Usa la fórmula Haversine para calcular distancias
   */
  findNearby: async (lat: number, lng: number, radiusInMeters: number, filters?: any) => {
    // Query crudo con PostGIS
    const businesses = await prisma.$queryRaw`
      SELECT 
        *,
        (
          6371000 * acos(
            cos(radians(${lat})) * 
            cos(radians(latitude)) * 
            cos(radians(longitude) - radians(${lng})) + 
            sin(radians(${lat})) * 
            sin(radians(latitude))
          )
        ) AS distance
      FROM "Business"
      WHERE 
        status = 'APPROVED'
        ${filters?.category ? Prisma.sql`AND category = ${filters.category}` : Prisma.empty}
      HAVING distance < ${radiusInMeters}
      ORDER BY distance ASC
      LIMIT ${filters?.limit || 50}
    `;
    
    return businesses;
  },
  
  /**
   * Calcular distancia entre dos puntos
   */
  calculateDistance: (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371000; // Radio de la Tierra en metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
};
```

```sql
-- Migration para habilitar PostGIS (si usas PostgreSQL)
-- prisma/migrations/xxx_enable_postgis/migration.sql
CREATE EXTENSION IF NOT EXISTS postgis;

-- Agregar columna de geometría para búsquedas más rápidas
ALTER TABLE "Business" 
ADD COLUMN location geometry(Point, 4326);

-- Crear índice espacial
CREATE INDEX idx_business_location ON "Business" USING GIST (location);

-- Trigger para actualizar location automáticamente
CREATE OR REPLACE FUNCTION update_business_location()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
    NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_business_location
BEFORE INSERT OR UPDATE ON "Business"
FOR EACH ROW
EXECUTE FUNCTION update_business_location();
```

---

#### 3. Full-Text Search (Búsqueda Avanzada)

```typescript
// controllers/searchController.ts
import { PrismaClient, Prisma } from '@prisma/client';

const prisma = new PrismaClient();

export const searchController = {
  search: async (req, res) => {
    const { 
      q,              // Query de búsqueda
      category,       // Filtro por categoría
      city,           // Filtro por ciudad
      priceRange,     // $, $$, $$$, $$$$
      minRating,      // Rating mínimo
      amenities,      // Array de amenidades
      page = 1,
      limit = 20
    } = req.query;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    // Construir filtros dinámicamente
    const where: Prisma.BusinessWhereInput = {
      status: 'APPROVED',
      // Full-text search en nombre y descripción
      ...(q && {
        OR: [
          { name: { contains: q as string, mode: 'insensitive' } },
          { description: { contains: q as string, mode: 'insensitive' } },
          { fullDescription: { contains: q as string, mode: 'insensitive' } }
        ]
      }),
      ...(category && { category: category as string }),
      ...(city && { city: city as string }),
      ...(priceRange && { priceRange: priceRange as string }),
      ...(minRating && { rating: { gte: Number(minRating) } }),
      ...(amenities && { 
        amenities: { 
          hasEvery: (amenities as string).split(',') 
        } 
      })
    };
    
    const [businesses, total] = await Promise.all([
      prisma.business.findMany({
        where,
        skip,
        take: Number(limit),
        orderBy: [
          { featured: 'desc' },  // Destacados primero
          { rating: 'desc' },    // Luego por rating
          { reviewCount: 'desc' } // Luego por número de reseñas
        ],
        include: {
          _count: {
            select: { reviews: true, favorites: true }
          }
        }
      }),
      prisma.business.count({ where })
    ]);
    
    res.json({
      data: businesses,
      meta: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit))
      }
    });
  }
};
```

---

#### 4. Sistema de Notificaciones por Email

```typescript
// services/emailService.ts
import nodemailer from 'nodemailer';
import { renderEmailTemplate } from '../utils/emailTemplates';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export const emailService = {
  /**
   * Email de bienvenida
   */
  sendWelcomeEmail: async (user: { name: string; email: string }) => {
    await transporter.sendMail({
      from: '"Locales" <no-reply@locales.com>',
      to: user.email,
      subject: '¡Bienvenido a Locales!',
      html: renderEmailTemplate('welcome', { name: user.name })
    });
  },
  
  /**
   * Notificar a owner que su negocio fue aprobado
   */
  sendBusinessApproved: async (owner: any, business: any) => {
    await transporter.sendMail({
      from: '"Locales" <no-reply@locales.com>',
      to: owner.email,
      subject: '✅ Tu negocio ha sido aprobado',
      html: renderEmailTemplate('business-approved', {
        ownerName: owner.name,
        businessName: business.name,
        businessUrl: `${process.env.FRONTEND_URL}/local/${business.slug}`
      })
    });
  },
  
  /**
   * Notificar a owner que su negocio fue rechazado
   */
  sendBusinessRejected: async (owner: any, business: any, reason: string) => {
    await transporter.sendMail({
      from: '"Locales" <no-reply@locales.com>',
      to: owner.email,
      subject: '❌ Tu negocio no fue aprobado',
      html: renderEmailTemplate('business-rejected', {
        ownerName: owner.name,
        businessName: business.name,
        reason
      })
    });
  },
  
  /**
   * Notificar a owner que recibió una nueva reseña
   */
  sendNewReview: async (owner: any, business: any, review: any) => {
    await transporter.sendMail({
      from: '"Locales" <no-reply@locales.com>',
      to: owner.email,
      subject: `⭐ Nueva reseña en ${business.name}`,
      html: renderEmailTemplate('new-review', {
        ownerName: owner.name,
        businessName: business.name,
        rating: review.rating,
        comment: review.comment,
        reviewUrl: `${process.env.FRONTEND_URL}/local/${business.slug}#review-${review.id}`
      })
    });
  },
  
  /**
   * Notificar a admin de nuevo negocio pendiente
   */
  sendNewBusinessPending: async (adminEmail: string, business: any) => {
    await transporter.sendMail({
      from: '"Locales" <no-reply@locales.com>',
      to: adminEmail,
      subject: '🔔 Nuevo negocio pendiente de aprobación',
      html: renderEmailTemplate('admin-pending-business', {
        businessName: business.name,
        category: business.category,
        approveUrl: `${process.env.FRONTEND_URL}/admin/aprobar/${business.id}`
      })
    });
  }
};
```

---

#### 5. Rate Limiting y Seguridad

```typescript
// middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL);

// Rate limiter general (100 requests / 15min)
export const generalLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:general:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Demasiadas peticiones, intenta de nuevo en 15 minutos'
});

// Rate limiter para login (5 intentos / 15min)
export const loginLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:login:'
  }),
  windowMs: 15 * 60 * 1000,
  max: 5,
  skipSuccessfulRequests: true, // Solo contar intentos fallidos
  message: 'Demasiados intentos de login, intenta de nuevo en 15 minutos'
});

// Rate limiter para crear reseñas (3 / hora)
export const reviewLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:review:'
  }),
  windowMs: 60 * 60 * 1000,
  max: 3,
  message: 'Solo puedes crear 3 reseñas por hora'
});

// Rate limiter para upload de imágenes (10 / hora)
export const uploadLimiter = rateLimit({
  store: new RedisStore({
    client: redis,
    prefix: 'rl:upload:'
  }),
  windowMs: 60 * 60 * 1000,
  max: 10,
  message: 'Límite de uploads alcanzado, intenta en 1 hora'
});
```

```typescript
// index.ts - Aplicar seguridad
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import { generalLimiter } from './middleware/rateLimiter';

const app = express();

// Seguridad con Helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https://res.cloudinary.com'],
      scriptSrc: ["'self'", "'unsafe-inline'"],
    }
  }
}));

// CORS configurado
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting global
app.use('/api', generalLimiter);

// Body parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
```

---

#### 6. Cálculo Automático de Rating

```typescript
// utils/ratingCalculator.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const updateBusinessRating = async (businessId: string) => {
  // Obtener todas las reseñas del negocio
  const reviews = await prisma.review.findMany({
    where: { businessId },
    select: { rating: true }
  });
  
  if (reviews.length === 0) {
    await prisma.business.update({
      where: { id: businessId },
      data: { rating: 0, reviewCount: 0 }
    });
    return;
  }
  
  // Calcular promedio
  const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
  const average = sum / reviews.length;
  
  // Actualizar negocio
  await prisma.business.update({
    where: { id: businessId },
    data: {
      rating: Math.round(average * 10) / 10, // Redondear a 1 decimal
      reviewCount: reviews.length
    }
  });
};

// Usar en el controller de reseñas
// Después de crear/editar/eliminar una reseña:
await updateBusinessRating(review.businessId);
```

---

### Ejemplo de Middleware de Autenticación

```typescript
// middleware/auth.ts
import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';

interface JWTPayload {
  userId: string;
  email: string;
  role: string;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  // Obtener token del header
  const token = req.headers.authorization?.split(' ')[1]; // "Bearer <token>"
  
  if (!token) {
    return res.status(401).json({ error: 'No autorizado - Token no proporcionado' });
  }
  
  try {
    // Verificar el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as JWTPayload;
    
    // Añadir info del usuario al request
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Middleware para verificar roles
export const checkRole = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ error: 'No autenticado' });
    }
    
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }
    
    next();
  };
};
```

### Ejemplo de Endpoint Protegido

```typescript
// routes/business.routes.ts
import { Router } from 'express';
import { verifyToken, checkRole } from '../middleware/auth';
import { createBusiness, updateBusiness } from '../controllers/businessController';

const router = Router();

// Solo OWNER puede crear locales
router.post(
  '/',
  verifyToken,                    // Primero verifica que esté logeado
  checkRole('owner', 'admin'),    // Luego verifica que sea owner o admin
  createBusiness                  // Finalmente ejecuta el controlador
);

// Solo el OWNER del local o ADMIN pueden editarlo
router.put(
  '/:id',
  verifyToken,
  checkRole('owner', 'admin'),
  updateBusiness
);

export default router;
```

---

## 💻 FRONTEND ACTUALIZADO

### 1. Instalar React Router

```bash
npm install react-router-dom
```

### 2. Estructura de Carpetas Mejorada

```
src/
├── components/
│   ├── business/
│   ├── common/          # Componentes compartidos
│   │   ├── ProtectedRoute.tsx
│   │   ├── Navbar.tsx
│   │   └── Footer.tsx
│   ├── auth/            # Componentes de autenticación
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   └── ui/
├── pages/               # Páginas completas
│   ├── HomePage.tsx
│   ├── BusinessDetailPage.tsx
│   ├── SearchResultsPage.tsx
│   ├── ProfilePage.tsx
│   ├── MyBusinessesPage.tsx
│   ├── AdminDashboard.tsx
│   └── NotFoundPage.tsx
├── context/             # Estado global
│   └── AuthContext.tsx
├── services/            # Llamadas a la API
│   ├── api.ts
│   ├── authService.ts
│   ├── businessService.ts
│   └── reviewService.ts
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   ├── useBusiness.ts
│   └── useReviews.ts
├── types/               # TypeScript types
│   ├── user.ts
│   ├── business.ts
│   └── review.ts
├── utils/               # Utilidades
│   ├── constants.ts
│   └── formatters.ts
├── App.tsx
└── main.tsx
```

### 3. Context de Autenticación

```typescript
// context/AuthContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'guest' | 'user' | 'owner' | 'admin';
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Verificar si hay un token guardado al cargar la app
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      // Verificar el token con el backend
      authService.verifyToken(token)
        .then(userData => setUser(userData))
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);
  
  const login = async (email: string, password: string) => {
    const { user, token } = await authService.login(email, password);
    localStorage.setItem('token', token);
    setUser(user);
  };
  
  const register = async (data: any) => {
    const { user, token } = await authService.register(data);
    localStorage.setItem('token', token);
    setUser(user);
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };
  
  const hasRole = (role: string) => {
    if (!user) return false;
    const roleHierarchy = ['guest', 'user', 'owner', 'admin'];
    const userRoleIndex = roleHierarchy.indexOf(user.role);
    const requiredRoleIndex = roleHierarchy.indexOf(role);
    return userRoleIndex >= requiredRoleIndex;
  };
  
  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      hasRole
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};
```

### 4. Componente de Ruta Protegida

```typescript
// components/common/ProtectedRoute.tsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'user' | 'owner' | 'admin';
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Cargando...</div>; // O un spinner
  }
  
  // No está logeado
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  // Está logeado pero no tiene el rol requerido
  if (role && !hasRole(role)) {
    return <Navigate to="/" replace />;
  }
  
  // Todo OK, mostrar el contenido
  return <>{children}</>;
}
```

### 5. Servicio de API

```typescript
// services/api.ts
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Crear instancia de axios con configuración base
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a cada request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de autenticación
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);
```

```typescript
// services/businessService.ts
import { api } from './api';

export const businessService = {
  // Obtener todos los locales
  getAll: async (filters?: any) => {
    const { data } = await api.get('/businesses', { params: filters });
    return data;
  },
  
  // Obtener un local por ID
  getById: async (id: string) => {
    const { data } = await api.get(`/businesses/${id}`);
    return data;
  },
  
  // Buscar locales
  search: async (query: string, filters?: any) => {
    const { data } = await api.get('/businesses/search', {
      params: { q: query, ...filters }
    });
    return data;
  },
  
  // Crear local (solo OWNER)
  create: async (businessData: any) => {
    const { data } = await api.post('/owner/businesses', businessData);
    return data;
  },
  
  // Actualizar local (solo OWNER)
  update: async (id: string, businessData: any) => {
    const { data } = await api.put(`/owner/businesses/${id}`, businessData);
    return data;
  },
  
  // Eliminar local
  delete: async (id: string) => {
    const { data } = await api.delete(`/owner/businesses/${id}`);
    return data;
  },
  
  // Subir imágenes
  uploadImages: async (id: string, images: File[]) => {
    const formData = new FormData();
    images.forEach(image => formData.append('images', image));
    
    const { data } = await api.post(`/owner/businesses/${id}/images`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },
};
```

### 6. Custom Hook para Negocio

```typescript
// hooks/useBusiness.ts
import { useState, useEffect } from 'react';
import { businessService } from '../services/businessService';

export function useBusiness(id: string) {
  const [business, setBusiness] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    businessService.getById(id)
      .then(data => {
        setBusiness(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [id]);
  
  const refresh = () => {
    setLoading(true);
    businessService.getById(id)
      .then(data => {
        setBusiness(data);
        setLoading(false);
      });
  };
  
  return { business, loading, error, refresh };
}
```

### 7. Página de Detalle Dinámica

```typescript
// pages/BusinessDetailPage.tsx
import { useParams, Navigate } from 'react-router-dom';
import { useBusiness } from '../hooks/useBusiness';
import { useAuth } from '../context/AuthContext';

export function BusinessDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { business, loading, error } = useBusiness(id!);
  const { user } = useAuth();
  
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage error={error} />;
  if (!business) return <Navigate to="/404" />;
  
  return (
    <div>
      <Breadcrumbs />
      <BusinessGallery images={business.gallery} />
      <BusinessHeader business={business} />
      <BusinessInfo business={business} />
      
      {/* Sección de reseñas */}
      <ReviewsSection businessId={business.id}>
        {/* Solo usuarios logeados pueden dejar reseña */}
        {user ? (
          <CreateReviewForm businessId={business.id} />
        ) : (
          <div className="text-center p-4 bg-gray-50">
            <p>Inicia sesión para dejar una reseña</p>
            <Link to="/login" className="btn-primary">Iniciar Sesión</Link>
          </div>
        )}
      </ReviewsSection>
      
      <SimilarBusinesses category={business.category} />
    </div>
  );
}
```

---

## 💾 BASE DE DATOS

### 🎯 DECISIÓN: PostgreSQL + Cloudinary

**PostgreSQL para:**
- ✅ Datos estructurados (usuarios, negocios, reseñas)
- ✅ Relaciones complejas con integridad referencial
- ✅ Búsquedas geoespaciales (PostGIS)
- ✅ Full-text search nativo
- ✅ Transacciones ACID

**Cloudinary para:**
- ✅ Almacenar todas las imágenes (fotos de negocios, avatares, reseñas)
- ✅ CDN global (carga rápida en todo el mundo)
- ✅ Optimización automática (compresión, webp, lazy loading)
- ✅ Transformaciones on-demand (thumbnails, crops)
- ✅ 25GB gratis + 25,000 transformaciones/mes

**Alternativa completa:** Supabase (PostgreSQL + Storage + Auth integrado, 100% gratis para empezar)

---

### Schema Completo con Prisma (PostgreSQL)

```prisma
// prisma/schema.prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==================== USUARIOS ====================
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String    // Hasheado con bcrypt
  role          Role      @default(USER)
  avatar        String?   // URL de Cloudinary
  city          String?
  bio           String?
  banned        Boolean   @default(false)
  banReason     String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  // Relaciones
  businesses    Business[]
  reviews       Review[]
  favorites     Favorite[]
  following     Following[]
  faqs          FAQ[]
  
  @@index([email])
  @@index([role])
}

enum Role {
  GUEST
  USER
  OWNER
  ADMIN
}

// ==================== NEGOCIOS ====================
model Business {
  id              String      @id @default(cuid())
  name            String
  slug            String      @unique
  description     String      // Resumen corto (max 200 chars)
  fullDescription String?     // Descripción larga
  category        String
  subcategory     String?
  
  // Ubicación
  address         String
  city            String
  state           String
  zipCode         String?
  latitude        Float?
  longitude       Float?
  
  // Contacto (botones personalizables)
  contactButtons  Json?       // [{ type: "whatsapp", value: "+123", order: 1, enabled: true }, ...]
  phone           String?
  email           String?
  website         String?
  
  // Horarios
  hours           Json?       // { "monday": { "open": "09:00", "close": "18:00", "closed": false }, ... }
  
  // Info comercial
  priceRange      String?     // $, $$, $$$, $$$$
  
  // Características con íconos (definidas por owner)
  features        Json?       // [{ icon: "wifi", label: "WiFi Gratis", enabled: true }, ...]
  amenities       String[]    // ["WiFi", "Estacionamiento", "Acceso discapacitados"]
  
  // Media (URLs de Cloudinary)
  logo            String?     // Logo principal
  coverImage      String?     // Imagen de fondo del header
  
  // Estado
  status          Status      @default(PENDING)
  featured        Boolean     @default(false)
  verified        Boolean     @default(false)
  
  // Stats públicos
  rating          Float       @default(0)
  reviewCount     Int         @default(0)
  viewCount       Int         @default(0)
  favoriteCount   Int         @default(0)
  followerCount   Int         @default(0)
  
  // Timestamps
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  // Relaciones
  owner           User        @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  ownerId         String
  reviews         Review[]
  favorites       Favorite[]
  gallery         GalleryImage[]
  events          Event[]
  faqs            FAQ[]
  followers       Following[]
  
  @@index([slug])
  @@index([status])
  @@index([category])
  @@index([city])
  @@index([featured])
  @@index([rating])
  @@index([ownerId])
}

enum Status {
  PENDING       // Esperando aprobación
  APPROVED      // Aprobado y visible
  REJECTED      // Rechazado
  SUSPENDED     // Suspendido por admin
}

// ==================== GALERÍA DE IMÁGENES ====================
model GalleryImage {
  id          String    @id @default(cuid())
  url         String    // URL de Cloudinary (imagen full)
  thumbnail   String    // URL del thumbnail (400x300)
  publicId    String    // Public ID de Cloudinary (para eliminar)
  category    String?   // "exterior", "interior", "menu", "productos", etc.
  order       Int       @default(0)
  isMain      Boolean   @default(false) // Imagen principal del slide
  createdAt   DateTime  @default(now())
  
  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  businessId  String
  
  @@index([businessId])
  @@index([category])
}

// ==================== EVENTOS/ACTUALIZACIONES ====================
model Event {
  id          String    @id @default(cuid())
  title       String
  description String
  image       String?   // URL de Cloudinary
  startDate   DateTime
  endDate     DateTime?
  published   Boolean   @default(true)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  businessId  String
  
  @@index([businessId])
  @@index([startDate])
}

// ==================== RESEÑAS ====================
model Review {
  id          String    @id @default(cuid())
  rating      Int       // 1-5 estrellas
  title       String?
  comment     String
  images      String[]  // URLs de imágenes adjuntas (Cloudinary)
  
  // Reacciones
  helpful     Int       @default(0)
  notHelpful  Int       @default(0)
  
  // Respuesta del dueño
  ownerReply  String?
  repliedAt   DateTime?
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relaciones
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  businessId  String
  reactions   ReviewReaction[]
  
  @@unique([userId, businessId]) // Un usuario = una reseña por negocio
  @@index([businessId])
  @@index([rating])
}

// ==================== REACCIONES A RESEÑAS ====================
model ReviewReaction {
  id          String    @id @default(cuid())
  type        ReactionType
  createdAt   DateTime  @default(now())
  
  review      Review    @relation(fields: [reviewId], references: [id], onDelete: Cascade)
  reviewId    String
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  
  @@unique([reviewId, userId]) // Un usuario solo puede reaccionar una vez por reseña
  @@index([reviewId])
}

enum ReactionType {
  HELPFUL
  NOT_HELPFUL
}

// ==================== FAQ (PREGUNTAS FRECUENTES) ====================
model FAQ {
  id          String    @id @default(cuid())
  question    String
  answer      String?
  status      FAQStatus @default(PENDING)
  createdAt   DateTime  @default(now())
  answeredAt  DateTime?
  
  // Usuario que hizo la pregunta
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  
  // Negocio al que pertenece
  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  businessId  String
  
  @@index([businessId])
  @@index([status])
}

enum FAQStatus {
  PENDING   // Esperando que owner responda
  APPROVED  // Respondida y visible
  REJECTED  // Rechazada por owner
}

// ==================== FAVORITOS ====================
model Favorite {
  id          String    @id @default(cuid())
  createdAt   DateTime  @default(now())
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  businessId  String
  
  @@unique([userId, businessId])
  @@index([userId])
  @@index([businessId])
}

// ==================== SEGUIR NEGOCIOS ====================
model Following {
  id          String    @id @default(cuid())
  createdAt   DateTime  @default(now())
  
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId      String
  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  businessId  String
  
  @@unique([userId, businessId])
  @@index([userId])
  @@index([businessId])
}

// ==================== CATEGORÍAS ====================
model Category {
  id            String   @id @default(cuid())
  name          String   @unique
  slug          String   @unique
  description   String?
  icon          String?   // URL del ícono o nombre del ícono (Lucide)
  subcategories String[]  // ["Comida Rápida", "Internacional", ...]
  order         Int      @default(0)
  createdAt     DateTime @default(now())
  
  @@index([slug])
}
```

---

### Comandos Prisma Útiles

```bash
# Instalar Prisma
npm install @prisma/client
npm install -D prisma

# Inicializar Prisma
npx prisma init

# Crear/aplicar migraciones
npx prisma migrate dev --name init

# Generar cliente de Prisma (después de cambios en schema)
npx prisma generate

# Abrir Prisma Studio (GUI para ver/editar datos)
npx prisma studio

# Reset completo de base de datos
npx prisma migrate reset

# Crear seed data
npx prisma db seed
```

---

### Seed Data (Datos Iniciales)

```typescript
// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // Crear admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@locales.com' },
    update: {},
    create: {
      email: 'admin@locales.com',
      name: 'Admin',
      password: await bcrypt.hash('admin123', 10),
      role: 'ADMIN'
    }
  });
  
  // Crear categorías
  const categories = [
    { name: 'Restaurantes', slug: 'restaurantes', icon: 'utensils', 
      subcategories: ['Comida Rápida', 'Internacional', 'Cafetería', 'Bar'] },
    { name: 'Belleza', slug: 'belleza', icon: 'sparkles',
      subcategories: ['Peluquería', 'Spa', 'Uñas', 'Barbería'] },
    { name: 'Salud', slug: 'salud', icon: 'heart-pulse',
      subcategories: ['Clínica', 'Dentista', 'Farmacia', 'Óptica'] },
    { name: 'Servicios', slug: 'servicios', icon: 'briefcase',
      subcategories: ['Plomería', 'Electricidad', 'Carpintería', 'Limpieza'] },
    { name: 'Tiendas', slug: 'tiendas', icon: 'shopping-bag',
      subcategories: ['Ropa', 'Tecnología', 'Mascotas', 'Hogar'] }
  ];
  
  for (const [index, cat] of categories.entries()) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: { ...cat, order: index }
    });
  }
  
  console.log('✅ Seed completado');
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

```json
// package.json - agregar script de seed
{
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

---

### Variables de Entorno (.env)

```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/locales?schema=public"

# JWT
JWT_SECRET="tu-secret-super-seguro-aqui-cambiar-en-produccion"
JWT_EXPIRES_IN="24h"

# Cloudinary
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Email (Nodemailer + Gmail)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="465"
SMTP_USER="tu-email@gmail.com"
SMTP_PASS="tu-app-password"

# Frontend URL
FRONTEND_URL="http://localhost:5173"

# Redis (opcional, para rate limiting)
REDIS_URL="redis://localhost:6379"

# Node Environment
NODE_ENV="development"
PORT="3000"
```
  logo            String?
  gallery         String[]    // URLs de imágenes
  
  // Estado
  status          Status      @default(PENDING)
  featured        Boolean     @default(false)
  verified        Boolean     @default(false)
  
  // Stats
  rating          Float       @default(0)
  reviewCount     Int         @default(0)
  viewCount       Int         @default(0)
  
  // Timestamps
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt
  
  // Relaciones
  owner           User        @relation(fields: [ownerId], references: [id])
  ownerId         String
  reviews         Review[]
  favorites       Favorite[]
}

enum Status {
  PENDING       // Esperando aprobación
  APPROVED      // Aprobado y visible
  REJECTED      // Rechazado
  SUSPENDED     // Suspendido por admin
}

model Review {
  id          String    @id @default(cuid())
  rating      Int       // 1-5 estrellas
  title       String?
  comment     String
  helpful     Int       @default(0)
  notHelpful  Int       @default(0)
  
  // Respuesta del dueño
  ownerReply  String?
  repliedAt   DateTime?
  
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
  
  // Relaciones
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  businessId  String
  
  @@unique([userId, businessId]) // Un usuario solo puede dejar una reseña por local
}

model Favorite {
  id          String    @id @default(cuid())
  createdAt   DateTime  @default(now())
  
  user        User      @relation(fields: [userId], references: [id])
  userId      String
  business    Business  @relation(fields: [businessId], references: [id], onDelete: Cascade)
  businessId  String
  
  @@unique([userId, businessId])
}

model Category {
  id            String   @id @default(cuid())
  name          String   @unique
  slug          String   @unique
  description   String?
  icon          String?
  subcategories String[] // ["Comida Rápida", "Internacional", ...]
  order         Int      @default(0)
  createdAt     DateTime @default(now())
}
```

---

## 📊 CUMPLIMIENTO DE REQUISITOS

### ✅ Requisitos Implementados

#### 1. **Listado de Negocios por Categoría**
- ✅ Vista de tarjetas con datos completos
- ✅ Slider de fotos principales (modelo `GalleryImage` con `isMain`)
- ✅ Nombre, categorías, rating, reseñas (modelo `Business`)
- ✅ Dirección y resumen (campos `address`, `description`)
- ✅ Botón "ver más" que lleva a `/local/:id`
- ✅ Mapa interactivo con pines (PostGIS + `latitude/longitude`)
- ✅ Búsqueda geoespacial por ubicación del usuario (`/api/businesses/nearby`)

#### 2. **Página de Perfil de Empresa**
- ✅ Header con imagen de fondo (`coverImage`) y nombre
- ✅ Botones de seguir (`Following` model), favoritos (`Favorite` model) y compartir
- ✅ Descripción larga (`fullDescription`)
- ✅ Eventos/actualizaciones en slider (`Event` model con pop-up)
- ✅ Galería de fotos categorizada (`GalleryImage` con campo `category`)
- ✅ Sin videos (validación en middleware de upload)
- ✅ Características con íconos (`features` JSON field)
- ✅ Mapa con ubicación, dirección y horarios (`hours` JSON field)
- ✅ Foro de FAQ (`FAQ` model con estados PENDING/APPROVED/REJECTED)
- ✅ Sistema de reseñas completo:
  - Distribución por estrellas (calculado en backend)
  - Promedio total (`rating` field con actualización automática)
  - Filtro por puntuación y búsqueda de keywords
  - Tarjetas con: foto usuario, nombre, ciudad, rating, texto, imágenes
  - Reacciones útil/no útil (`ReviewReaction` model)
- ✅ Botón para dejar reseña (con auth check)
- ✅ Botones de contacto personalizables (`contactButtons` JSON field)

#### 3. **Sistema de Imágenes**
- ✅ Upload a Cloudinary (no satura el servidor)
- ✅ Solo imágenes permitidas (validación con Multer)
- ✅ Compresión automática y webp/avif
- ✅ Thumbnails generados on-the-fly
- ✅ Categorización dinámica de galería
- ✅ URLs guardadas en PostgreSQL

---

## 🗺️ RESUMEN: ARQUITECTURA DE FOTOS

```
┌─────────────────────────────────────────────────────┐
│                   FLUJO DE IMÁGENES                  │
└─────────────────────────────────────────────────────┘

1. USUARIO SUBE FOTO
   ↓
2. MULTER (middleware)
   - Valida: solo jpg/png/webp
   - Límite: 5MB por imagen, máx 20 imágenes
   - Buffer en memoria (no guarda en disco)
   ↓
3. CLOUDINARY (cloud storage)
   - Recibe buffer
   - Comprime y optimiza
   - Genera thumbnails (400x300, 150x150)
   - Convierte a webp/avif automáticamente
   - Retorna URLs: 
     * URL full: https://res.cloudinary.com/.../full.jpg
     * URL thumbnail: https://res.cloudinary.com/.../thumb.jpg
   ↓
4. POSTGRESQL (metadata)
   - Guarda solo URLs y datos estructurados:
     {
       id: "abc123",
       url: "https://res.cloudinary.com/.../full.jpg",
       thumbnail: "https://res.cloudinary.com/.../thumb.jpg",
       publicId: "locales/business/xyz",
       category: "interior",
       businessId: "business-id"
     }
   ↓
5. FRONTEND
   - Recibe URLs desde API
   - Renderiza con <img src={thumbnail} />
   - Lazy loading automático
   - CDN global = carga rápida
```

### Ventajas de este enfoque:
- 🚀 **Performance**: CDN global de Cloudinary
- 💰 **Costo**: 25GB gratis (suficiente para empezar)
- 🔧 **Escalable**: No satura tu servidor
- 🎨 **Optimizado**: webp/avif automático
- 🔄 **Flexible**: Cambiar tamaños sin re-upload

---

## 🎯 PRÓXIMOS PASOS

### Fase 1: Setup Backend (Días 1-3)
1. Crear proyecto Node.js + TypeScript
2. Instalar dependencias (Express, Prisma, JWT, etc.)
3. Configurar PostgreSQL (local o Railway)
4. Crear schema de Prisma
5. Correr migraciones y seed
6. Configurar Cloudinary

### Fase 2: Auth y API Base (Días 4-7)
1. Implementar JWT auth
2. Crear endpoints de usuarios
3. Middleware de auth y roles
4. Sistema de upload de imágenes
5. Testing con Postman

### Fase 3: CRUD de Negocios (Días 8-12)
1. Endpoints públicos (listar, ver, buscar)
2. Endpoints de owner (crear, editar, galería)
3. Sistema de aprobación (admin)
4. Búsqueda geoespacial
5. Estadísticas

### Fase 4: Reseñas y Features (Días 13-16)
1. Sistema de reseñas completo
2. Reacciones
3. FAQ system
4. Eventos/actualizaciones
5. Sistema de seguir/favoritos

### Fase 5: Optimización y Deploy (Días 17-20)
1. Rate limiting y seguridad
2. Emails y notificaciones
3. Testing completo
4. Deploy backend (Railway)
5. Documentación API

---

## 🎭 FLUJOS DE USUARIO

### Flujo 1: Usuario No Registrado (Guest)

```
1. Entra a la app
   ↓
2. Ve el Hero con carrusel
   ↓
3. Busca "café" o selecciona categoría
   ↓
4. Ve resultados filtrados
   ↓
5. Click en un local
   ↓
6. Ve toda la info + reseñas de otros
   ↓
7. Intenta dejar una reseña
   ↓
8. Sistema le pide que inicie sesión
   ↓
9. Se registra/loguea
   ↓
10. Ahora puede dejar reseña
```

### Flujo 2: Dueño de Local (Owner)

```
1. Se registra como usuario normal
   ↓
2. Va a "Crear Local" en el menú
   ↓
3. Completa formulario con:
   - Info básica (nombre, categoría, descripción)
   - Ubicación (dirección, ciudad)
   - Contacto (teléfono, email, redes)
   - Horarios
   - Fotos (galería)
   - Amenidades
   ↓
4. Submit → Local pasa a estado PENDING
   ↓
5. Sistema notifica al admin (email)
   ↓
6. Admin revisa el local en panel de aprobaciones
   ↓
7a. Admin APRUEBA → Status = APPROVED → Visible en la app
7b. Admin RECHAZA → Status = REJECTED → Dueño recibe notificación con razón
   ↓
8. Si fue aprobado, el local aparece en búsquedas
   ↓
9. Dueño puede:
   - Editar info del local
   - Subir más fotos
   - Responder a reseñas
   - Ver estadísticas
```

### Flujo 3: Administrador

```
1. Ingresa al panel de admin
   ↓
2. Ve dashboard con:
   - Locales pendientes de aprobación (badge rojo con número)
   - Total de locales activos
   - Total de usuarios
   - Reseñas recientes
   - Estadísticas globales
   ↓
3. Entra a "Locales Pendientes"
   ↓
4. Ve lista de locales PENDING con toda su info
   ↓
5. Para cada local puede:
   - Ver vista previa completa
   - APROBAR (pasa a visible)
   - RECHAZAR (con motivo)
   - SUSPENDER (si ya estaba aprobado pero viola reglas)
   ↓
6. También puede:
   - Moderar reseñas (eliminar spam/abuso)
   - Gestionar usuarios (cambiar roles, banear)
   - Ver estadísticas detalladas
   - Editar categorías
```

---

## 📅 PLAN DE IMPLEMENTACIÓN

### Fase 1: Setup y Autenticación (Semana 1-2)

**Backend:**
- [ ] Configurar proyecto Node.js + Express
- [ ] Configurar base de datos (PostgreSQL + Prisma)
- [ ] Implementar modelos (User, Business, Review)
- [ ] Crear sistema de autenticación (JWT)
- [ ] Endpoints de auth (register, login, verify)

**Frontend:**
- [ ] Instalar React Router
- [ ] Crear AuthContext
- [ ] Crear páginas de Login y Register
- [ ] Implementar ProtectedRoute
- [ ] Actualizar Navbar con dropdown de usuario

### Fase 2: CRUD de Locales (Semana 3-4)

**Backend:**
- [ ] Endpoints para listar/buscar locales (públicos)
- [ ] Endpoint para ver detalle de local
- [ ] Endpoints de OWNER (crear, editar, eliminar)
- [ ] Sistema de upload de imágenes (Cloudinary/S3)
- [ ] Validaciones con Zod

**Frontend:**
- [ ] Migrar mock data a llamadas API
- [ ] Crear página dinámica de detalle (/local/:id)
- [ ] Crear formulario de crear local (OWNER)
- [ ] Implementar upload de múltiples imágenes
- [ ] Actualizar BusinessCard para usar datos reales

### Fase 3: Sistema de Reseñas (Semana 5)

**Backend:**
- [ ] Endpoints de reseñas (crear, editar, eliminar)
- [ ] Sistema de reacciones (útil/no útil)
- [ ] Respuesta del dueño a reseñas
- [ ] Cálculo automático de rating promedio

**Frontend:**
- [ ] Formulario de crear reseña (solo USER+)
- [ ] Lista de reseñas con paginación
- [ ] Sistema de reacciones
- [ ] Respuestas del dueño (solo OWNER del local)

### Fase 4: Panel de Admin (Semana 6)

**Backend:**
- [ ] Endpoints de admin (aprobar/rechazar locales)
- [ ] Sistema de notificaciones (email)
- [ ] Endpoints de estadísticas
- [ ] Moderación de reseñas

**Frontend:**
- [ ] Dashboard de admin
- [ ] Página de aprobaciones
- [ ] Panel de estadísticas
- [ ] Gestión de usuarios

### Fase 5: Features Adicionales (Semana 7-8)

**Backend:**
- [ ] Sistema de favoritos
- [ ] Estadísticas por local (views, clicks)
- [ ] Sistema de badges (Popular, Verificado, Nuevo)
- [ ] API de búsqueda avanzada con filtros

**Frontend:**
- [ ] Página de favoritos
- [ ] Sistema de búsqueda mejorado
- [ ] Filtros avanzados
- [ ] Página de categorías

### Fase 6: Optimización y Deploy (Semana 9-10)

**Backend:**
- [ ] Configurar Redis para cache
- [ ] Implementar rate limiting
- [ ] Optimizar queries de DB (indexes)
- [ ] Deploy en Railway/Render/Fly.io

**Frontend:**
- [ ] Optimización de imágenes (lazy loading)
- [ ] Code splitting
- [ ] SEO (meta tags dinámicos)
- [ ] Deploy en Vercel/Netlify

---

## 🛠️ STACK TECNOLÓGICO RECOMENDADO

### Frontend
```
Core: React 18 + TypeScript + Vite
Router: React Router v6
State: Context API + Zustand (estado global ligero)
Forms: React Hook Form + Zod (validación)
HTTP: Axios
UI: Mantener shadcn/ui actual
Icons: Mantener Lucide React
Styles: Mantener Tailwind CSS
```

### Backend
```
Runtime: Node.js 20+
Framework: Express.js (simple) o Fastify (más rápido)
Lenguaje: TypeScript
Base de datos: PostgreSQL 15+
ORM: Prisma (type-safe, excelente DX)
Auth: JWT (jsonwebtoken) + bcrypt
Validación: Zod
Upload: Multer + Cloudinary (gratis hasta 25GB)
Email: Nodemailer + SendGrid/Resend
Cache: Redis (opcional para optimización)
```

### DevOps y Deploy
```
Backend: Railway.app (gratis + PostgreSQL incluido)
Frontend: Vercel (integración con Git, gratis)
Imágenes: Cloudinary (CDN gratis)
Domain: Namecheap/GoDaddy
SSL: Automático con Vercel y Railway
```

### Alternativas Gratuitas para Empezar
```
Backend: Render.com (500h gratis/mes)
DB: Supabase (PostgreSQL gratis)
Imágenes: Supabase Storage (gratis)
Email: Resend (3000 emails/mes gratis)
```

---

## 🎯 BUENAS PRÁCTICAS

### Frontend

1. **Separación de Responsabilidades**
   - Componentes solo presentan UI
   - Lógica de negocio en hooks
   - Llamadas API en servicios

2. **Manejo de Estados**
   ```typescript
   // ❌ MAL: Estado en cada componente
   function BusinessCard() {
     const [isFavorite, setIsFavorite] = useState(false);
     // Problema: Estado se pierde al cambiar de página
   }
   
   // ✅ BIEN: Estado global
   function BusinessCard() {
     const { favorites, addFavorite } = useFavorites();
     // Estado persiste en toda la app
   }
   ```

3. **Manejo de Errores**
   ```typescript
   // ✅ Siempre manejar errores
   try {
     const business = await businessService.getById(id);
     setBusiness(business);
   } catch (error) {
     if (error.response?.status === 404) {
       navigate('/404');
     } else {
       setError('Error al cargar el local');
     }
   }
   ```

4. **Optimización de Renders**
   ```typescript
   // ✅ Usar React.memo para componentes pesados
   export const BusinessCard = React.memo(({ business }) => {
     // Solo re-renderiza si business cambia
   });
   
   // ✅ Usar useCallback para funciones
   const handleClick = useCallback(() => {
     navigate(`/local/${id}`);
   }, [id, navigate]);
   ```

5. **Lazy Loading**
   ```typescript
   // ✅ Cargar páginas bajo demanda
   const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));
   
   <Route path="/admin" element={
     <Suspense fallback={<Loading />}>
       <AdminDashboard />
     </Suspense>
   } />
   ```

### Backend

1. **Validación de Datos**
   ```typescript
   // ✅ Siempre validar antes de guardar
   import { z } from 'zod';
   
   const businessSchema = z.object({
     name: z.string().min(3).max(100),
     email: z.string().email(),
     phone: z.string().regex(/^\+?[1-9]\d{1,14}$/),
   });
   
   const validatedData = businessSchema.parse(req.body);
   ```

2. **Manejo de Errores Centralizado**
   ```typescript
   // middleware/errorHandler.ts
   export const errorHandler = (err, req, res, next) => {
     console.error(err);
     
     if (err instanceof ZodError) {
       return res.status(400).json({ error: 'Datos inválidos', details: err.errors });
     }
     
     if (err.name === 'JsonWebTokenError') {
       return res.status(401).json({ error: 'Token inválido' });
     }
     
     res.status(500).json({ error: 'Error interno del servidor' });
   };
   ```

3. **Paginación Siempre**
   ```typescript
   // ✅ Nunca devolver todos los registros
   const getBusinesses = async (req, res) => {
     const page = parseInt(req.query.page) || 1;
     const limit = parseInt(req.query.limit) || 20;
     const skip = (page - 1) * limit;
     
     const [businesses, total] = await Promise.all([
       prisma.business.findMany({ skip, take: limit }),
       prisma.business.count()
     ]);
     
     res.json({
       data: businesses,
       meta: {
         page,
         limit,
         total,
         totalPages: Math.ceil(total / limit)
       }
     });
   };
   ```

4. **Seguridad**
   ```typescript
   // ✅ Helmet para headers de seguridad
   import helmet from 'helmet';
   app.use(helmet());
   
   // ✅ CORS configurado
   import cors from 'cors';
   app.use(cors({
     origin: process.env.FRONTEND_URL,
     credentials: true
   }));
   
   // ✅ Rate limiting
   import rateLimit from 'express-rate-limit';
   const limiter = rateLimit({
     windowMs: 15 * 60 * 1000, // 15 minutos
     max: 100 // 100 requests por IP
   });
   app.use('/api', limiter);
   ```

5. **No Exponer Datos Sensibles**
   ```typescript
   // ❌ MAL: Devolver password
   const user = await prisma.user.findUnique({ where: { id } });
   res.json(user); // Incluye password hasheado
   
   // ✅ BIEN: Excluir campos sensibles
   const user = await prisma.user.findUnique({
     where: { id },
     select: {
       id: true,
       name: true,
       email: true,
       role: true,
       avatar: true,
       // password: false (no incluir)
     }
   });
   res.json(user);
   ```

---

## 🚀 VENTAJAS DE ESTA ARQUITECTURA

✅ **Escalabilidad infinita** - Soporta 1 o 1 millón de locales  
✅ **Seguridad robusta** - JWT + roles + validaciones  
✅ **SEO mejorado** - Cada local tiene URL única  
✅ **Experiencia nativa** - Navegación sin recargas  
✅ **Mantenible** - Código organizado y separado  
✅ **Type-safe** - TypeScript en frontend y backend  
✅ **Performance** - Paginación, cache, lazy loading  
✅ **Multiplataforma** - Misma API para web y futuras apps móviles  

---

## 📚 RECURSOS Y DOCUMENTACIÓN

### Tutoriales Recomendados
- [React Router Documentation](https://reactrouter.com/)
- [Prisma Getting Started](https://www.prisma.io/docs/getting-started)
- [JWT Best Practices](https://jwt.io/introduction)
- [Express.js Guide](https://expressjs.com/en/guide/routing.html)

### Herramientas Útiles
- [Postman](https://www.postman.com/) - Testing de API
- [TablePlus](https://tableplus.com/) - Cliente de base de datos
- [Excalidraw](https://excalidraw.com/) - Diagramas
- [Figma](https://figma.com/) - Diseño UI

---

## ✅ RESUMEN EJECUTIVO

Tu app actual es una **SPA con datos estáticos**. Para convertirla en una aplicación completa necesitas:

1. **Backend API** con Node.js + Express + PostgreSQL
2. **Autenticación JWT** con 4 roles (Guest, User, Owner, Admin)
3. **React Router** para navegación con URLs reales
4. **Rutas dinámicas** (`/local/:id`) en lugar de componentes estáticos
5. **Estado global** con Context API para auth y datos compartidos
6. **Servicios de API** para separar lógica de negocio
7. **Sistema de aprobación** donde Admin revisa locales antes de publicar

**Tiempo estimado:** 8-10 semanas con 1 desarrollador  
**Complejidad:** Media-Alta  
**Costo:** $0 usando servicios gratuitos (Railway + Vercel + Cloudinary)

¿Listo para empezar? 🚀
