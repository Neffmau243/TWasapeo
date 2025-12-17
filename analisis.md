# Análisis Detallado del Proyecto - LOCALES

## 📋 Información General

**Nombre del Proyecto:** Asistencia requerida (LOCALES)  
**Tipo:** Aplicación web de directorio de negocios locales  
**Framework:** React 18.3.1 con Vite 6.3.5  
**Lenguaje:** TypeScript + React (TSX)  
**Origen:** Diseño de Figma convertido a código

---

## 🎨 Sistema de Diseño y Estética

### Paleta de Colores

El proyecto utiliza un sistema de colores basado en variables CSS RGB con soporte para modo claro y oscuro:

#### Modo Claro (Light Mode)
- **Background:** `rgb(250, 249, 246)` - Beige muy claro, cálido
- **Foreground:** `rgb(28, 25, 23)` - Marrón oscuro casi negro
- **Card:** `rgb(255, 254, 252)` - Blanco cremoso
- **Border:** `rgb(231, 229, 228)` - Gris beige claro
- **Muted:** `rgb(245, 243, 240)` - Beige claro
- **Muted Foreground:** `rgb(120, 113, 108)` - Gris marrón medio
- **Accent:** `rgb(245, 243, 240)` - Beige claro

#### Modo Oscuro (Dark Mode)
- **Background:** `rgb(12, 10, 9)` - Negro profundo
- **Foreground:** `rgb(250, 249, 246)` - Beige muy claro
- **Card:** `rgb(23, 23, 23)` - Gris muy oscuro
- **Border:** `rgb(38, 38, 38)` - Gris oscuro
- **Muted:** `rgb(28, 25, 23)` - Marrón muy oscuro
- **Muted Foreground:** `rgb(168, 162, 158)` - Gris cálido
- **Accent:** `rgb(38, 38, 38)` - Gris oscuro

#### Colores de Estado (Badges y Notificaciones)
- **Amber:** Para badges "Popular" - `oklch(.962 .059 95.617)` a `oklch(.414 .112 45.904)`
- **Green:** Para badges "Verificado" y estados abiertos - `oklch(.962 .044 156.743)` a `oklch(.393 .095 152.535)`
- **Blue:** Para badges "Nuevo" - `oklch(.932 .032 255.585)` a `oklch(.379 .146 265.522)`
- **Red:** Para estados cerrados - `oklch(.704 .191 22.216)` a `oklch(.577 .245 27.325)`
- **Orange:** Para "Cierra pronto" - `oklch(.75 .183 55.934)` a `oklch(.646 .222 41.116)`

### Tipografía

**Fuentes Principales:**
- **Títulos (h1-h6):** `Playfair Display` - Serif elegante y clásica
- **Cuerpo de texto:** `Cormorant Garamond` - Serif refinada y legible
- **Fallback:** Georgia, serif

**Tamaños de Texto:**
- `text-xs`: 0.75rem (12px)
- `text-sm`: 0.875rem (14px)
- `text-base`: 1rem (16px) - por defecto
- `text-lg`: 1.125rem (18px)
- `text-xl`: 1.25rem (20px)
- `text-2xl`: 1.5rem (24px)
- `text-3xl`: 1.875rem (30px)
- `text-4xl`: 2.25rem (36px)
- `text-5xl`: 3rem (48px)
- `text-6xl`: 3.75rem (60px)
- `text-7xl`: 4.5rem (72px)

**Características Tipográficas:**
- `tracking-wide`: 0.025em - Espaciado amplio
- `tracking-wider`: 0.05em - Espaciado más amplio
- `leading-relaxed`: 1.625 - Interlineado relajado

### Espaciado

Sistema basado en múltiplos de `0.25rem` (4px):
- Unidad base: `--spacing: 0.25rem`
- Espaciados comunes: 1, 2, 3, 4, 6, 8, 10, 12, 16, 20, 24

### Iconografía

**Biblioteca:** Lucide React v0.487.0

**Iconos Utilizados:**
- **Navegación:** Moon, Sun, User, Menu, X, ChevronLeft, ChevronRight, Globe
- **Negocios:** Star, MapPin, Clock, Phone, Mail, Globe, Award, Sparkles, TrendingUp
- **Categorías:** Utensils, Coffee, ShoppingBag, Dumbbell, Cake
- **Acciones:** Heart, Share2, Bell, ThumbsUp, ThumbsDown, Search
- **Comunicación:** MessageCircle, MessageSquare, Send
- **Redes Sociales:** Facebook, Instagram, Twitter
- **UI:** Calendar, Target, Eye, SlidersHorizontal

---

## 🏗️ Arquitectura del Proyecto

### Estructura de Carpetas

```
src/
├── components/
│   ├── business/          # Componentes específicos de detalle de negocio
│   ├── figma/            # Componentes de utilidad de Figma
│   ├── home/             # Componentes de la página principal
│   ├── pages/            # Páginas completas (About, Contact)
│   └── ui/               # Componentes UI reutilizables (shadcn/ui)
├── i18n/                 # Internacionalización
├── styles/               # Estilos globales
└── guidelines/           # Documentación de guías
```

---

## 📱 Vistas y Páginas

### 1. Vista Principal (Home)

**Componentes:**
- **Hero Section:** Título principal, subtítulo y barra de búsqueda con autocompletado
- **Categories Section:** Grid de 6 categorías principales con iconos
- **Featured Businesses:** Carrusel de negocios destacados
- **Business Grid:** Grid responsivo de tarjetas de negocios con filtros laterales
- **Recent Reviews:** Sección de reseñas recientes

**Características:**
- Búsqueda con autocompletado en tiempo real
- Filtros avanzados (categoría, precio, calificación, estado abierto/cerrado)
- Ordenamiento múltiple (popularidad, calificación, reciente, nombre)
- Animaciones de scroll y aparición progresiva
- Diseño responsivo (1, 2, 3 columnas según viewport)

### 2. Vista de Detalle de Negocio

**Secciones:**
- **Galería de Fotos:** Grid de imágenes con modal de vista completa
- **Breadcrumbs:** Navegación jerárquica
- **Header:** Nombre, categoría, calificación y badges
- **Descripción:** Texto completo sobre el negocio
- **Amenidades:** Grid de servicios y comodidades
- **Mapa:** Ubicación con enlace a Google Maps
- **Reseñas:** Lista de reseñas con reacciones
- **Sidebar:** Información de contacto sticky
- **Negocios Similares:** Carrusel de recomendaciones

**Características:**
- Galería de imágenes interactiva (hasta 5+ fotos)
- Modal de imagen en pantalla completa
- Información de contacto completa (teléfono, email, sitio web, WhatsApp, Messenger)
- Sistema de badges (Popular, Nuevo, Verificado)
- Estados de apertura en tiempo real

### 3. Página "Sobre Nosotros" (About)

**Contenido:**
- Misión de la empresa
- Visión corporativa
- Valores fundamentales
- Iconos representativos (Target, Eye, Award)

### 4. Página de Contacto

**Elementos:**
- Formulario de contacto (nombre, email, mensaje)
- Información de contacto de la empresa
- Iconos de ubicación, teléfono, email, horario

---

## 🧩 Componentes Principales

### Componentes de Navegación

#### Navbar
- Logo clickeable
- Menú de navegación (Inicio, Sobre Nosotros, Contacto)
- Selector de idioma (4 idiomas)
- Toggle de tema claro/oscuro
- Botón de login
- Menú hamburguesa responsive
- Auto-hide al hacer scroll hacia abajo
- Sticky positioning

#### Footer
- Información de marca
- Enlaces de navegación
- Información de contacto
- Redes sociales (Facebook, Instagram, Twitter)
- Copyright

#### Breadcrumbs
- Navegación jerárquica
- Separadores con ChevronRight
- Items clickeables

### Componentes de Negocio

#### BusinessCard
- Imagen con aspect ratio 4:3
- Badges de estado (Popular, Nuevo, Verificado)
- Nombre y categoría
- Calificación con estrellas
- Estado de apertura (Abierto/Cerrado/Cierra pronto)
- Descripción truncada (2 líneas)
- Ubicación y horario
- Contador de reseñas
- Botón "Dejar Reseña"
- Animación de hover (scale 105%)
- Lazy loading con Intersection Observer

#### BusinessDetail
- Galería de fotos completa
- Información completa del negocio
- Sistema de reseñas
- Mapa de ubicación
- Sidebar de contacto sticky
- Sección de negocios similares

#### BusinessActions
- Botón de favorito (corazón)
- Botón de compartir
- Botón de seguir/notificaciones

#### ContactButtons
- Botón de WhatsApp
- Botón de Messenger
- Botón de llamada telefónica

#### EventsSlider
- Carrusel de eventos
- Modal de detalle de evento
- Navegación con flechas

#### FAQSection
- Acordeón de preguntas frecuentes
- Expandible/colapsable

#### RatingDistribution
- Gráfico de distribución de calificaciones
- Barras de progreso por estrella

#### ReviewWithReactions
- Reseña con información del usuario
- Sistema de likes/dislikes
- Fecha y calificación

### Componentes de Búsqueda y Filtros

#### SearchWithAutocomplete
- Input de búsqueda con icono
- Dropdown de sugerencias
- Diferenciación entre negocios y categorías
- Click fuera para cerrar
- Botón de limpiar búsqueda

#### Filters
- Panel de filtros lateral (desktop) / modal (mobile)
- Ordenamiento (4 opciones)
- Filtro por categorías (checkboxes múltiples)
- Filtro por rango de precio (radio buttons)
- Filtro por calificación mínima
- Toggle "Abierto Ahora"
- Contador de filtros activos
- Botón de limpiar filtros

### Componentes de Home

#### CategoriesSection
- Grid de 6 categorías
- Iconos personalizados por categoría
- Contador de negocios por categoría
- Hover effects

#### FeaturedBusinesses
- Carrusel de negocios destacados
- Diseño especial para destacados

#### RecentReviews
- Lista de reseñas recientes
- Enlace al negocio correspondiente
- Información del usuario y fecha

### Componentes de Autenticación

#### LoginModal
- Modal centrado con overlay
- Campos de email y contraseña
- Botón de login
- Enlace a registro
- Botón de cerrar

#### RegisterModal
- Modal de registro
- Campos de nombre, email, contraseña
- Botón de registro
- Enlace a login
- Botón de cerrar

### Componentes UI (shadcn/ui)

El proyecto incluye una biblioteca completa de componentes UI de shadcn/ui:

- **accordion** - Acordeones expandibles
- **alert-dialog** - Diálogos de alerta
- **alert** - Alertas de notificación
- **aspect-ratio** - Control de proporciones
- **avatar** - Avatares de usuario
- **badge** - Badges y etiquetas
- **breadcrumb** - Migas de pan
- **button** - Botones
- **calendar** - Calendario
- **card** - Tarjetas
- **carousel** - Carruseles
- **chart** - Gráficos
- **checkbox** - Checkboxes
- **collapsible** - Elementos colapsables
- **command** - Paleta de comandos
- **context-menu** - Menús contextuales
- **dialog** - Diálogos modales
- **drawer** - Cajones laterales
- **dropdown-menu** - Menús desplegables
- **form** - Formularios
- **hover-card** - Tarjetas hover
- **input-otp** - Input de OTP
- **input** - Inputs de texto
- **label** - Etiquetas
- **menubar** - Barra de menú
- **navigation-menu** - Menú de navegación
- **pagination** - Paginación
- **popover** - Popovers
- **progress** - Barras de progreso
- **radio-group** - Grupos de radio buttons
- **resizable** - Paneles redimensionables
- **scroll-area** - Áreas de scroll
- **select** - Selectores
- **separator** - Separadores
- **sheet** - Hojas laterales
- **sidebar** - Barras laterales
- **skeleton** - Skeletons de carga
- **slider** - Sliders
- **sonner** - Notificaciones toast
- **switch** - Switches
- **table** - Tablas
- **tabs** - Pestañas
- **textarea** - Áreas de texto
- **toggle-group** - Grupos de toggles
- **toggle** - Toggles
- **tooltip** - Tooltips

### Componentes Utilitarios

#### ScrollProgress
- Barra de progreso de scroll
- Fixed en la parte superior
- Animación suave

#### LanguageSelector
- Dropdown de selección de idioma
- 4 idiomas soportados (ES, EN, FR, DE)
- Icono de globo
- Click fuera para cerrar

#### ImageWithFallback
- Componente de imagen con fallback
- Manejo de errores de carga

---

## 🌍 Internacionalización (i18n)

### Idiomas Soportados
1. **Español (es)** - Idioma por defecto
2. **Inglés (en)**
3. **Francés (fr)**
4. **Alemán (de)**

### Áreas Traducidas
- Navegación completa
- Hero section
- Filtros y ordenamiento
- Información de negocios
- Estados de apertura
- Páginas About y Contact
- Footer

### Sistema de Traducciones
- Archivo centralizado: `src/i18n/translations.ts`
- Type-safe con TypeScript
- Estructura jerárquica por secciones
- Fácil extensión a nuevos idiomas

---

## 💾 Datos y Modelos

### Modelo de Negocio (Business)

```typescript
interface Business {
  id: number;
  name: string;
  category: string;
  image: string;
  rating: number;
  reviewCount: number;
  location: string;
  description: string;
  hours: string;
  phone?: string;
  email?: string;
  website?: string;
  whatsapp?: string;
  messenger?: string;
  fullDescription?: string;
  amenities?: string[];
  gallery?: string[];
  coordinates?: { lat: number; lng: number };
  badges?: string[];
  isOpen?: boolean;
  openStatus?: string;
  priceRange?: string;
}
```

### Negocios de Ejemplo (6 negocios mock)

1. **La Maison** - Restaurante de alta cocina (⭐ 4.8, 127 reseñas)
2. **Café Moderne** - Cafetería de especialidad (⭐ 4.6, 89 reseñas)
3. **Boutique Élégance** - Tienda de ropa (⭐ 4.9, 156 reseñas)
4. **Serenity Spa** - Spa & Wellness (⭐ 5.0, 203 reseñas)
5. **FitLife Gym** - Gimnasio (⭐ 4.7, 94 reseñas)
6. **Panadería Artesanal** - Panadería (⭐ 4.9, 178 reseñas)

### Categorías Disponibles
- Restaurante
- Cafetería
- Tienda de Ropa
- Spa & Wellness
- Gimnasio
- Panadería

### Rangos de Precio
- `$` - Económico
- `$$` - Moderado
- `$$$` - Elevado
- `$$$$` - Premium

---

## ⚡ Funcionalidades Principales

### 1. Sistema de Búsqueda
- Búsqueda en tiempo real
- Autocompletado inteligente
- Búsqueda por nombre, categoría y ubicación
- Sugerencias diferenciadas (negocios vs categorías)

### 2. Sistema de Filtros
- Filtro por múltiples categorías
- Filtro por rango de precio
- Filtro por calificación mínima
- Filtro por estado de apertura
- 4 opciones de ordenamiento
- Contador de filtros activos
- Limpieza rápida de filtros

### 3. Sistema de Calificaciones
- Calificación de 0 a 5 estrellas
- Contador de reseñas
- Distribución de calificaciones
- Reseñas con reacciones (likes/dislikes)

### 4. Estados de Apertura
- Abierto ahora (verde)
- Cierra pronto (naranja)
- Cerrado (rojo)
- Lógica mock basada en horarios

### 5. Sistema de Badges
- **Popular:** Negocios con muchas reseñas
- **Nuevo:** Negocios recientes
- **Verificado:** Negocios verificados
- Colores diferenciados por tipo

### 6. Galería de Imágenes
- Grid responsivo de fotos
- Modal de vista completa
- Indicador de fotos adicionales (+N)
- Navegación entre imágenes

### 7. Navegación
- Scroll suave entre secciones
- Navbar auto-hide al scroll
- Breadcrumbs en páginas de detalle
- Botón "Volver" en detalles

### 8. Tema Claro/Oscuro
- Toggle en navbar
- Persistencia de preferencia
- Transiciones suaves
- Colores optimizados para ambos modos

### 9. Responsive Design
- Mobile-first approach
- Breakpoints: sm (40rem), md (48rem), lg (64rem)
- Menú hamburguesa en mobile
- Grid adaptativo (1-3 columnas)
- Filtros en modal para mobile

### 10. Animaciones
- Hover effects en tarjetas
- Scale en imágenes
- Fade in con Intersection Observer
- Transiciones de color
- Animaciones de scroll

---

## 🔧 Tecnologías y Dependencias

### Core
- **React:** 18.3.1
- **React DOM:** 18.3.1
- **TypeScript:** Implícito en .tsx
- **Vite:** 6.3.5

### UI Components (Radix UI)
- @radix-ui/react-accordion: ^1.2.3
- @radix-ui/react-alert-dialog: ^1.1.6
- @radix-ui/react-aspect-ratio: ^1.1.2
- @radix-ui/react-avatar: ^1.1.3
- @radix-ui/react-checkbox: ^1.1.4
- @radix-ui/react-collapsible: ^1.1.3
- @radix-ui/react-context-menu: ^2.2.6
- @radix-ui/react-dialog: ^1.1.6
- @radix-ui/react-dropdown-menu: ^2.1.6
- @radix-ui/react-hover-card: ^1.1.6
- @radix-ui/react-label: ^2.1.2
- @radix-ui/react-menubar: ^1.1.6
- @radix-ui/react-navigation-menu: ^1.2.5
- @radix-ui/react-popover: ^1.1.6
- @radix-ui/react-progress: ^1.1.2
- @radix-ui/react-radio-group: ^1.2.3
- @radix-ui/react-scroll-area: ^1.2.3
- @radix-ui/react-select: ^2.1.6
- @radix-ui/react-separator: ^1.1.2
- @radix-ui/react-slider: ^1.2.3
- @radix-ui/react-slot: ^1.1.2
- @radix-ui/react-switch: ^1.1.3
- @radix-ui/react-tabs: ^1.1.3
- @radix-ui/react-toggle: ^1.1.2
- @radix-ui/react-toggle-group: ^1.1.2
- @radix-ui/react-tooltip: ^1.1.8

### Styling
- **Tailwind CSS:** * (última versión)
- **class-variance-authority:** ^0.7.1
- **clsx:** *
- **tailwind-merge:** *

### Utilities
- **lucide-react:** ^0.487.0 (iconos)
- **cmdk:** ^1.1.1 (command palette)
- **embla-carousel-react:** ^8.6.0 (carruseles)
- **input-otp:** ^1.4.2 (OTP inputs)
- **next-themes:** ^0.4.6 (tema claro/oscuro)
- **react-day-picker:** ^8.10.1 (calendario)
- **react-hook-form:** ^7.55.0 (formularios)
- **react-resizable-panels:** ^2.1.7 (paneles)
- **recharts:** ^2.15.2 (gráficos)
- **sonner:** ^2.0.3 (toasts)
- **vaul:** ^1.1.2 (drawer)

### Dev Dependencies
- **@types/node:** ^20.10.0
- **@vitejs/plugin-react-swc:** ^3.10.2

---

## 🎯 Características de UX/UI

### Accesibilidad
- Labels semánticos
- ARIA labels en botones de acción
- Contraste de colores optimizado
- Navegación por teclado
- Focus states visibles

### Performance
- Lazy loading de imágenes
- Intersection Observer para animaciones
- Debounce en scroll events
- Componentes optimizados
- Code splitting con Vite

### Interactividad
- Hover states en todos los elementos clickeables
- Feedback visual inmediato
- Transiciones suaves (150ms-500ms)
- Estados de carga
- Mensajes de error/éxito

### Diseño Visual
- Estética minimalista y elegante
- Espaciado generoso
- Tipografía serif clásica
- Paleta de colores cálida
- Bordes sutiles
- Sombras suaves

---

## 📝 Notas Adicionales

### Imágenes
- Todas las imágenes provienen de Unsplash
- URLs optimizadas con parámetros de Unsplash
- Aspect ratios consistentes (4:3, 16:10, 3:4)

### Estado de Desarrollo
- Proyecto funcional con datos mock
- Listo para integración con backend
- Modales de login/registro sin funcionalidad real
- Mapas con placeholder (requiere API key de Google Maps)

### Próximos Pasos Sugeridos
1. Integración con API backend
2. Sistema de autenticación real
3. Base de datos de negocios
4. Sistema de reseñas funcional
5. Integración de mapas real
6. Sistema de favoritos persistente
7. Notificaciones push
8. Panel de administración
9. Analytics y métricas
10. SEO optimization

---

## 🎨 Filosofía de Diseño

El proyecto sigue una estética **elegante, minimalista y sofisticada** inspirada en directorios premium de negocios. La combinación de:

- **Tipografía serif clásica** (Playfair Display + Cormorant Garamond)
- **Paleta de colores cálida** (beiges, marrones, cremas)
- **Espaciado generoso** y diseño limpio
- **Animaciones sutiles** y transiciones suaves
- **Iconografía consistente** (Lucide React)

Crea una experiencia visual que transmite **confianza, calidad y profesionalismo**, perfecta para un directorio de negocios locales de alta gama.

---

**Fecha de Análisis:** Diciembre 2024  
**Versión del Proyecto:** 0.1.0
