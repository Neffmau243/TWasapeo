# Frontend - Locales

Frontend SPA para la plataforma de negocios locales.

## Stack Tecnológico

- **React** 18
- **Vite** (Build tool)
- **TypeScript**
- **React Router** (Navegación)
- **Tailwind CSS** (Estilos)
- **React Query** (Gestión de estado servidor)
- **Zustand** (Gestión de estado cliente)
- **React Hook Form** + **Zod** (Formularios y validación)
- **Leaflet** (Mapas)

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales
```

## Desarrollo

```bash
# Modo desarrollo
npm run dev

# Build para producción
npm run build

# Preview del build
npm run preview
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo (puerto 5173)
- `npm run build` - Build de producción
- `npm run preview` - Preview del build
- `npm run lint` - Linter
- `npm run format` - Formatear código

## Estructura de Carpetas

```
src/
├── components/     # Componentes React
│   ├── common/     # Componentes compartidos
│   ├── auth/       # Autenticación
│   ├── business/   # Negocios
│   ├── home/       # Homepage
│   └── ui/         # Componentes UI base
├── pages/          # Páginas (rutas)
├── context/        # Context API
├── hooks/          # Custom hooks
├── services/       # API calls
├── utils/          # Utilidades
├── types/          # TypeScript types
└── styles/         # Estilos globales
```

## Características

- ✅ Autenticación con JWT
- ✅ Listado y detalle de negocios
- ✅ Sistema de reseñas
- ✅ Búsqueda y filtros
- ✅ Mapas interactivos
- ✅ Panel de usuario
- ✅ Panel de owner
- ✅ Panel de administración
- ✅ Diseño responsive
- ✅ Dark mode (opcional)

## Variables de Entorno

Ver archivo `.env.example` para la lista completa de variables requeridas.

## Licencia

ISC
