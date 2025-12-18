# Locales - Plataforma de Negocios Locales

Plataforma web fullstack para descubrir y conectar con negocios de tu comunidad.

## 🚀 Características

- 🏪 **Directorio de negocios locales** con búsqueda avanzada
- ⭐ **Sistema de reseñas** y calificaciones
- 🗺️ **Mapas interactivos** con ubicaciones
- 👤 **Perfiles de usuario** con favoritos
- 🏢 **Panel para owners** para gestionar negocios
- 👨‍💼 **Panel de administración** para moderación
- 📱 **Diseño responsive** para móviles y tablets
- 🔐 **Autenticación segura** con JWT

## 📦 Tecnologías

### Backend
- Node.js + Express + TypeScript
- PostgreSQL + Prisma ORM
- JWT Authentication
- Cloudinary (imágenes)
- Nodemailer (emails)

### Frontend
- React 18 + Vite
- TypeScript
- Tailwind CSS + shadcn/ui
- React Router
- React Query + Zustand
- Leaflet (mapas)

## 📁 Estructura del Proyecto

```
locales/
├── backend/           # API REST
│   ├── prisma/       # Base de datos
│   └── src/          # Código backend
├── frontend/         # SPA React
│   └── src/          # Código frontend
├── docs/             # Documentación
└── README.md         # Este archivo
```

## 🛠️ Instalación

### Prerrequisitos

- Node.js 20+
- PostgreSQL 14+
- npm o yarn

### Backend

```bash
cd backend

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

# Iniciar servidor de desarrollo
npm run dev
```

El backend estará en: `http://localhost:3000`

### Frontend

```bash
cd frontend

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env
# Editar .env con la URL del backend

# Iniciar servidor de desarrollo
npm run dev
```

El frontend estará en: `http://localhost:5173`

## 📚 Documentación

- [Arquitectura Fullstack](docs/ARQUITECTURA-FULLSTACK.md)
- [Base de Datos](docs/baseDatos.md)
- [Guía para Owners](docs/owner.md)
- [Estructura del Proyecto](docs/estructura-proyecto.md)

## 🧪 Testing

### Backend
```bash
cd backend
npm test
```

### Frontend
```bash
cd frontend
npm test
```

## 🚀 Deployment

### Backend
Recomendado: Railway, Render, o cualquier VPS

```bash
cd backend
npm run build
npm start
```

### Frontend
Recomendado: Vercel, Netlify, o Cloudflare Pages

```bash
cd frontend
npm run build
# Los archivos estarán en dist/
```

## 👥 Roles de Usuario

- **USER:** Usuario registrado que puede ver negocios y dejar reseñas
- **OWNER:** Dueño de negocio que puede crear y gestionar locales
- **ADMIN:** Administrador con permisos completos

## 🔐 Credenciales por Defecto

Después de ejecutar el seed:

```
Email: admin@locales.com
Password: admin123
```

⚠️ **Cambiar en producción**

## 📝 Scripts Disponibles

### Backend
- `npm run dev` - Desarrollo con hot reload
- `npm run build` - Compilar a JavaScript
- `npm start` - Producción
- `npm run prisma:studio` - GUI de base de datos
- `npm test` - Ejecutar tests

### Frontend
- `npm run dev` - Desarrollo
- `npm run build` - Build de producción
- `npm run preview` - Preview del build

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

ISC

## 📧 Contacto

Para soporte o preguntas: soporte@locales.com

---

**Desarrollado con ❤️ para la comunidad local**

---

## 🎯 Roadmap

- [x] Autenticación con JWT
- [x] CRUD de negocios
- [x] Sistema de reseñas
- [x] Búsqueda y filtros
- [x] Mapas interactivos
- [ ] Notificaciones en tiempo real
- [ ] Chat en vivo
- [ ] Sistema de reservas
- [ ] PWA (Progressive Web App)
- [ ] Aplicación móvil nativa

## 🐛 Reportar Bugs

Si encuentras un bug, por favor crea un issue con:

1. Descripción del problema
2. Pasos para reproducir
3. Comportamiento esperado
4. Screenshots (si aplica)
5. Información del sistema (OS, navegador, etc)
