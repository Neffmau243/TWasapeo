// ============================================
// SEED - DATOS INICIALES
// ============================================
// Este archivo puebla la base de datos con datos iniciales:
// - Usuario administrador
// - Categorías de negocios
// Ejecutar con: npm run prisma:seed

// Cargar variables de entorno PRIMERO
import * as dotenv from 'dotenv';
dotenv.config();

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando seed...');

  // ============================================
  // CREAR USUARIO ADMINISTRADOR
  // ============================================
  const adminPassword = await bcrypt.hash('admin123', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@locales.com' },
    update: {},
    create: {
      email: 'admin@locales.com',
      password: adminPassword,
      name: 'Administrador',
      role: 'ADMIN',
      isVerified: true,
    },
  });

  console.log('✅ Admin creado:', admin.email);

  // ============================================
  // CREAR USUARIO OWNER (DUEÑO)
  // ============================================
  const ownerPassword = await bcrypt.hash('owner123', 10);

  const owner = await prisma.user.upsert({
    where: { email: 'owner@locales.com' },
    update: {},
    create: {
      email: 'owner@locales.com',
      password: ownerPassword,
      name: 'Dueño de Negocio',
      role: 'OWNER',
      isVerified: true,
    },
  });

  console.log('✅ Owner creado:', owner.email);

  // ============================================
  // CREAR CATEGORÍAS
  // ============================================
  const categories = [
    { name: 'Restaurantes', slug: 'restaurantes', icon: '🍽️', color: '#FF6B6B', order: 1 },
    { name: 'Cafeterías', slug: 'cafeterias', icon: '☕', color: '#8B4513', order: 2 },
    { name: 'Tiendas', slug: 'tiendas', icon: '🛍️', color: '#4ECDC4', order: 3 },
    { name: 'Servicios', slug: 'servicios', icon: '🔧', color: '#95E1D3', order: 4 },
    { name: 'Entretenimiento', slug: 'entretenimiento', icon: '🎮', color: '#F38181', order: 5 },
    { name: 'Salud', slug: 'salud', icon: '🏥', color: '#AA96DA', order: 6 },
    { name: 'Educación', slug: 'educacion', icon: '📚', color: '#FCBAD3', order: 7 },
    { name: 'Belleza', slug: 'belleza', icon: '💄', color: '#FFFFD2', order: 8 },
    { name: 'Deportes', slug: 'deportes', icon: '⚽', color: '#A8D8EA', order: 9 },
    { name: 'Tecnología', slug: 'tecnologia', icon: '💻', color: '#AA96DA', order: 10 },
  ];

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    });
  }

  console.log('✅ Categorías creadas:', categories.length);

  console.log('🎉 Seed completado exitosamente!');
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
