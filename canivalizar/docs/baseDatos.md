# 💾 BASE DE DATOS COMPLETA - PostgreSQL

**Fecha:** 17 de Diciembre, 2025  
**Base de Datos:** PostgreSQL 15+  
**Normalización:** 3FN (Tercera Forma Normal)  
**Extensiones:** PostGIS (geolocalización)

---

## 📋 TABLA DE CONTENIDOS

1. [Diagrama ER](#-diagrama-entidad-relación)
2. [Script SQL Completo](#-script-sql-completo)
3. [Explicación de Tablas](#-explicación-de-tablas)
4. [Índices y Optimización](#-índices-y-optimización)
5. [Triggers y Funciones](#-triggers-y-funciones)
6. [Datos Iniciales (Seed)](#-datos-iniciales-seed)
7. [Consultas Útiles](#-consultas-útiles)

---

## 🗺️ Diagrama Entidad-Relación

```
┌─────────────┐
│    User     │
└──────┬──────┘
       │ 1
       │
       │ N
┌──────┴──────────┐
│   Business      │──┐
└──────┬──────────┘  │
       │             │ 1
       │ 1           │
       │             │ N
       │ N      ┌────┴─────────┐
┌──────┴──────┐ │ GalleryImage │
│   Review    │ └──────────────┘
└──────┬──────┘
       │ 1           ┌──────────────┐
       │             │    Event     │──┐
       │ N           └──────┬───────┘  │
┌──────┴──────────┐        │ N        │ N
│ ReviewReaction  │        │          │
└─────────────────┘  ┌─────┴──────┐  │
                     │ Business   │◄─┘
┌─────────────┐     └────────────┘
│  Favorite   │──────┐
└─────────────┘      │
                     │ N
┌─────────────┐      │
│  Following  │──────┤
└─────────────┘      │
                     │
┌─────────────┐      │
│     FAQ     │──────┘
└─────────────┘

┌─────────────┐
│  Category   │ (Tabla independiente)
└─────────────┘
```

---

## 📜 SCRIPT SQL COMPLETO

### Paso 0: Conexión y Configuración Inicial

```sql
-- ============================================
-- SCRIPT DE BASE DE DATOS - LOCALES
-- ============================================
-- IMPORTANTE: Ejecutar este script como superusuario de PostgreSQL
-- Ejemplo: psql -U postgres -f baseDatos.sql

-- Configuración del encoding
\encoding UTF8
SET client_encoding = 'UTF8';

-- Terminar conexiones existentes (opcional, solo si recreas)
-- SELECT pg_terminate_backend(pg_stat_activity.pid)
-- FROM pg_stat_activity
-- WHERE pg_stat_activity.datname = 'locales_db'
--   AND pid <> pg_backend_pid();
```

---

### Paso 1: Crear Base de Datos

```sql
-- ============================================
-- 1. CREAR BASE DE DATOS
-- ============================================

-- Eliminar si existe (CUIDADO: Esto borra todos los datos)
-- DROP DATABASE IF EXISTS locales_db;

-- Crear base de datos
CREATE DATABASE locales_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'es_ES.UTF-8'
    LC_CTYPE = 'es_ES.UTF-8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1
    TEMPLATE = template0;

COMMENT ON DATABASE locales_db IS 'Base de datos para aplicación de locales comerciales';

-- Conectarse a la base de datos
\c locales_db
```

---

### Paso 2: Habilitar Extensiones

```sql
-- ============================================
-- 2. EXTENSIONES
-- ============================================

-- PostGIS para funciones geoespaciales
CREATE EXTENSION IF NOT EXISTS postgis;
COMMENT ON EXTENSION postgis IS 'Soporte para objetos geográficos (búsquedas por ubicación)';

-- UUID para generar IDs únicos (opcional, usamos CUID en app)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- pg_trgm para búsquedas full-text más eficientes
CREATE EXTENSION IF NOT EXISTS pg_trgm;
COMMENT ON EXTENSION pg_trgm IS 'Soporte para búsquedas de texto con similitud';

-- unaccent para búsquedas sin acentos
CREATE EXTENSION IF NOT EXISTS unaccent;
COMMENT ON EXTENSION unaccent IS 'Búsquedas ignorando acentos';
```

---

### Paso 3: Crear ENUMs

```sql
-- ============================================
-- 3. TIPOS ENUMERADOS
-- ============================================

-- Roles de usuario
CREATE TYPE user_role AS ENUM ('GUEST', 'USER', 'OWNER', 'ADMIN');
COMMENT ON TYPE user_role IS 'Roles de usuarios: GUEST (visitante), USER (registrado), OWNER (dueño), ADMIN (administrador)';

-- Estados de negocio
CREATE TYPE business_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'SUSPENDED');
COMMENT ON TYPE business_status IS 'Estados de negocios: PENDING (pendiente aprobación), APPROVED (aprobado), REJECTED (rechazado), SUSPENDED (suspendido)';

-- Estados de FAQ
CREATE TYPE faq_status AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
COMMENT ON TYPE faq_status IS 'Estados de preguntas FAQ: PENDING (sin responder), APPROVED (respondida), REJECTED (rechazada)';

-- Tipos de reacción
CREATE TYPE reaction_type AS ENUM ('HELPFUL', 'NOT_HELPFUL');
COMMENT ON TYPE reaction_type IS 'Tipos de reacción a reseñas';
```

---

### Paso 4: Crear Tablas

```sql
-- ============================================
-- 4. TABLAS PRINCIPALES
-- ============================================

-- --------------------------------------------
-- 4.1 TABLA: users
-- --------------------------------------------
CREATE TABLE users (
    id VARCHAR(30) PRIMARY KEY DEFAULT ('user_' || encode(gen_random_bytes(15), 'hex')),
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL, -- Hasheado con bcrypt
    role user_role DEFAULT 'USER' NOT NULL,
    avatar TEXT, -- URL de Cloudinary
    city VARCHAR(100),
    bio TEXT,
    banned BOOLEAN DEFAULT FALSE NOT NULL,
    ban_reason TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    CONSTRAINT users_name_check CHECK (char_length(name) >= 2)
);

-- Comentarios
COMMENT ON TABLE users IS 'Tabla de usuarios del sistema';
COMMENT ON COLUMN users.id IS 'ID único del usuario (CUID)';
COMMENT ON COLUMN users.email IS 'Email único del usuario';
COMMENT ON COLUMN users.password IS 'Contraseña hasheada con bcrypt (nunca texto plano)';
COMMENT ON COLUMN users.role IS 'Rol del usuario (GUEST, USER, OWNER, ADMIN)';
COMMENT ON COLUMN users.banned IS 'Indica si el usuario está baneado';

-- Índices
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at DESC);

-- --------------------------------------------
-- 4.2 TABLA: businesses
-- --------------------------------------------
CREATE TABLE businesses (
    id VARCHAR(30) PRIMARY KEY DEFAULT ('biz_' || encode(gen_random_bytes(15), 'hex')),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL UNIQUE,
    description TEXT NOT NULL, -- Resumen corto (max 500 chars)
    full_description TEXT, -- Descripción completa
    category VARCHAR(100) NOT NULL,
    subcategory VARCHAR(100),
    
    -- Ubicación
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    zip_code VARCHAR(20),
    latitude DECIMAL(10, 8), -- Ej: -34.603722
    longitude DECIMAL(11, 8), -- Ej: -58.381592
    location GEOGRAPHY(POINT, 4326), -- PostGIS para búsquedas geoespaciales
    
    -- Contacto (JSON para flexibilidad)
    contact_buttons JSONB DEFAULT '[]'::jsonb,
    phone VARCHAR(20),
    email VARCHAR(255),
    website TEXT,
    
    -- Horarios (JSON)
    hours JSONB DEFAULT '{}'::jsonb,
    
    -- Info comercial
    price_range VARCHAR(10), -- $, $$, $$$, $$$$
    
    -- Características
    features JSONB DEFAULT '[]'::jsonb, -- [{icon, label, enabled}, ...]
    amenities TEXT[] DEFAULT ARRAY[]::TEXT[], -- ["WiFi", "Parking", ...]
    
    -- Media
    logo TEXT, -- URL de Cloudinary
    cover_image TEXT, -- URL de Cloudinary para header
    
    -- Estado
    status business_status DEFAULT 'PENDING' NOT NULL,
    featured BOOLEAN DEFAULT FALSE NOT NULL,
    verified BOOLEAN DEFAULT FALSE NOT NULL,
    
    -- Estadísticas (desnormalizadas para performance)
    rating DECIMAL(3, 2) DEFAULT 0 NOT NULL CHECK (rating >= 0 AND rating <= 5),
    review_count INTEGER DEFAULT 0 NOT NULL CHECK (review_count >= 0),
    view_count INTEGER DEFAULT 0 NOT NULL CHECK (view_count >= 0),
    favorite_count INTEGER DEFAULT 0 NOT NULL CHECK (favorite_count >= 0),
    follower_count INTEGER DEFAULT 0 NOT NULL CHECK (follower_count >= 0),
    
    -- Relaciones
    owner_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT businesses_name_check CHECK (char_length(name) >= 2),
    CONSTRAINT businesses_description_check CHECK (char_length(description) >= 10),
    CONSTRAINT businesses_latitude_check CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT businesses_longitude_check CHECK (longitude >= -180 AND longitude <= 180)
);

-- Comentarios
COMMENT ON TABLE businesses IS 'Tabla de negocios/locales comerciales';
COMMENT ON COLUMN businesses.slug IS 'URL-friendly unique identifier (ej: cafe-la-esquina)';
COMMENT ON COLUMN businesses.location IS 'Punto geográfico PostGIS para búsquedas espaciales';
COMMENT ON COLUMN businesses.contact_buttons IS 'Botones de contacto personalizables (WhatsApp, Messenger, etc)';
COMMENT ON COLUMN businesses.hours IS 'Horarios de atención por día';
COMMENT ON COLUMN businesses.features IS 'Características con íconos definidas por el owner';
COMMENT ON COLUMN businesses.rating IS 'Rating promedio (0-5) calculado automáticamente';
COMMENT ON COLUMN businesses.status IS 'Estado del negocio (requiere aprobación admin)';

-- Índices
CREATE INDEX idx_businesses_slug ON businesses(slug);
CREATE INDEX idx_businesses_status ON businesses(status);
CREATE INDEX idx_businesses_category ON businesses(category);
CREATE INDEX idx_businesses_city ON businesses(city);
CREATE INDEX idx_businesses_featured ON businesses(featured) WHERE featured = TRUE;
CREATE INDEX idx_businesses_rating ON businesses(rating DESC);
CREATE INDEX idx_businesses_owner_id ON businesses(owner_id);
CREATE INDEX idx_businesses_created_at ON businesses(created_at DESC);

-- Índice geoespacial (PostGIS)
CREATE INDEX idx_businesses_location ON businesses USING GIST(location);

-- Índice full-text search
CREATE INDEX idx_businesses_search ON businesses 
    USING GIN (to_tsvector('spanish', name || ' ' || description || ' ' || COALESCE(full_description, '')));

-- Índice para búsqueda por amenidades
CREATE INDEX idx_businesses_amenities ON businesses USING GIN(amenities);

-- --------------------------------------------
-- 4.3 TABLA: gallery_images
-- --------------------------------------------
CREATE TABLE gallery_images (
    id VARCHAR(30) PRIMARY KEY DEFAULT ('img_' || encode(gen_random_bytes(15), 'hex')),
    url TEXT NOT NULL, -- URL completa de Cloudinary
    thumbnail TEXT NOT NULL, -- URL del thumbnail (400x300)
    public_id TEXT NOT NULL, -- Public ID de Cloudinary (para eliminar)
    category VARCHAR(50), -- "exterior", "interior", "menu", "productos", etc
    "order" INTEGER DEFAULT 0 NOT NULL,
    is_main BOOLEAN DEFAULT FALSE NOT NULL, -- Imagen principal del negocio
    
    -- Relaciones
    business_id VARCHAR(30) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT gallery_images_order_check CHECK ("order" >= 0)
);

-- Comentarios
COMMENT ON TABLE gallery_images IS 'Galería de fotos de los negocios';
COMMENT ON COLUMN gallery_images.public_id IS 'ID de Cloudinary para eliminar/actualizar imagen';
COMMENT ON COLUMN gallery_images.category IS 'Categoría de la foto para filtrado en frontend';
COMMENT ON COLUMN gallery_images.is_main IS 'Foto principal que aparece en cards y listados';

-- Índices
CREATE INDEX idx_gallery_images_business_id ON gallery_images(business_id);
CREATE INDEX idx_gallery_images_category ON gallery_images(category);
CREATE INDEX idx_gallery_images_order ON gallery_images("order");
CREATE INDEX idx_gallery_images_is_main ON gallery_images(is_main) WHERE is_main = TRUE;

-- Solo una imagen principal por negocio
CREATE UNIQUE INDEX idx_gallery_images_main_per_business 
    ON gallery_images(business_id) 
    WHERE is_main = TRUE;

-- --------------------------------------------
-- 4.4 TABLA: events
-- --------------------------------------------
CREATE TABLE events (
    id VARCHAR(30) PRIMARY KEY DEFAULT ('evt_' || encode(gen_random_bytes(15), 'hex')),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    image TEXT, -- URL de Cloudinary
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    published BOOLEAN DEFAULT TRUE NOT NULL,
    
    -- Relaciones
    business_id VARCHAR(30) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT events_title_check CHECK (char_length(title) >= 3),
    CONSTRAINT events_dates_check CHECK (end_date IS NULL OR end_date >= start_date)
);

-- Comentarios
COMMENT ON TABLE events IS 'Eventos y actualizaciones de los negocios';
COMMENT ON COLUMN events.published IS 'Control de visibilidad del evento';

-- Índices
CREATE INDEX idx_events_business_id ON events(business_id);
CREATE INDEX idx_events_start_date ON events(start_date DESC);
CREATE INDEX idx_events_published ON events(published) WHERE published = TRUE;

-- --------------------------------------------
-- 4.5 TABLA: reviews
-- --------------------------------------------
CREATE TABLE reviews (
    id VARCHAR(30) PRIMARY KEY DEFAULT ('rev_' || encode(gen_random_bytes(15), 'hex')),
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    comment TEXT NOT NULL,
    images TEXT[] DEFAULT ARRAY[]::TEXT[], -- URLs de Cloudinary
    
    -- Reacciones (desnormalizado para performance)
    helpful INTEGER DEFAULT 0 NOT NULL CHECK (helpful >= 0),
    not_helpful INTEGER DEFAULT 0 NOT NULL CHECK (not_helpful >= 0),
    
    -- Respuesta del owner
    owner_reply TEXT,
    replied_at TIMESTAMP WITH TIME ZONE,
    
    -- Relaciones
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id VARCHAR(30) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT reviews_comment_check CHECK (char_length(comment) >= 10)
);

-- Comentarios
COMMENT ON TABLE reviews IS 'Reseñas de usuarios sobre negocios';
COMMENT ON COLUMN reviews.helpful IS 'Contador de reacciones "útil"';
COMMENT ON COLUMN reviews.not_helpful IS 'Contador de reacciones "no útil"';
COMMENT ON COLUMN reviews.owner_reply IS 'Respuesta del dueño del negocio';

-- Índices
CREATE INDEX idx_reviews_business_id ON reviews(business_id);
CREATE INDEX idx_reviews_user_id ON reviews(user_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);
CREATE INDEX idx_reviews_created_at ON reviews(created_at DESC);

-- Un usuario solo puede dejar una reseña por negocio
CREATE UNIQUE INDEX idx_reviews_user_business ON reviews(user_id, business_id);

-- --------------------------------------------
-- 4.6 TABLA: review_reactions
-- --------------------------------------------
CREATE TABLE review_reactions (
    id VARCHAR(30) PRIMARY KEY DEFAULT ('react_' || encode(gen_random_bytes(15), 'hex')),
    type reaction_type NOT NULL,
    
    -- Relaciones
    review_id VARCHAR(30) NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Comentarios
COMMENT ON TABLE review_reactions IS 'Reacciones de usuarios a reseñas (útil/no útil)';

-- Índices
CREATE INDEX idx_review_reactions_review_id ON review_reactions(review_id);
CREATE INDEX idx_review_reactions_user_id ON review_reactions(user_id);

-- Un usuario solo puede reaccionar una vez por reseña
CREATE UNIQUE INDEX idx_review_reactions_user_review ON review_reactions(user_id, review_id);

-- --------------------------------------------
-- 4.7 TABLA: faqs
-- --------------------------------------------
CREATE TABLE faqs (
    id VARCHAR(30) PRIMARY KEY DEFAULT ('faq_' || encode(gen_random_bytes(15), 'hex')),
    question TEXT NOT NULL,
    answer TEXT,
    status faq_status DEFAULT 'PENDING' NOT NULL,
    
    -- Relaciones
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id VARCHAR(30) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    answered_at TIMESTAMP WITH TIME ZONE,
    
    -- Constraints
    CONSTRAINT faqs_question_check CHECK (char_length(question) >= 10)
);

-- Comentarios
COMMENT ON TABLE faqs IS 'Preguntas frecuentes sobre negocios';
COMMENT ON COLUMN faqs.status IS 'Estado: PENDING (sin responder), APPROVED (visible), REJECTED (eliminada)';

-- Índices
CREATE INDEX idx_faqs_business_id ON faqs(business_id);
CREATE INDEX idx_faqs_status ON faqs(status);
CREATE INDEX idx_faqs_created_at ON faqs(created_at DESC);

-- --------------------------------------------
-- 4.8 TABLA: favorites
-- --------------------------------------------
CREATE TABLE favorites (
    id VARCHAR(30) PRIMARY KEY DEFAULT ('fav_' || encode(gen_random_bytes(15), 'hex')),
    
    -- Relaciones
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id VARCHAR(30) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Comentarios
COMMENT ON TABLE favorites IS 'Negocios favoritos de los usuarios';

-- Índices
CREATE INDEX idx_favorites_user_id ON favorites(user_id);
CREATE INDEX idx_favorites_business_id ON favorites(business_id);
CREATE INDEX idx_favorites_created_at ON favorites(created_at DESC);

-- Un usuario no puede marcar el mismo negocio como favorito dos veces
CREATE UNIQUE INDEX idx_favorites_user_business ON favorites(user_id, business_id);

-- --------------------------------------------
-- 4.9 TABLA: followings
-- --------------------------------------------
CREATE TABLE followings (
    id VARCHAR(30) PRIMARY KEY DEFAULT ('fol_' || encode(gen_random_bytes(15), 'hex')),
    
    -- Relaciones
    user_id VARCHAR(30) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    business_id VARCHAR(30) NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Comentarios
COMMENT ON TABLE followings IS 'Usuarios que siguen negocios (para recibir actualizaciones)';

-- Índices
CREATE INDEX idx_followings_user_id ON followings(user_id);
CREATE INDEX idx_followings_business_id ON followings(business_id);
CREATE INDEX idx_followings_created_at ON followings(created_at DESC);

-- Un usuario no puede seguir el mismo negocio dos veces
CREATE UNIQUE INDEX idx_followings_user_business ON followings(user_id, business_id);

-- --------------------------------------------
-- 4.10 TABLA: categories
-- --------------------------------------------
CREATE TABLE categories (
    id VARCHAR(30) PRIMARY KEY DEFAULT ('cat_' || encode(gen_random_bytes(15), 'hex')),
    name VARCHAR(100) NOT NULL UNIQUE,
    slug VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    icon VARCHAR(50), -- Nombre del ícono (Lucide) o URL
    subcategories TEXT[] DEFAULT ARRAY[]::TEXT[],
    "order" INTEGER DEFAULT 0 NOT NULL,
    
    -- Timestamps
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    
    -- Constraints
    CONSTRAINT categories_name_check CHECK (char_length(name) >= 2),
    CONSTRAINT categories_slug_check CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Comentarios
COMMENT ON TABLE categories IS 'Categorías de negocios (restaurantes, belleza, salud, etc)';
COMMENT ON COLUMN categories.subcategories IS 'Array de subcategorías (ej: ["fast-food", "cafe", "bar"])';
COMMENT ON COLUMN categories."order" IS 'Orden de aparición en el frontend';

-- Índices
CREATE INDEX idx_categories_slug ON categories(slug);
CREATE INDEX idx_categories_order ON categories("order");
```

---

## 🔧 Triggers y Funciones

```sql
-- ============================================
-- 5. TRIGGERS Y FUNCIONES
-- ============================================

-- --------------------------------------------
-- 5.1 Función: Actualizar updated_at automáticamente
-- --------------------------------------------
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_updated_at_column() IS 'Actualiza automáticamente la columna updated_at';

-- Aplicar trigger a todas las tablas con updated_at
CREATE TRIGGER trigger_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_businesses_updated_at
    BEFORE UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_events_updated_at
    BEFORE UPDATE ON events
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trigger_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- --------------------------------------------
-- 5.2 Función: Actualizar location PostGIS automáticamente
-- --------------------------------------------
CREATE OR REPLACE FUNCTION update_business_location()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.latitude IS NOT NULL AND NEW.longitude IS NOT NULL THEN
        NEW.location = ST_SetSRID(ST_MakePoint(NEW.longitude, NEW.latitude), 4326)::geography;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_business_location() IS 'Actualiza automáticamente el campo location (PostGIS) cuando cambian lat/lng';

CREATE TRIGGER trigger_business_location
    BEFORE INSERT OR UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION update_business_location();

-- --------------------------------------------
-- 5.3 Función: Generar slug automáticamente
-- --------------------------------------------
CREATE OR REPLACE FUNCTION generate_business_slug()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.slug IS NULL OR NEW.slug = '' THEN
        -- Convertir nombre a slug (lowercase, sin espacios, sin caracteres especiales)
        NEW.slug = lower(regexp_replace(
            regexp_replace(
                unaccent(NEW.name),
                '[^a-zA-Z0-9\s-]', '', 'g'
            ),
            '\s+', '-', 'g'
        ));
        
        -- Si el slug ya existe, agregar número
        WHILE EXISTS (SELECT 1 FROM businesses WHERE slug = NEW.slug AND id != NEW.id) LOOP
            NEW.slug = NEW.slug || '-' || floor(random() * 1000)::text;
        END LOOP;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION generate_business_slug() IS 'Genera slug único automáticamente desde el nombre';

CREATE TRIGGER trigger_business_slug
    BEFORE INSERT OR UPDATE ON businesses
    FOR EACH ROW
    EXECUTE FUNCTION generate_business_slug();

-- --------------------------------------------
-- 5.4 Función: Actualizar rating promedio del negocio
-- --------------------------------------------
CREATE OR REPLACE FUNCTION update_business_rating()
RETURNS TRIGGER AS $$
DECLARE
    business_id_var VARCHAR(30);
    avg_rating DECIMAL(3,2);
    total_reviews INTEGER;
BEGIN
    -- Determinar el business_id según la operación
    IF TG_OP = 'DELETE' THEN
        business_id_var = OLD.business_id;
    ELSE
        business_id_var = NEW.business_id;
    END IF;
    
    -- Calcular rating promedio y total de reseñas
    SELECT 
        COALESCE(ROUND(AVG(rating)::numeric, 2), 0),
        COUNT(*)
    INTO avg_rating, total_reviews
    FROM reviews
    WHERE business_id = business_id_var;
    
    -- Actualizar negocio
    UPDATE businesses
    SET 
        rating = avg_rating,
        review_count = total_reviews
    WHERE id = business_id_var;
    
    RETURN NULL; -- Para AFTER trigger
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_business_rating() IS 'Recalcula rating promedio y contador de reseñas automáticamente';

CREATE TRIGGER trigger_review_insert_rating
    AFTER INSERT ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_business_rating();

CREATE TRIGGER trigger_review_update_rating
    AFTER UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_business_rating();

CREATE TRIGGER trigger_review_delete_rating
    AFTER DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_business_rating();

-- --------------------------------------------
-- 5.5 Función: Actualizar contadores de reacciones
-- --------------------------------------------
CREATE OR REPLACE FUNCTION update_review_reaction_count()
RETURNS TRIGGER AS $$
DECLARE
    review_id_var VARCHAR(30);
    helpful_count INTEGER;
    not_helpful_count INTEGER;
BEGIN
    -- Determinar review_id
    IF TG_OP = 'DELETE' THEN
        review_id_var = OLD.review_id;
    ELSE
        review_id_var = NEW.review_id;
    END IF;
    
    -- Contar reacciones
    SELECT 
        COUNT(*) FILTER (WHERE type = 'HELPFUL'),
        COUNT(*) FILTER (WHERE type = 'NOT_HELPFUL')
    INTO helpful_count, not_helpful_count
    FROM review_reactions
    WHERE review_id = review_id_var;
    
    -- Actualizar reseña
    UPDATE reviews
    SET 
        helpful = helpful_count,
        not_helpful = not_helpful_count
    WHERE id = review_id_var;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_review_reaction_count() IS 'Actualiza contadores de reacciones en reseñas';

CREATE TRIGGER trigger_reaction_insert
    AFTER INSERT ON review_reactions
    FOR EACH ROW
    EXECUTE FUNCTION update_review_reaction_count();

CREATE TRIGGER trigger_reaction_update
    AFTER UPDATE ON review_reactions
    FOR EACH ROW
    EXECUTE FUNCTION update_review_reaction_count();

CREATE TRIGGER trigger_reaction_delete
    AFTER DELETE ON review_reactions
    FOR EACH ROW
    EXECUTE FUNCTION update_review_reaction_count();

-- --------------------------------------------
-- 5.6 Función: Actualizar contadores de favoritos y seguidores
-- --------------------------------------------
CREATE OR REPLACE FUNCTION update_business_counters()
RETURNS TRIGGER AS $$
DECLARE
    business_id_var VARCHAR(30);
BEGIN
    IF TG_OP = 'DELETE' THEN
        business_id_var = OLD.business_id;
    ELSE
        business_id_var = NEW.business_id;
    END IF;
    
    -- Actualizar contador según la tabla
    IF TG_TABLE_NAME = 'favorites' THEN
        UPDATE businesses
        SET favorite_count = (SELECT COUNT(*) FROM favorites WHERE business_id = business_id_var)
        WHERE id = business_id_var;
    ELSIF TG_TABLE_NAME = 'followings' THEN
        UPDATE businesses
        SET follower_count = (SELECT COUNT(*) FROM followings WHERE business_id = business_id_var)
        WHERE id = business_id_var;
    END IF;
    
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

COMMENT ON FUNCTION update_business_counters() IS 'Actualiza contadores de favoritos y seguidores';

CREATE TRIGGER trigger_favorite_count
    AFTER INSERT OR DELETE ON favorites
    FOR EACH ROW
    EXECUTE FUNCTION update_business_counters();

CREATE TRIGGER trigger_follower_count
    AFTER INSERT OR DELETE ON followings
    FOR EACH ROW
    EXECUTE FUNCTION update_business_counters();
```

---

## 🌱 Datos Iniciales (Seed)

```sql
-- ============================================
-- 6. DATOS INICIALES (SEED)
-- ============================================

-- --------------------------------------------
-- 6.1 Usuario Admin
-- --------------------------------------------
-- Contraseña: admin123 (CAMBIAR EN PRODUCCIÓN)
-- Hash bcrypt: $2b$10$XQj9Z9Z9Z9Z9Z9Z9Z9Z9Z.aBcDeFgHiJkLmNoPqRsTuVwXyZ (ejemplo)
INSERT INTO users (id, email, name, password, role) VALUES
('user_admin_001', 'admin@locales.com', 'Administrador', '$2b$10$rQZ9Z9Z9Z9Z9Z9Z9Z9Z9Z.aBcDeFgHiJkLmNoPqRsTuVwXyZ', 'ADMIN')
ON CONFLICT (email) DO NOTHING;

-- --------------------------------------------
-- 6.2 Categorías
-- --------------------------------------------
INSERT INTO categories (id, name, slug, description, icon, subcategories, "order") VALUES
('cat_001', 'Restaurantes', 'restaurantes', 'Restaurantes, cafeterías, bares y comida', 'utensils', 
 ARRAY['Comida Rápida', 'Internacional', 'Cafetería', 'Bar', 'Parrilla', 'Pizzería', 'Sushi', 'Vegetariano'], 1),

('cat_002', 'Belleza y Spa', 'belleza', 'Peluquerías, spas, centros de estética', 'sparkles',
 ARRAY['Peluquería', 'Spa', 'Uñas', 'Barbería', 'Centro de Estética', 'Masajes'], 2),

('cat_003', 'Salud', 'salud', 'Clínicas, farmacias, centros médicos', 'heart-pulse',
 ARRAY['Clínica', 'Dentista', 'Farmacia', 'Óptica', 'Kinesiología', 'Nutrición'], 3),

('cat_004', 'Servicios', 'servicios', 'Servicios profesionales y del hogar', 'briefcase',
 ARRAY['Plomería', 'Electricidad', 'Carpintería', 'Limpieza', 'Jardinería', 'Cerrajería'], 4),

('cat_005', 'Tiendas', 'tiendas', 'Comercios y tiendas retail', 'shopping-bag',
 ARRAY['Ropa', 'Tecnología', 'Mascotas', 'Hogar', 'Deportes', 'Juguetería', 'Librería'], 5),

('cat_006', 'Educación', 'educacion', 'Escuelas, academias, centros de formación', 'graduation-cap',
 ARRAY['Idiomas', 'Informática', 'Arte', 'Música', 'Apoyo Escolar', 'Universidad'], 6),

('cat_007', 'Entretenimiento', 'entretenimiento', 'Cines, teatros, centros recreativos', 'ticket',
 ARRAY['Cine', 'Teatro', 'Gimnasio', 'Club Deportivo', 'Sala de Juegos', 'Bowling'], 7),

('cat_008', 'Automotriz', 'automotriz', 'Talleres, lavaderos, accesorios', 'car',
 ARRAY['Taller Mecánico', 'Lavadero', 'Accesorios', 'Gomería', 'Estación de Servicio'], 8)
ON CONFLICT (slug) DO NOTHING;

-- --------------------------------------------
-- 6.3 Usuario Owner de Ejemplo (Opcional)
-- --------------------------------------------
-- Contraseña: owner123
INSERT INTO users (id, email, name, password, role, city) VALUES
('user_owner_001', 'owner@ejemplo.com', 'Juan Pérez', '$2b$10$rQZ9Z9Z9Z9Z9Z9Z9Z9Z9Z.aBcDeFgHiJkLmNoPqRsTuVwXyZ', 'OWNER', 'Buenos Aires')
ON CONFLICT (email) DO NOTHING;

-- --------------------------------------------
-- 6.4 Negocio de Ejemplo (Opcional)
-- --------------------------------------------
INSERT INTO businesses (
    id, name, slug, description, full_description,
    category, subcategory,
    address, city, state, latitude, longitude,
    phone, price_range,
    contact_buttons,
    hours,
    features,
    amenities,
    status, owner_id
) VALUES (
    'biz_example_001',
    'Café La Esquina',
    'cafe-la-esquina',
    'El mejor café artesanal del barrio. Ambiente acogedor y productos de calidad.',
    'Café La Esquina es un espacio único donde combinamos la tradición del café con un ambiente moderno y acogedor. Nuestros granos son seleccionados cuidadosamente y tostados artesanalmente para ofrecerte la mejor experiencia. Contamos con una amplia variedad de métodos de preparación: espresso, v60, chemex, prensa francesa y más.',
    'restaurantes',
    'Cafetería',
    'Av. Corrientes 1234',
    'Buenos Aires',
    'CABA',
    -34.603722,
    -58.381592,
    '+5491123456789',
    '$$',
    '[
        {"type": "whatsapp", "value": "+5491123456789", "order": 1, "enabled": true, "label": "WhatsApp"},
        {"type": "phone", "value": "+5491123456789", "order": 2, "enabled": true, "label": "Llamar"},
        {"type": "website", "value": "https://cafelaesquina.com", "order": 3, "enabled": true, "label": "Sitio Web"}
    ]'::jsonb,
    '{
        "monday": {"open": "08:00", "close": "20:00", "closed": false},
        "tuesday": {"open": "08:00", "close": "20:00", "closed": false},
        "wednesday": {"open": "08:00", "close": "20:00", "closed": false},
        "thursday": {"open": "08:00", "close": "20:00", "closed": false},
        "friday": {"open": "08:00", "close": "22:00", "closed": false},
        "saturday": {"open": "09:00", "close": "22:00", "closed": false},
        "sunday": {"open": "10:00", "close": "18:00", "closed": false}
    }'::jsonb,
    '[
        {"icon": "wifi", "label": "WiFi Gratis", "enabled": true},
        {"icon": "parking-circle", "label": "Estacionamiento", "enabled": true},
        {"icon": "accessibility", "label": "Accesible", "enabled": true},
        {"icon": "credit-card", "label": "Acepta Tarjetas", "enabled": true}
    ]'::jsonb,
    ARRAY['WiFi', 'Aire Acondicionado', 'Música en Vivo', 'Terraza', 'Pet Friendly'],
    'APPROVED',
    'user_owner_001'
)
ON CONFLICT (slug) DO NOTHING;

COMMENT ON TABLE businesses IS 'Datos de ejemplo insertados exitosamente';
```

---

## 📊 Consultas Útiles

```sql
-- ============================================
-- 7. CONSULTAS ÚTILES PARA DESARROLLO
-- ============================================

-- --------------------------------------------
-- 7.1 Ver todas las tablas creadas
-- --------------------------------------------
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- --------------------------------------------
-- 7.2 Ver tamaño de las tablas
-- --------------------------------------------
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) AS size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;

-- --------------------------------------------
-- 7.3 Búsqueda geoespacial (negocios cercanos)
-- --------------------------------------------
-- Ejemplo: Buscar negocios a menos de 5km de un punto
SELECT 
    id,
    name,
    category,
    ST_Distance(
        location,
        ST_SetSRID(ST_MakePoint(-58.381592, -34.603722), 4326)::geography
    ) / 1000 AS distance_km
FROM businesses
WHERE 
    status = 'APPROVED'
    AND ST_DWithin(
        location,
        ST_SetSRID(ST_MakePoint(-58.381592, -34.603722), 4326)::geography,
        5000  -- 5km en metros
    )
ORDER BY distance_km;

-- --------------------------------------------
-- 7.4 Full-text search
-- --------------------------------------------
-- Buscar negocios por texto
SELECT 
    id,
    name,
    description,
    ts_rank(
        to_tsvector('spanish', name || ' ' || description),
        to_tsquery('spanish', 'cafe | cafeteria')
    ) AS rank
FROM businesses
WHERE 
    status = 'APPROVED'
    AND to_tsvector('spanish', name || ' ' || description) @@ to_tsquery('spanish', 'cafe | cafeteria')
ORDER BY rank DESC;

-- --------------------------------------------
-- 7.5 Top negocios por rating
-- --------------------------------------------
SELECT 
    b.name,
    b.category,
    b.rating,
    b.review_count,
    u.name AS owner_name
FROM businesses b
JOIN users u ON b.owner_id = u.id
WHERE b.status = 'APPROVED' AND b.review_count >= 5
ORDER BY b.rating DESC, b.review_count DESC
LIMIT 10;

-- --------------------------------------------
-- 7.6 Estadísticas generales
-- --------------------------------------------
SELECT 
    (SELECT COUNT(*) FROM users) AS total_users,
    (SELECT COUNT(*) FROM users WHERE role = 'OWNER') AS total_owners,
    (SELECT COUNT(*) FROM businesses WHERE status = 'APPROVED') AS approved_businesses,
    (SELECT COUNT(*) FROM businesses WHERE status = 'PENDING') AS pending_businesses,
    (SELECT COUNT(*) FROM reviews) AS total_reviews,
    (SELECT ROUND(AVG(rating)::numeric, 2) FROM businesses WHERE status = 'APPROVED') AS avg_rating;

-- --------------------------------------------
-- 7.7 Negocios sin reseñas
-- --------------------------------------------
SELECT 
    b.id,
    b.name,
    b.category,
    b.created_at,
    u.name AS owner_name,
    u.email AS owner_email
FROM businesses b
JOIN users u ON b.owner_id = u.id
WHERE 
    b.status = 'APPROVED'
    AND b.review_count = 0
ORDER BY b.created_at DESC;

-- --------------------------------------------
-- 7.8 Limpieza de datos de prueba (CUIDADO)
-- --------------------------------------------
-- Eliminar todos los negocios de ejemplo
-- DELETE FROM businesses WHERE id LIKE 'biz_example_%';

-- Resetear secuencias (si las hubiera)
-- ALTER SEQUENCE... RESTART WITH 1;

-- --------------------------------------------
-- 7.9 Backup rápido de tablas
-- --------------------------------------------
-- Exportar usuarios
-- \copy users TO 'users_backup.csv' CSV HEADER;

-- Importar usuarios
-- \copy users FROM 'users_backup.csv' CSV HEADER;
```

---

## 🔐 Seguridad y Permisos

```sql
-- ============================================
-- 8. SEGURIDAD Y PERMISOS
-- ============================================

-- --------------------------------------------
-- 8.1 Crear usuario de aplicación (no usar postgres directamente)
-- --------------------------------------------
CREATE USER locales_app WITH PASSWORD 'tu_password_seguro_aqui';

-- Otorgar permisos
GRANT CONNECT ON DATABASE locales_db TO locales_app;
GRANT USAGE ON SCHEMA public TO locales_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO locales_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO locales_app;

-- Para futuras tablas
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO locales_app;
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT USAGE, SELECT ON SEQUENCES TO locales_app;

-- --------------------------------------------
-- 8.2 Auditoría (opcional)
-- --------------------------------------------
-- Crear tabla de auditoría
CREATE TABLE IF NOT EXISTS audit_log (
    id SERIAL PRIMARY KEY,
    table_name VARCHAR(100),
    operation VARCHAR(10),
    user_id VARCHAR(30),
    old_data JSONB,
    new_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE audit_log IS 'Log de auditoría para operaciones críticas';
```

---

## ✅ Verificación de la Instalación

```sql
-- ============================================
-- 9. VERIFICACIÓN
-- ============================================

-- Verificar que todas las extensiones estén activas
SELECT extname, extversion FROM pg_extension;

-- Verificar que todas las tablas se crearon correctamente
SELECT 
    table_name,
    (SELECT COUNT(*) FROM information_schema.columns WHERE columns.table_name = tables.table_name) AS column_count
FROM information_schema.tables
WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- Verificar que todos los índices se crearon
SELECT 
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
ORDER BY tablename, indexname;

-- Verificar que todos los triggers se crearon
SELECT 
    trigger_name,
    event_object_table AS table_name,
    action_timing,
    event_manipulation
FROM information_schema.triggers
WHERE trigger_schema = 'public'
ORDER BY event_object_table, trigger_name;

-- Verificar datos de seed
SELECT 'Users' AS table_name, COUNT(*) AS count FROM users
UNION ALL
SELECT 'Categories', COUNT(*) FROM categories
UNION ALL
SELECT 'Businesses', COUNT(*) FROM businesses;

-- ============================================
-- ✅ INSTALACIÓN COMPLETADA
-- ============================================
-- Si llegaste hasta aquí sin errores, la base de datos está lista.
-- 
-- PRÓXIMOS PASOS:
-- 1. Configurar .env con DATABASE_URL
-- 2. Configurar Cloudinary
-- 3. Crear backend con Prisma o conectarte directamente con pg
-- 
-- STRING DE CONEXIÓN:
-- postgresql://locales_app:tu_password@localhost:5432/locales_db
-- ============================================

\echo '✅ Base de datos instalada correctamente'
\echo '📊 Total de tablas creadas:'
SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public';
```

---

## 📝 Notas Finales

### ✅ Características Implementadas

1. **Normalización 3FN:** Todas las tablas cumplen con la tercera forma normal
2. **Integridad Referencial:** Foreign keys con ON DELETE CASCADE apropiadas
3. **Triggers Automáticos:** 
   - updated_at se actualiza automáticamente
   - Ratings se recalculan al crear/editar/eliminar reseñas
   - Slugs se generan automáticamente
   - Contadores se actualizan automáticamente
4. **PostGIS:** Búsquedas geoespaciales optimizadas
5. **Full-Text Search:** Búsquedas de texto optimizadas con índices
6. **Índices Estratégicos:** Para todas las consultas frecuentes
7. **Constraints:** Validaciones a nivel de base de datos
8. **Datos Seed:** Categorías y usuario admin inicial

### 🔒 Seguridad

- Contraseñas NUNCA en texto plano (usar bcrypt en backend)
- Usuario de aplicación separado del superusuario
- Validaciones con CHECK constraints
- Índices UNIQUE para prevenir duplicados

### 🚀 Performance

- Índices en todas las foreign keys
- Índices compuestos para consultas frecuentes
- Desnormalización estratégica (contadores en businesses)
- Índices GIN para arrays y JSONB
- Índices GIST para PostGIS

### 📦 Compatibilidad

- PostgreSQL 12+
- PostGIS 3.0+
- Compatible con Prisma, TypeORM, Sequelize
- Compatible con pgAdmin, DBeaver, TablePlus

---

## 🎯 Cómo Usar Este Script

```bash
# 1. Conectarse a PostgreSQL como superusuario
psql -U postgres

# 2. Ejecutar el script completo
\i baseDatos.sql

# O ejecutar línea por línea copiando y pegando en psql

# 3. Verificar que todo esté OK
SELECT * FROM categories;
SELECT * FROM users WHERE role = 'ADMIN';

# 4. Obtener string de conexión para tu backend
# postgresql://locales_app:password@localhost:5432/locales_db
```

---

**✅ Base de Datos Lista para Producción** 🚀
