// ============================================
// SWAGGER CONFIGURATION
// ============================================
// Configuración de Swagger para documentación de API
// Acceso: http://localhost:3000/api-docs

import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Locales API',
      version: '1.0.0',
      description: 'API REST para plataforma de descubrimiento de negocios locales',
      contact: {
        name: 'API Support',
        email: 'support@locales.com',
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desarrollo',
      },
      {
        url: 'https://api.locales.com',
        description: 'Servidor de producción',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Ingresa tu token JWT',
        },
      },
      schemas: {
        // User
        User: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            email: { type: 'string', format: 'email' },
            name: { type: 'string' },
            phone: { type: 'string', nullable: true },
            avatar: { type: 'string', nullable: true },
            role: { type: 'string', enum: ['USER', 'OWNER', 'ADMIN'] },
            isVerified: { type: 'boolean' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Business
        Business: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            categoryId: { type: 'string', format: 'uuid' },
            address: { type: 'string' },
            city: { type: 'string' },
            state: { type: 'string' },
            zipCode: { type: 'string', nullable: true },
            latitude: { type: 'number', format: 'float' },
            longitude: { type: 'number', format: 'float' },
            phone: { type: 'string' },
            email: { type: 'string', format: 'email', nullable: true },
            website: { type: 'string', nullable: true },
            whatsapp: { type: 'string', nullable: true },
            facebook: { type: 'string', nullable: true },
            instagram: { type: 'string', nullable: true },
            schedule: { type: 'object' },
            logo: { type: 'string', nullable: true },
            coverImage: { type: 'string', nullable: true },
            status: { type: 'string', enum: ['PENDING', 'APPROVED', 'REJECTED', 'INACTIVE'] },
            isVerified: { type: 'boolean' },
            isPremium: { type: 'boolean' },
            viewCount: { type: 'integer' },
            favoriteCount: { type: 'integer' },
            reviewCount: { type: 'integer' },
            averageRating: { type: 'number', format: 'float' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
          },
        },
        // Review
        Review: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            helpfulCount: { type: 'integer' },
            isEdited: { type: 'boolean' },
            ownerReply: { type: 'string', nullable: true },
            ownerReplyDate: { type: 'string', format: 'date-time', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            userId: { type: 'string', format: 'uuid' },
            businessId: { type: 'string', format: 'uuid' },
          },
        },
        // Category
        Category: {
          type: 'object',
          properties: {
            id: { type: 'string', format: 'uuid' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string', nullable: true },
            icon: { type: 'string', nullable: true },
            color: { type: 'string', nullable: true },
            order: { type: 'integer' },
          },
        },
        // Error Response
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
        // Success Response
        Success: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            message: { type: 'string' },
            data: { type: 'object' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Autenticación y registro' },
      { name: 'User', description: 'Gestión de usuarios' },
      { name: 'Business', description: 'Gestión de negocios' },
      { name: 'Review', description: 'Reseñas y calificaciones' },
      { name: 'Category', description: 'Categorías de negocios' },
      { name: 'Event', description: 'Eventos de negocios' },
      { name: 'FAQ', description: 'Preguntas frecuentes' },
      { name: 'Owner', description: 'Panel de dueños' },
      { name: 'Admin', description: 'Panel de administración' },
      { name: 'Search', description: 'Búsqueda y filtros' },
      { name: 'Public', description: 'Endpoints públicos' },
      { name: 'Upload', description: 'Subida de imágenes' },
    ],
  },
  apis: ['./src/routes/*.ts', './src/controllers/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
