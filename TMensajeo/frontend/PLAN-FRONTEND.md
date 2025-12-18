# 🎨 PLAN FRONTEND - TMENSAJEO

**Fecha de creación:** 18 de Diciembre, 2025  
**Estado:** Documento de planificación  
**Stack Frontend:** React + TypeScript + Vite + React Router + Axios

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo](#-resumen-ejecutivo)
2. [Stack Tecnológico](#-stack-tecnológico)
3. [Estructura de Carpetas](#-estructura-de-carpetas)
4. [Páginas/Vistas](#-páginasvistas)
5. [Componentes Principales](#-componentes-principales)
6. [Rutas (React Router)](#-rutas-react-router)
7. [Servicios API](#-servicios-api)
8. [Context/Estado Global](#-contextestado-global)
9. [Flujos de Usuario](#-flujos-de-usuario)
10. [Mapeo Backend-Frontend](#-mapeo-backend-frontend)

---

## 🎯 RESUMEN EJECUTIVO

### Objetivo
Crear una aplicación web moderna para descubrir y gestionar negocios locales, conectando usuarios, dueños de negocios y administradores en una sola plataforma.

### Características Principales
- 🔍 Búsqueda y filtrado de negocios locales
- 🗺️ Visualización en mapa interactivo
- ⭐ Sistema de reseñas y calificaciones
- 💼 Panel de gestión para dueños de negocios
- 👤 Perfiles de usuario personalizables
- 📸 Galería de fotos por negocio
- ❤️ Favoritos y seguimiento de negocios
- 🎫 Sistema de eventos
- ❓ FAQs por negocio
- 🔔 Notificaciones en tiempo real (futuro)

### Usuarios Objetivo
1. **Visitantes (GUEST)** - Exploran y buscan negocios
2. **Usuarios (USER)** - Dejan reseñas y guardan favoritos
3. **Dueños (OWNER)** - Gestionan sus negocios
4. **Admins (ADMIN)** - Moderan la plataforma

---

## 🛠️ STACK TECNOLÓGICO

### Core
- **React 18** - Librería UI
- **TypeScript** - Type safety
- **Vite** - Build tool (ultra rápido)
- **React Router 6** - Navegación

### Estado y Datos
- **React Context API** - Estado global (Auth, User)
- **Axios** - HTTP client
- **React Query** (opcional) - Cache y sincronización de datos

### UI/Estilos
- **Tailwind CSS** (recomendado) - Utility-first CSS
- **shadcn/ui** (opcional) - Componentes pre-construidos
- **Lucide React** - Iconos modernos
- **Framer Motion** (opcional) - Animaciones

### Mapas
- **Leaflet** + **React Leaflet** - Mapas interactivos
- **OpenStreetMap** - Proveedor de mapas (gratis)

### Formularios
- **React Hook Form** - Manejo de formularios
- **Zod** - Validación (mismo que backend)

### Extras
- **date-fns** - Manipulación de fechas
- **react-hot-toast** - Notificaciones toast
- **clsx** - Manipulación de clases CSS

---

## 📁 ESTRUCTURA DE CARPETAS

```
frontend/
├── public/
│   ├── favicon.ico
│   └── images/
│       ├── logo.svg
│       └── placeholder.png
│
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # App principal
│   │
│   ├── assets/                     # Imágenes, fonts
│   │   ├── images/
│   │   └── icons/
│   │
│   ├── components/                 # Componentes reutilizables
│   │   ├── common/                 # Comunes a toda la app
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Spinner.tsx
│   │   │   ├── Avatar.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── Pagination.tsx
│   │   │
│   │   ├── layout/                 # Layout components
│   │   │   ├── Header.tsx          # Header con nav y user menu
│   │   │   ├── Footer.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── Container.tsx
│   │   │
│   │   ├── business/               # Específicos de negocios
│   │   │   ├── BusinessCard.tsx         # Card en listados
│   │   │   ├── BusinessGrid.tsx         # Grid de cards
│   │   │   ├── BusinessList.tsx         # List view
│   │   │   ├── BusinessDetail.tsx       # Vista detalle completa
│   │   │   ├── BusinessGallery.tsx      # Galería de fotos
│   │   │   ├── BusinessMap.tsx          # Mapa del negocio
│   │   │   ├── BusinessInfo.tsx         # Info básica
│   │   │   ├── BusinessHours.tsx        # Horarios
│   │   │   ├── BusinessContact.tsx      # Botones de contacto
│   │   │   └── BusinessStats.tsx        # Estadísticas
│   │   │
│   │   ├── review/                 # Sistema de reseñas
│   │   │   ├── ReviewCard.tsx           # Una reseña
│   │   │   ├── ReviewList.tsx           # Lista de reseñas
│   │   │   ├── ReviewForm.tsx           # Formulario nueva reseña
│   │   │   ├── ReviewRating.tsx         # Estrellas de rating
│   │   │   └── ReviewStats.tsx          # Resumen de ratings
│   │   │
│   │   ├── search/                 # Búsqueda y filtros
│   │   │   ├── SearchBar.tsx            # Barra de búsqueda
│   │   │   ├── SearchFilters.tsx        # Panel de filtros
│   │   │   ├── CategoryFilter.tsx       # Filtro por categoría
│   │   │   ├── PriceRangeFilter.tsx     # Filtro por precio
│   │   │   ├── DistanceFilter.tsx       # Filtro por distancia
│   │   │   └── SortOptions.tsx          # Opciones de ordenamiento
│   │   │
│   │   ├── event/                  # Sistema de eventos
│   │   │   ├── EventCard.tsx
│   │   │   ├── EventList.tsx
│   │   │   └── EventCalendar.tsx
│   │   │
│   │   ├── faq/                    # Preguntas frecuentes
│   │   │   ├── FaqItem.tsx
│   │   │   ├── FaqList.tsx
│   │   │   └── FaqForm.tsx
│   │   │
│   │   ├── map/                    # Componentes de mapa
│   │   │   ├── MapView.tsx              # Mapa principal
│   │   │   ├── MapMarker.tsx            # Marker personalizado
│   │   │   └── MapPopup.tsx             # Popup en marker
│   │   │
│   │   ├── forms/                  # Formularios complejos
│   │   │   ├── BusinessForm.tsx         # Crear/editar negocio
│   │   │   ├── ProfileForm.tsx          # Editar perfil
│   │   │   └── ImageUpload.tsx          # Upload de imágenes
│   │   │
│   │   └── auth/                   # Autenticación
│   │       ├── LoginForm.tsx
│   │       ├── RegisterForm.tsx
│   │       ├── ForgotPasswordForm.tsx
│   │       └── ResetPasswordForm.tsx
│   │
│   ├── pages/                      # Páginas completas
│   │   ├── public/                 # Páginas públicas
│   │   │   ├── HomePage.tsx             # Landing page
│   │   │   ├── BusinessDetailPage.tsx   # /local/:slug
│   │   │   ├── SearchPage.tsx           # /buscar
│   │   │   ├── MapPage.tsx              # /mapa
│   │   │   ├── CategoryPage.tsx         # /categoria/:slug
│   │   │   ├── AboutPage.tsx            # /nosotros
│   │   │   └── ContactPage.tsx          # /contacto
│   │   │
│   │   ├── auth/                   # Autenticación
│   │   │   ├── LoginPage.tsx            # /login
│   │   │   ├── RegisterPage.tsx         # /register
│   │   │   ├── VerifyEmailPage.tsx      # /verify/:token
│   │   │   ├── ForgotPasswordPage.tsx   # /forgot-password
│   │   │   └── ResetPasswordPage.tsx    # /reset-password/:token
│   │   │
│   │   ├── user/                   # Usuario autenticado
│   │   │   ├── ProfilePage.tsx          # /perfil
│   │   │   ├── FavoritesPage.tsx        # /favoritos
│   │   │   ├── FollowingPage.tsx        # /siguiendo
│   │   │   ├── MyReviewsPage.tsx        # /mis-resenas
│   │   │   └── SettingsPage.tsx         # /configuracion
│   │   │
│   │   ├── owner/                  # Panel del dueño
│   │   │   ├── DashboardPage.tsx        # /owner/dashboard
│   │   │   ├── MyBusinessesPage.tsx     # /owner/negocios
│   │   │   ├── CreateBusinessPage.tsx   # /owner/negocios/nuevo
│   │   │   ├── EditBusinessPage.tsx     # /owner/negocios/:id/editar
│   │   │   ├── ReviewsManagePage.tsx    # /owner/resenas
│   │   │   ├── EventsManagePage.tsx     # /owner/eventos
│   │   │   ├── FaqsManagePage.tsx       # /owner/faqs
│   │   │   └── StatsPage.tsx            # /owner/estadisticas
│   │   │
│   │   ├── admin/                  # Panel de administrador
│   │   │   ├── AdminDashboard.tsx       # /admin
│   │   │   ├── UsersManagePage.tsx      # /admin/usuarios
│   │   │   ├── BusinessesManagePage.tsx # /admin/negocios
│   │   │   ├── ReviewsModerate.tsx      # /admin/resenas
│   │   │   ├── CategoriesPage.tsx       # /admin/categorias
│   │   │   └── StatsPage.tsx            # /admin/estadisticas
│   │   │
│   │   └── errors/                 # Páginas de error
│   │       ├── NotFoundPage.tsx         # 404
│   │       ├── UnauthorizedPage.tsx     # 401
│   │       └── ServerErrorPage.tsx      # 500
│   │
│   ├── services/                   # Servicios API
│   │   ├── api.ts                       # Axios instance configurada
│   │   ├── authService.ts               # Auth endpoints
│   │   ├── userService.ts               # User endpoints
│   │   ├── businessService.ts           # Business endpoints
│   │   ├── reviewService.ts             # Review endpoints
│   │   ├── eventService.ts              # Event endpoints
│   │   ├── faqService.ts                # FAQ endpoints
│   │   ├── categoryService.ts           # Category endpoints
│   │   ├── searchService.ts             # Search endpoints
│   │   ├── uploadService.ts             # Upload endpoints
│   │   ├── ownerService.ts              # Owner endpoints
│   │   └── adminService.ts              # Admin endpoints
│   │
│   ├── context/                    # Context API
│   │   ├── AuthContext.tsx              # Usuario, login, logout
│   │   ├── ThemeContext.tsx             # Dark/Light mode
│   │   └── NotificationContext.tsx      # Toasts y notificaciones
│   │
│   ├── hooks/                      # Custom hooks
│   │   ├── useAuth.ts                   # Hook de autenticación
│   │   ├── useDebounce.ts               # Debounce para búsqueda
│   │   ├── useIntersection.ts           # Infinite scroll
│   │   ├── useLocalStorage.ts           # localStorage
│   │   ├── useGeolocation.ts            # Ubicación del usuario
│   │   └── useMediaQuery.ts             # Responsive
│   │
│   ├── types/                      # TypeScript types
│   │   ├── auth.types.ts
│   │   ├── user.types.ts
│   │   ├── business.types.ts
│   │   ├── review.types.ts
│   │   ├── event.types.ts
│   │   ├── category.types.ts
│   │   └── api.types.ts                 # Tipos de respuestas API
│   │
│   ├── utils/                      # Utilidades
│   │   ├── constants.ts                 # Constantes globales
│   │   ├── validators.ts                # Validaciones Zod
│   │   ├── formatters.ts                # Formateo de datos
│   │   ├── helpers.ts                   # Funciones auxiliares
│   │   └── storage.ts                   # LocalStorage helpers
│   │
│   ├── styles/                     # Estilos globales
│   │   ├── globals.css
│   │   └── tailwind.css
│   │
│   └── routes/                     # Configuración de rutas
│       ├── AppRoutes.tsx                # Router principal
│       ├── PrivateRoute.tsx             # Protección de rutas
│       └── RoleRoute.tsx                # Rutas por rol
│
├── .env                            # Variables de entorno
├── .gitignore
├── package.json
├── tsconfig.json
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🖥️ PÁGINAS/VISTAS

### Total: **29 páginas**

### 1. PÚBLICAS (7 páginas)

#### HomePage `/`
**Propósito:** Landing page principal  
**Componentes:**
- Hero section con búsqueda destacada
- Categorías populares
- Negocios destacados
- Reseñas recientes
- CTA para registrarse

#### BusinessDetailPage `/local/:slug`
**Propósito:** Detalle completo de un negocio  
**Componentes:**
- Galería de imágenes
- Info básica (nombre, descripción, rating)
- Horarios
- Ubicación + mapa
- Botones de contacto
- Reviews con paginación
- FAQs
- Eventos próximos
- Negocios similares

#### SearchPage `/buscar`
**Propósito:** Búsqueda y filtrado de negocios  
**Componentes:**
- SearchBar con autocompletado
- Filtros (categoría, precio, distancia, rating)
- Toggle grid/list view
- Toggle map view
- BusinessCards paginados
- Sort options

#### MapPage `/mapa`
**Propósito:** Vista de mapa con todos los negocios  
**Componentes:**
- Mapa fullscreen
- Markers por negocio
- Popups con info básica
- Filtros lateral
- Clustering de markers

#### CategoryPage `/categoria/:slug`
**Propósito:** Negocios de una categoría  
**Componentes:**
- Header de categoría
- Grid de negocios
- Filtros específicos

#### AboutPage `/nosotros`
**Propósito:** Información sobre la plataforma

#### ContactPage `/contacto`
**Propósito:** Formulario de contacto

---

### 2. AUTENTICACIÓN (5 páginas)

#### LoginPage `/login`
- Formulario email + password
- Link a "Olvidé contraseña"
- Link a registrarse
- Botón de login social (futuro)

#### RegisterPage `/register`
- Formulario de registro
- Selector de rol (USER/OWNER)
- Términos y condiciones
- Mensaje de verificación de email

#### VerifyEmailPage `/verify/:token`
- Verificación automática al cargar
- Mensaje de éxito/error
- Redirect a login

#### ForgotPasswordPage `/forgot-password`
- Formulario email
- Mensaje de confirmación

#### ResetPasswordPage `/reset-password/:token`
- Formulario nueva contraseña
- Validación de token
- Redirect a login

---

### 3. USUARIO (5 páginas)

#### ProfilePage `/perfil`
- Avatar
- Info personal
- Formulario edición
- Cambio de contraseña
- Eliminar cuenta

#### FavoritesPage `/favoritos`
- Grid de negocios favoritos
- Opción de remover

#### FollowingPage `/siguiendo`
- Lista de negocios que sigue
- Updates recientes

#### MyReviewsPage `/mis-resenas`
- Lista de reseñas propias
- Editar/Eliminar

#### SettingsPage `/configuracion`
- Preferencias
- Notificaciones
- Privacidad

---

### 4. OWNER - Panel de Dueño (8 páginas)

#### DashboardPage `/owner/dashboard`
- Resumen de métricas
- Gráficas de visitas
- Reseñas recientes
- Accesos rápidos

#### MyBusinessesPage `/owner/negocios`
- Lista de negocios propios
- Status (activo, pendiente, rechazado)
- Botón crear nuevo

#### CreateBusinessPage `/owner/negocios/nuevo`
- Formulario completo de negocio
- Upload de logo/cover
- Ubicación en mapa
- Botones de contacto

#### EditBusinessPage `/owner/negocios/:id/editar`
- Editar toda la info
- Upload/delete de galería
- Ver estadísticas

#### ReviewsManagePage `/owner/resenas`
- Reseñas de todos mis negocios
- Responder reseñas
- Filtros

#### EventsManagePage `/owner/eventos`
- Crear/editar/eliminar eventos
- Calendario

#### FaqsManagePage `/owner/faqs`
- Gestionar preguntas frecuentes
- Responder preguntas

#### StatsPage `/owner/estadisticas`
- Estadísticas detalladas
- Gráficas
- Exportar datos

---

### 5. ADMIN - Panel de Administrador (4 páginas)

#### AdminDashboard `/admin`
- Métricas globales
- Negocios pendientes
- Reportes recientes

#### UsersManagePage `/admin/usuarios`
- Lista de usuarios
- Ban/Unban
- Cambiar rol
- Ver actividad

#### BusinessesManagePage `/admin/negocios`
- Aprobar/Rechazar negocios
- Moderar contenido
- Ver reportes

#### ReviewsModerate `/admin/resenas`
- Moderar reseñas
- Eliminar inapropiadas
- Gestionar reportes

#### CategoriesPage `/admin/categorias`
- CRUD de categorías
- Ordenamiento

#### StatsPage `/admin/estadisticas`
- Dashboard completo
- Usuarios activos
- Crecimiento
- Revenue (futuro)

---

## 🧩 COMPONENTES PRINCIPALES

### Total: ~50 componentes

### Common (10)
- Button
- Input
- Card
- Modal
- Spinner
- Avatar
- Badge
- Pagination
- Dropdown
- Tabs

### Layout (4)
- Header
- Footer
- Sidebar
- Container

### Business (10)
- BusinessCard
- BusinessGrid
- BusinessList
- BusinessDetail
- BusinessGallery
- BusinessMap
- BusinessInfo
- BusinessHours
- BusinessContact
- BusinessStats

### Review (5)
- ReviewCard
- ReviewList
- ReviewForm
- ReviewRating
- ReviewStats

### Search (6)
- SearchBar
- SearchFilters
- CategoryFilter
- PriceRangeFilter
- DistanceFilter
- SortOptions

### Event (3)
- EventCard
- EventList
- EventCalendar

### FAQ (3)
- FaqItem
- FaqList
- FaqForm

### Map (3)
- MapView
- MapMarker
- MapPopup

### Forms (3)
- BusinessForm
- ProfileForm
- ImageUpload

### Auth (4)
- LoginForm
- RegisterForm
- ForgotPasswordForm
- ResetPasswordForm

---

## 🛣️ RUTAS (REACT ROUTER)

### Públicas (sin autenticación)
```typescript
/                          → HomePage
/login                     → LoginPage
/register                  → RegisterPage
/verify/:token             → VerifyEmailPage
/forgot-password           → ForgotPasswordPage
/reset-password/:token     → ResetPasswordPage
/buscar                    → SearchPage
/mapa                      → MapPage
/local/:slug               → BusinessDetailPage
/categoria/:slug           → CategoryPage
/nosotros                  → AboutPage
/contacto                  → ContactPage
```

### Privadas (requieren login)
```typescript
/perfil                    → ProfilePage
/favoritos                 → FavoritesPage
/siguiendo                 → FollowingPage
/mis-resenas               → MyReviewsPage
/configuracion             → SettingsPage
```

### Owner (requieren rol OWNER o ADMIN)
```typescript
/owner/dashboard           → DashboardPage
/owner/negocios            → MyBusinessesPage
/owner/negocios/nuevo      → CreateBusinessPage
/owner/negocios/:id/editar → EditBusinessPage
/owner/resenas             → ReviewsManagePage
/owner/eventos             → EventsManagePage
/owner/faqs                → FaqsManagePage
/owner/estadisticas        → StatsPage
```

### Admin (requieren rol ADMIN)
```typescript
/admin                     → AdminDashboard
/admin/usuarios            → UsersManagePage
/admin/negocios            → BusinessesManagePage
/admin/resenas             → ReviewsModerate
/admin/categorias          → CategoriesPage
/admin/estadisticas        → StatsPage
```

### Configuración de Router
```typescript
// src/routes/AppRoutes.tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import PrivateRoute from './PrivateRoute';
import RoleRoute from './RoleRoute';

<BrowserRouter>
  <Routes>
    {/* Públicas */}
    <Route path="/" element={<HomePage />} />
    <Route path="/login" element={<LoginPage />} />
    {/* ... */}
    
    {/* Privadas */}
    <Route element={<PrivateRoute />}>
      <Route path="/perfil" element={<ProfilePage />} />
      {/* ... */}
    </Route>
    
    {/* Owner */}
    <Route element={<RoleRoute allowedRoles={['OWNER', 'ADMIN']} />}>
      <Route path="/owner/dashboard" element={<DashboardPage />} />
      {/* ... */}
    </Route>
    
    {/* Admin */}
    <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
      <Route path="/admin" element={<AdminDashboard />} />
      {/* ... */}
    </Route>
    
    {/* 404 */}
    <Route path="*" element={<NotFoundPage />} />
  </Routes>
</BrowserRouter>
```

---

## 🔌 SERVICIOS API

### Total: 11 servicios

### authService.ts
```typescript
// Endpoints del backend: /api/auth
- register(data)              → POST /auth/register
- login(email, password)      → POST /auth/login
- logout()                    → POST /auth/logout
- refreshToken()              → POST /auth/refresh
- verifyEmail(token)          → POST /auth/verify-email
- resendVerification(email)   → POST /auth/resend-verification
- forgotPassword(email)       → POST /auth/forgot-password
- resetPassword(token, pass)  → POST /auth/reset-password
```

### userService.ts
```typescript
// Endpoints: /api/user
- getProfile()                → GET /user/profile
- updateProfile(data)         → PUT /user/profile
- changePassword(old, new)    → PUT /user/password
- deleteAccount()             → DELETE /user/account
- getFavorites()              → GET /user/favorites
- addFavorite(businessId)     → POST /user/favorites/:id
- removeFavorite(businessId)  → DELETE /user/favorites/:id
- getFollowing()              → GET /user/following
- followBusiness(businessId)  → POST /user/following/:id
- unfollowBusiness(id)        → DELETE /user/following/:id
- getMyReviews()              → GET /user/reviews
```

### businessService.ts
```typescript
// Endpoints: /api/businesses, /api/public
- getAllBusinesses(filters)   → GET /public/businesses
- getBusinessById(id)         → GET /public/businesses/:id
- getBusinessBySlug(slug)     → GET /public/businesses/slug/:slug
- createBusiness(data)        → POST /businesses
- updateBusiness(id, data)    → PUT /businesses/:id
- deleteBusiness(id)          → DELETE /businesses/:id
- getBusinessReviews(id)      → GET /businesses/:id/reviews
- getBusinessEvents(id)       → GET /businesses/:id/events
- getBusinessFaqs(id)         → GET /businesses/:id/faqs
- getBusinessGallery(id)      → GET /businesses/:id/gallery
```

### reviewService.ts
```typescript
// Endpoints: /api/reviews
- createReview(businessId, data) → POST /reviews
- updateReview(id, data)         → PUT /reviews/:id
- deleteReview(id)               → DELETE /reviews/:id
- addReaction(id, type)          → POST /reviews/:id/reactions
- removeReaction(id)             → DELETE /reviews/:id/reactions
```

### eventService.ts
```typescript
// Endpoints: /api/events
- getEvents()                 → GET /events
- getEventById(id)            → GET /events/:id
- createEvent(data)           → POST /events
- updateEvent(id, data)       → PUT /events/:id
- deleteEvent(id)             → DELETE /events/:id
```

### faqService.ts
```typescript
// Endpoints: /api/faqs
- getFaqs(businessId)         → GET /faqs?businessId=
- createFaq(data)             → POST /faqs
- updateFaq(id, data)         → PUT /faqs/:id
- deleteFaq(id)               → DELETE /faqs/:id
```

### categoryService.ts
```typescript
// Endpoints: /api/categories
- getCategories()             → GET /categories
- getCategoryBySlug(slug)     → GET /categories/:slug
```

### searchService.ts
```typescript
// Endpoints: /api/search
- search(query, filters)      → GET /search?q=...
- autocomplete(query)         → GET /search/autocomplete?q=
```

### uploadService.ts
```typescript
// Endpoints: /api/upload
- uploadAvatar(file)          → POST /upload/avatar
- deleteAvatar()              → DELETE /upload/avatar
- uploadBusinessLogo(id, f)   → POST /upload/business/:id/logo
- uploadBusinessCover(id, f)  → POST /upload/business/:id/cover
- uploadGallery(id, files)    → POST /upload/business/:id/gallery
- deleteImage(publicId)       → DELETE /upload/image/:publicId
```

### ownerService.ts
```typescript
// Endpoints: /api/owner
- getStats()                  → GET /owner/stats
- getMyBusinesses()           → GET /owner/businesses
- getMyReviews()              → GET /owner/reviews
- respondToReview(id, text)   → POST /owner/reviews/:id/respond
```

### adminService.ts
```typescript
// Endpoints: /api/admin
- getStats()                  → GET /admin/stats
- getAllUsers(filters)        → GET /admin/users
- banUser(id, reason)         → PUT /admin/users/:id/ban
- unbanUser(id)               → PUT /admin/users/:id/unban
- changeUserRole(id, role)    → PUT /admin/users/:id/role
- getPendingBusinesses()      → GET /admin/businesses/pending
- approveBusiness(id)         → PUT /admin/businesses/:id/approve
- rejectBusiness(id, reason)  → PUT /admin/businesses/:id/reject
- deleteReview(id)            → DELETE /admin/reviews/:id
- createCategory(data)        → POST /admin/categories
- updateCategory(id, data)    → PUT /admin/categories/:id
- deleteCategory(id)          → DELETE /admin/categories/:id
```

---

## 🌍 CONTEXT/ESTADO GLOBAL

### AuthContext
```typescript
interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

// Uso:
const { user, isAuthenticated, login, logout } = useAuth();
```

### ThemeContext (opcional)
```typescript
interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

### NotificationContext
```typescript
interface NotificationContextType {
  showSuccess: (message: string) => void;
  showError: (message: string) => void;
  showInfo: (message: string) => void;
}

// Uso:
const { showSuccess, showError } = useNotification();
```

---

## 👤 FLUJOS DE USUARIO

### 1. Flujo de Registro y Verificación
```
Usuario entra → /register
  ↓
Llena formulario (name, email, password, role)
  ↓
Submit → POST /api/auth/register
  ↓
Mensaje: "Verifica tu email"
  ↓
Usuario revisa email
  ↓
Click en link → /verify/:token
  ↓
POST /api/auth/verify-email {token}
  ↓
Redirect → /login
  ↓
Usuario hace login
```

### 2. Flujo de Login
```
Usuario entra → /login
  ↓
Ingresa email y password
  ↓
Submit → POST /api/auth/login
  ↓
Recibe accessToken y refreshToken
  ↓
Guarda tokens en localStorage/cookies
  ↓
Guarda user en AuthContext
  ↓
Redirect según rol:
  - USER → /perfil
  - OWNER → /owner/dashboard
  - ADMIN → /admin
```

### 3. Flujo de Búsqueda
```
Usuario en HomePage
  ↓
Escribe en SearchBar
  ↓
Debounce 300ms
  ↓
GET /api/search/autocomplete?q=texto
  ↓
Muestra sugerencias
  ↓
Usuario selecciona o presiona Enter
  ↓
Redirect → /buscar?q=texto
  ↓
GET /api/search?q=texto&filters=...
  ↓
Muestra resultados en grid/list
  ↓
Usuario aplica filtros
  ↓
Re-fetch con nuevos filtros
```

### 4. Flujo de Ver Negocio
```
Usuario en /buscar
  ↓
Click en BusinessCard
  ↓
Redirect → /local/:slug
  ↓
GET /api/public/businesses/slug/:slug
  ↓
Muestra:
  - Info del negocio
  - Galería
  - Mapa
  - Reviews
  - FAQs
  - Eventos
  ↓
Si está autenticado:
  - Botón Favorito
  - Botón Seguir
  - Escribir reseña
```

### 5. Flujo de Crear Negocio (Owner)
```
Owner en /owner/dashboard
  ↓
Click "Crear Negocio"
  ↓
Redirect → /owner/negocios/nuevo
  ↓
Formulario multi-step:
  1. Info básica (nombre, categoría, descripción)
  2. Ubicación (dirección, mapa)
  3. Contacto (teléfono, email, botones)
  4. Horarios
  5. Media (logo, cover)
  ↓
Submit → POST /api/businesses
  ↓
Negocio creado con status: "pending"
  ↓
Redirect → /owner/negocios
  ↓
Mensaje: "Tu negocio está pendiente de aprobación"
  ↓
Admin recibe notificación
  ↓
Admin aprueba/rechaza
  ↓
Owner recibe email
```

### 6. Flujo de Reseña
```
Usuario autenticado en /local/:slug
  ↓
Scroll a sección de reviews
  ↓
Click "Escribir reseña"
  ↓
Modal/Form con:
  - Rating (1-5 estrellas)
  - Título
  - Contenido
  ↓
Submit → POST /api/reviews
  ↓
Reseña aparece en la lista
  ↓
Owner recibe notificación
  ↓
Owner puede responder
```

---

## 🔗 MAPEO BACKEND-FRONTEND

### Endpoints Públicos (70 total)

| Backend Endpoint | Frontend Service | Usado en Página/Componente |
|------------------|------------------|----------------------------|
| **AUTH (8)** | | |
| POST /auth/register | authService.register() | RegisterPage |
| POST /auth/login | authService.login() | LoginPage |
| POST /auth/logout | authService.logout() | Header (botón logout) |
| POST /auth/refresh | authService.refreshToken() | Axios interceptor |
| POST /auth/verify-email | authService.verifyEmail() | VerifyEmailPage |
| POST /auth/resend-verification | authService.resendVerification() | LoginPage |
| POST /auth/forgot-password | authService.forgotPassword() | ForgotPasswordPage |
| POST /auth/reset-password | authService.resetPassword() | ResetPasswordPage |
| **USER (11)** | | |
| GET /user/profile | userService.getProfile() | ProfilePage |
| PUT /user/profile | userService.updateProfile() | ProfilePage |
| PUT /user/password | userService.changePassword() | SettingsPage |
| DELETE /user/account | userService.deleteAccount() | SettingsPage |
| GET /user/favorites | userService.getFavorites() | FavoritesPage |
| POST /user/favorites/:id | userService.addFavorite() | BusinessDetailPage |
| DELETE /user/favorites/:id | userService.removeFavorite() | FavoritesPage |
| GET /user/following | userService.getFollowing() | FollowingPage |
| POST /user/following/:id | userService.followBusiness() | BusinessDetailPage |
| DELETE /user/following/:id | userService.unfollowBusiness() | FollowingPage |
| GET /user/reviews | userService.getMyReviews() | MyReviewsPage |
| **BUSINESS (13)** | | |
| GET /public/businesses | businessService.getAll() | HomePage, SearchPage |
| GET /public/businesses/:id | businessService.getById() | - |
| GET /public/businesses/slug/:slug | businessService.getBySlug() | BusinessDetailPage |
| GET /public/featured | businessService.getFeatured() | HomePage |
| GET /public/nearby | businessService.getNearby() | MapPage |
| POST /businesses | businessService.create() | CreateBusinessPage |
| PUT /businesses/:id | businessService.update() | EditBusinessPage |
| DELETE /businesses/:id | businessService.delete() | MyBusinessesPage |
| GET /businesses/:id/reviews | businessService.getReviews() | BusinessDetailPage |
| GET /businesses/:id/events | businessService.getEvents() | BusinessDetailPage |
| GET /businesses/:id/faqs | businessService.getFaqs() | BusinessDetailPage |
| GET /businesses/:id/gallery | businessService.getGallery() | BusinessDetailPage |
| GET /businesses/:id/stats | businessService.getStats() | EditBusinessPage |
| **REVIEW (5)** | | |
| POST /reviews | reviewService.create() | BusinessDetailPage |
| PUT /reviews/:id | reviewService.update() | MyReviewsPage |
| DELETE /reviews/:id | reviewService.delete() | MyReviewsPage |
| POST /reviews/:id/reactions | reviewService.addReaction() | ReviewCard |
| DELETE /reviews/:id/reactions | reviewService.removeReaction() | ReviewCard |
| **EVENT (5)** | | |
| GET /events | eventService.getAll() | HomePage |
| GET /events/:id | eventService.getById() | EventDetailPage |
| POST /events | eventService.create() | EventsManagePage |
| PUT /events/:id | eventService.update() | EventsManagePage |
| DELETE /events/:id | eventService.delete() | EventsManagePage |
| **FAQ (4)** | | |
| GET /faqs | faqService.getAll() | BusinessDetailPage |
| POST /faqs | faqService.create() | FaqsManagePage |
| PUT /faqs/:id | faqService.update() | FaqsManagePage |
| DELETE /faqs/:id | faqService.delete() | FaqsManagePage |
| **CATEGORY (2)** | | |
| GET /categories | categoryService.getAll() | HomePage, SearchFilters |
| GET /categories/:slug | categoryService.getBySlug() | CategoryPage |
| **SEARCH (2)** | | |
| GET /search | searchService.search() | SearchPage |
| GET /search/autocomplete | searchService.autocomplete() | SearchBar |
| **UPLOAD (6)** | | |
| POST /upload/avatar | uploadService.uploadAvatar() | ProfilePage |
| DELETE /upload/avatar | uploadService.deleteAvatar() | ProfilePage |
| POST /upload/business/:id/logo | uploadService.uploadLogo() | EditBusinessPage |
| POST /upload/business/:id/cover | uploadService.uploadCover() | EditBusinessPage |
| POST /upload/business/:id/gallery | uploadService.uploadGallery() | EditBusinessPage |
| DELETE /upload/image/:publicId | uploadService.deleteImage() | EditBusinessPage |
| **OWNER (4)** | | |
| GET /owner/stats | ownerService.getStats() | DashboardPage |
| GET /owner/businesses | ownerService.getMyBusinesses() | MyBusinessesPage |
| GET /owner/reviews | ownerService.getMyReviews() | ReviewsManagePage |
| POST /owner/reviews/:id/respond | ownerService.respond() | ReviewsManagePage |
| **ADMIN (10)** | | |
| GET /admin/stats | adminService.getStats() | AdminDashboard |
| GET /admin/users | adminService.getAllUsers() | UsersManagePage |
| PUT /admin/users/:id/ban | adminService.banUser() | UsersManagePage |
| PUT /admin/users/:id/unban | adminService.unbanUser() | UsersManagePage |
| PUT /admin/users/:id/role | adminService.changeRole() | UsersManagePage |
| GET /admin/businesses/pending | adminService.getPending() | BusinessesManagePage |
| PUT /admin/businesses/:id/approve | adminService.approve() | BusinessesManagePage |
| PUT /admin/businesses/:id/reject | adminService.reject() | BusinessesManagePage |
| DELETE /admin/reviews/:id | adminService.deleteReview() | ReviewsModerate |
| POST /admin/categories | adminService.createCategory() | CategoriesPage |

---

## 📦 DEPENDENCIAS RECOMENDADAS

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.20.0",
    "axios": "^1.6.2",
    "react-hook-form": "^7.49.2",
    "zod": "^3.22.4",
    "@hookform/resolvers": "^3.3.2",
    "leaflet": "^1.9.4",
    "react-leaflet": "^4.2.1",
    "date-fns": "^3.0.0",
    "clsx": "^2.0.0",
    "lucide-react": "^0.294.0",
    "react-hot-toast": "^2.4.1",
    "@tanstack/react-query": "^5.12.2"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/leaflet": "^1.9.8",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.3.3",
    "vite": "^5.0.7",
    "tailwindcss": "^3.3.6",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32"
  }
}
```

---

## 🚀 PLAN DE IMPLEMENTACIÓN

### Fase 1: Setup y Core (Semana 1)
- ✅ Instalar dependencias
- ✅ Configurar Vite + TypeScript + Tailwind
- ✅ Estructura de carpetas
- ✅ Configurar Axios instance
- ✅ Crear tipos TypeScript base
- ✅ Context: AuthContext
- ✅ Servicios: authService, userService
- ✅ Rutas: AppRoutes, PrivateRoute, RoleRoute
- ✅ Layout: Header, Footer, Container

### Fase 2: Autenticación (Semana 1-2)
- ✅ LoginPage + LoginForm
- ✅ RegisterPage + RegisterForm
- ✅ ForgotPasswordPage
- ✅ ResetPasswordPage
- ✅ VerifyEmailPage
- ✅ Lógica de auth completa
- ✅ Interceptores de Axios
- ✅ Manejo de tokens

### Fase 3: Páginas Públicas (Semana 2-3)
- ✅ HomePage con hero y categorías
- ✅ SearchPage con filtros
- ✅ BusinessDetailPage completa
- ✅ MapPage con Leaflet
- ✅ CategoryPage
- ✅ Componentes: BusinessCard, BusinessGrid, SearchBar

### Fase 4: Sistema de Reviews (Semana 3)
- ✅ ReviewCard component
- ✅ ReviewList component
- ✅ ReviewForm component
- ✅ ReviewRating component
- ✅ Integración en BusinessDetailPage
- ✅ MyReviewsPage

### Fase 5: Panel de Usuario (Semana 4)
- ✅ ProfilePage
- ✅ FavoritesPage
- ✅ FollowingPage
- ✅ SettingsPage
- ✅ ImageUpload component

### Fase 6: Panel de Owner (Semana 5)
- ✅ DashboardPage
- ✅ MyBusinessesPage
- ✅ CreateBusinessPage (form multi-step)
- ✅ EditBusinessPage
- ✅ ReviewsManagePage
- ✅ EventsManagePage
- ✅ FaqsManagePage

### Fase 7: Panel de Admin (Semana 6)
- ✅ AdminDashboard
- ✅ UsersManagePage
- ✅ BusinessesManagePage
- ✅ ReviewsModerate
- ✅ CategoriesPage
- ✅ Estadísticas

### Fase 8: Optimizaciones (Semana 7)
- ✅ React Query para cache
- ✅ Lazy loading de componentes
- ✅ Infinite scroll
- ✅ Optimización de imágenes
- ✅ SEO básico
- ✅ Responsive design refinado
- ✅ Animaciones con Framer Motion

### Fase 9: Testing (Semana 8)
- ✅ Tests unitarios de componentes
- ✅ Tests de integración
- ✅ E2E testing
- ✅ Fixing de bugs

---

## 📊 RESUMEN DE ALCANCE

### Páginas: 29
- Públicas: 7
- Auth: 5
- Usuario: 5
- Owner: 8
- Admin: 4

### Componentes: ~50
- Common: 10
- Layout: 4
- Business: 10
- Review: 5
- Search: 6
- Event: 3
- FAQ: 3
- Map: 3
- Forms: 3
- Auth: 4

### Servicios API: 11
- authService
- userService
- businessService
- reviewService
- eventService
- faqService
- categoryService
- searchService
- uploadService
- ownerService
- adminService

### Contexts: 3
- AuthContext
- ThemeContext
- NotificationContext

### Rutas: ~35
- Públicas: 12
- Privadas: 5
- Owner: 8
- Admin: 6
- Errors: 3

---

## 🎯 PRÓXIMOS PASOS

1. **Configurar entorno**
   ```bash
   cd frontend
   npm install
   ```

2. **Crear archivo .env**
   ```env
   VITE_API_URL=http://localhost:3000/api
   VITE_CLOUDINARY_CLOUD_NAME=dajkds7bt
   ```

3. **Configurar Tailwind CSS**
   ```bash
   npm install -D tailwindcss postcss autoprefixer
   npx tailwindcss init -p
   ```

4. **Empezar con Fase 1: Setup y Core**
   - Crear estructura de carpetas
   - Configurar Axios
   - Crear tipos base
   - AuthContext
   - Layout básico

5. **Iterar por fases**
   - Completar cada fase antes de pasar a la siguiente
   - Probar cada funcionalidad
   - Commit frecuentes

---

## 📝 NOTAS FINALES

- Este plan cubre el **100% de la funcionalidad del backend**
- Todas las 70 endpoints están mapeados
- La arquitectura es escalable y profesional
- Se puede empezar inmediatamente
- Tiempo estimado: **8 semanas** (trabajo constante)
- Cada fase tiene entregables claros

**¿Listo para empezar? 🚀**
