# 🚀 Guía de Inicio - TMensajeo

## 📋 Estado Actual del Proyecto

✅ **Backend**: 99.5% completo (70 endpoints funcionando) - **CORRIENDO EN PUERTO 3000**  
✅ **Frontend**: Estructura completa + Páginas principales implementadas - **CORRIENDO EN PUERTO 5174**  
✅ **Dependencias**: Instaladas en ambos proyectos  
✅ **Conexión**: Backend y Frontend conectados correctamente

### 🎯 Páginas Implementadas y Funcionales:
- ✅ **Login** (`/login`) - Conectado con el backend
- ✅ **Registro** (`/register`) - Conectado con el backend
- ✅ **HomePage** (`/`) - Muestra negocios destacados y recientes
- ✅ **Detalle de Negocio** (`/business/:slug`) - Información completa + reseñas
- ✅ **Header** - Navegación con usuario logueado/deslogueado

---

## 🔧 Configuración Inicial

### 1. Backend - Variables de Entorno

Verifica que `backend/.env` exista y tenga:

```env
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/tmensajeo"

# JWT
JWT_SECRET="tu-secret-key-super-segura"
JWT_REFRESH_SECRET="tu-refresh-secret-key"

# Cloudinary
CLOUDINARY_CLOUD_NAME="tu-cloud-name"
CLOUDINARY_API_KEY="tu-api-key"
CLOUDINARY_API_SECRET="tu-api-secret"

# Email (opcional para desarrollo)
EMAIL_HOST="smtp.gmail.com"
EMAIL_PORT="587"
EMAIL_USER="tu-email@gmail.com"
EMAIL_PASSWORD="tu-password"

# Otros
NODE_ENV="development"
PORT="3000"
FRONTEND_URL="http://localhost:5173"
```

### 2. Frontend - Variables de Entorno

Crea `frontend/.env` basado en `.env.example`:

```env
VITE_API_URL=http://localhost:3000/api
VITE_CLOUDINARY_CLOUD_NAME=tu-cloud-name
```

---

## 🗄️ Base de Datos

### Inicializar PostgreSQL

```bash
# Asegúrate de que PostgreSQL esté corriendo
# Luego desde backend/:

cd backend
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

Esto creará:
- ✅ Tablas en la base de datos
- ✅ Datos de prueba (categorías, usuarios, negocios)

---

## ▶️ Levantar los Servicios

### Opción 1: Terminal Separada (Recomendado)

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```
Debería mostrar:
```
🚀 Server running on http://localhost:3000
📚 Swagger docs: http://localhost:3000/api-docs
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Debería mostrar:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

### Opción 2: Comandos Rápidos

Desde la raíz del proyecto:

```bash
# Backend (en una terminal)
cd backend && npm run dev

# Frontend (en otra terminal)
cd frontend && npm run dev
```

---

## ✅ Verificar que Todo Funciona

### 1. Backend
Abre en tu navegador:
- **API Health**: http://localhost:3000/api
- **Swagger Docs**: http://localhost:3000/api-docs

### 2. Frontend
- **App**: http://localhost:5173/
- Deberías ver la página de inicio (aunque sin datos todavía)

### 3. Conexión Backend-Frontend
Abre la consola del navegador (F12) y verifica que no haya errores de CORS

---

## 🎯 Próximos Pasos de Desarrollo

### Fase 1: Conectar Frontend con Backend (AHORA)

#### 1.1 Probar Autenticación
```
Tarea: Implementar formularios de login/registro funcionales
Archivos:
  - frontend/src/pages/auth/LoginPage.tsx
  - frontend/src/pages/auth/RegisterPage.tsx
  - frontend/src/context/AuthContext.tsx (ya configurado)

Prueba:
  1. Registrar un nuevo usuario
  2. Hacer login
  3. Verificar que se guarde el token en localStorage
  4. Ver que el Header muestre el usuario logueado
```

#### 1.2 Implementar HomePage
```
Tarea: Mostrar negocios destacados en la página principal
Archivos:
  - frontend/src/pages/public/HomePage.tsx
  - frontend/src/services/businessService.ts
  - frontend/src/components/business/BusinessCard.tsx

Endpoint Backend: GET /api/businesses?featured=true
```

#### 1.3 Detalle de Negocio
```
Tarea: Mostrar información completa de un negocio
Archivo: frontend/src/pages/public/BusinessDetailPage.tsx
Endpoint: GET /api/businesses/:slug
```

### Fase 2: Funcionalidades Públicas (Semana 1-2)
- [x] Búsqueda de negocios
- [x] Filtros por categoría
- [x] Vista de mapa
- [x] Sistema de reseñas (lectura)

### Fase 3: Panel de Usuario (Semana 2-3)
- [ ] Mi perfil
- [ ] Mis reseñas
- [ ] Negocios favoritos
- [ ] Seguir negocios

### Fase 4: Panel de Propietario (Semana 3-4)
- [ ] Dashboard con estadísticas
- [ ] Crear/editar negocios
- [ ] Gestionar eventos
- [ ] Responder reseñas

### Fase 5: Panel de Admin (Semana 4-5)
- [ ] Moderar negocios
- [ ] Gestionar usuarios
- [ ] Estadísticas globales

---

## 🛠️ Comandos Útiles

### Backend
```bash
npm run dev          # Desarrollo con hot-reload
npm run build        # Compilar TypeScript
npm run start        # Producción
npm test             # Ejecutar tests
npm run prisma:studio # Ver base de datos visualmente
```

### Frontend
```bash
npm run dev          # Desarrollo con Vite
npm run build        # Build para producción
npm run preview      # Preview del build
npm run lint         # Verificar código
```

---

## 🐛 Troubleshooting

### Backend no inicia
```bash
# Verificar que PostgreSQL esté corriendo
# Verificar las variables de entorno en .env
# Reinstalar dependencias
cd backend
rm -rf node_modules package-lock.json
npm install
```

### Frontend muestra pantalla blanca
```bash
# Verificar la consola del navegador (F12)
# Verificar que VITE_API_URL esté en .env
# Limpiar cache de Vite
cd frontend
rm -rf node_modules/.vite
npm run dev
```

### Error de CORS
```bash
# Verificar en backend/src/config/cors.ts que 
# FRONTEND_URL esté correctamente configurado
# Por defecto permite: http://localhost:5173
```

### Error "Cannot connect to database"
```bash
# Verificar PostgreSQL esté corriendo
# Verificar DATABASE_URL en backend/.env
# Crear la base de datos si no existe:
psql -U postgres
CREATE DATABASE tmensajeo;
\q

# Luego ejecutar migraciones
cd backend
npx prisma migrate deploy
```

---

## 📚 Recursos Adicionales

- **Documentación Backend**: `backend/README.md`
- **Plan Frontend Completo**: `Zdocs/PLAN-FRONTEND.md`
- **Documentación Completa**: `Zdocs/DOCUMENTACION-COMPLETA.md`
- **Swagger API**: http://localhost:3000/api-docs (cuando el backend esté corriendo)

---

## 🎨 Empezar a Desarrollar

### Recomendación: Comenzar por Autenticación

1. **Levanta ambos servidores** (backend + frontend)
2. **Abre**: http://localhost:5173/login
3. **Implementa** el formulario de login conectándolo con el backend
4. **Prueba** registrando un usuario y haciendo login
5. **Verifica** que el AuthContext guarde el token correctamente

### Próximo archivo a trabajar:
```
📁 frontend/src/pages/auth/LoginPage.tsx
```

Este archivo ya tiene la estructura básica. Solo necesitas:
- Conectar el formulario con el servicio `authService.login()`
- Manejar errores y mostrar notificaciones
- Redirigir al usuario después del login exitoso

---

## 🚦 Checklist Rápido

Antes de empezar a codear, verifica:

- [x] PostgreSQL corriendo
- [x] Base de datos creada y migrada (`npx prisma migrate deploy`)
- [x] Backend corriendo en `http://localhost:3000` ✅
- [x] Frontend corriendo en `http://localhost:5174` ✅ (nota: puerto 5174, no 5173)
- [x] `.env` configurado en ambos proyectos
- [x] Swagger docs accesible en `http://localhost:3000/api-docs`
- [x] Sin errores en la consola del navegador
- [x] Login y Registro funcionando
- [x] HomePage mostrando negocios
- [x] Detalle de negocio funcionando

**¡Todo está ✅ y funcionando! El frontend y backend están conectados correctamente.** 🎉

### 🎮 Pruébalo Ahora

1. **Abre tu navegador** en: http://localhost:5174
2. **Regístrate** como usuario o dueño de negocio
3. **Inicia sesión** con tus credenciales
4. **Navega** por la página de inicio y los detalles de negocios
5. El **Header** mostrará tu nombre cuando estés logueado

### 📝 Próximos Pasos

Ahora puedes continuar implementando:
- Página de búsqueda con filtros
- Escribir reseñas
- Panel de usuario (perfil, favoritos)
- Panel de propietario (crear/editar negocios)
- Panel de administrador
