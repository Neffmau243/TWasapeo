# Backend - Locales API

API REST para la plataforma de negocios locales.

## Stack Tecnológico

- **Node.js** + **Express** + **TypeScript**
- **Prisma** (ORM)
- **PostgreSQL** (Base de datos)
- **JWT** (Autenticación)
- **Cloudinary** (Almacenamiento de imágenes)

## Instalación

```bash
# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales

# Generar cliente Prisma
npm run prisma:generate

# Ejecutar migraciones
npm run prisma:migrate

# Seed de datos iniciales
npm run prisma:seed
```

## Desarrollo

```bash
# Modo desarrollo con hot reload
npm run dev

# Build para producción
npm run build

# Iniciar en producción
npm start
```

## Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Compilar TypeScript
- `npm start` - Servidor de producción
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:migrate` - Ejecutar migraciones
- `npm run prisma:studio` - Abrir Prisma Studio
- `npm run prisma:seed` - Poblar base de datos
- `npm test` - Ejecutar tests
- `npm run lint` - Linter
- `npm run format` - Formatear código

## Estructura de Carpetas

```
src/
├── config/         # Configuraciones (DB, JWT, Cloudinary)
├── middleware/     # Middlewares (auth, validation, etc)
├── routes/         # Definición de rutas
├── controllers/    # Lógica de negocio
├── services/       # Servicios externos
├── utils/          # Utilidades
├── types/          # TypeScript types
├── templates/      # Templates de emails
└── tests/          # Tests
```

## API Endpoints

### Autenticación
- `POST /api/auth/register` - Registrar usuario
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/refresh` - Refrescar token

### Negocios (Públicos)
- `GET /api/businesses` - Listar negocios
- `GET /api/businesses/:id` - Detalle de negocio
- `GET /api/categories` - Listar categorías

### Usuario
- `GET /api/user/profile` - Ver perfil
- `GET /api/user/favorites` - Ver favoritos

### Owner
- `POST /api/owner/businesses` - Crear negocio
- `PUT /api/owner/businesses/:id` - Editar negocio
- `DELETE /api/owner/businesses/:id` - Eliminar negocio

### Admin
- `GET /api/admin/pending` - Negocios pendientes
- `PUT /api/admin/approve/:id` - Aprobar negocio
- `PUT /api/admin/reject/:id` - Rechazar negocio

## Variables de Entorno

Ver archivo `.env.example` para la lista completa de variables requeridas.

## Licencia

ISC
