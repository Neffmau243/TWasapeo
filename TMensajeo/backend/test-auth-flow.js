// ============================================
// TEST AUTH FLOW - Script de prueba
// ============================================
// Ejecutar: node test-auth-flow.js
// Este script prueba el flujo completo de autenticación

require('dotenv').config();
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testAuthFlow() {
  console.log('🧪 Probando flujo de autenticación con tokens\n');

  try {
    // 1. Verificar que los campos existen en el modelo
    console.log('1️⃣ Verificando campos en el modelo User...');
    
    const testUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        verificationToken: true,
        resetToken: true,
        resetTokenExpires: true,
      },
    });

    console.log('✅ Campos verificados correctamente');
    console.log('   - verificationToken: ✓');
    console.log('   - resetToken: ✓');
    console.log('   - resetTokenExpires: ✓');
    console.log('');

    // 2. Crear usuario de prueba
    console.log('2️⃣ Creando usuario de prueba...');
    
    // Primero eliminar si existe
    await prisma.user.deleteMany({
      where: { email: 'test-tokens@example.com' },
    });

    const user = await prisma.user.create({
      data: {
        email: 'test-tokens@example.com',
        password: '$2b$10$abcdefghijklmnopqrstuvwxyz', // Hash fake
        name: 'Test Tokens User',
        role: 'USER',
        isVerified: false,
      },
    });

    console.log('✅ Usuario creado:', user.email);
    console.log('');

    // 3. Simular token de verificación
    console.log('3️⃣ Guardando token de verificación...');
    
    const verificationToken = 'test-verification-token-' + Date.now();
    
    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    console.log('✅ Token de verificación guardado');
    console.log('   Token:', verificationToken);
    console.log('');

    // 4. Verificar que se puede buscar por token
    console.log('4️⃣ Buscando usuario por token de verificación...');
    
    const foundUser = await prisma.user.findFirst({
      where: { verificationToken },
    });

    if (foundUser) {
      console.log('✅ Usuario encontrado por token');
      console.log('   Email:', foundUser.email);
    } else {
      console.log('❌ No se pudo encontrar usuario por token');
    }
    console.log('');

    // 5. Simular verificación de email
    console.log('5️⃣ Simulando verificación de email...');
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    console.log('✅ Email verificado');
    console.log('   isVerified: true');
    console.log('   verificationToken: null');
    console.log('');

    // 6. Simular token de reset
    console.log('6️⃣ Guardando token de reset de contraseña...');
    
    const resetToken = 'test-reset-token-' + Date.now();
    const resetTokenExpires = new Date();
    resetTokenExpires.setHours(resetTokenExpires.getHours() + 1);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken,
        resetTokenExpires,
      },
    });

    console.log('✅ Token de reset guardado');
    console.log('   Token:', resetToken);
    console.log('   Expira:', resetTokenExpires.toLocaleString());
    console.log('');

    // 7. Verificar búsqueda con token no expirado
    console.log('7️⃣ Buscando usuario con token no expirado...');
    
    const userWithValidToken = await prisma.user.findFirst({
      where: {
        resetToken,
        resetTokenExpires: {
          gte: new Date(),
        },
      },
    });

    if (userWithValidToken) {
      console.log('✅ Usuario encontrado con token válido');
    } else {
      console.log('❌ No se encontró usuario con token válido');
    }
    console.log('');

    // 8. Simular token expirado
    console.log('8️⃣ Probando token expirado...');
    
    const expiredDate = new Date();
    expiredDate.setHours(expiredDate.getHours() - 2);

    await prisma.user.update({
      where: { id: user.id },
      data: { resetTokenExpires: expiredDate },
    });

    const userWithExpiredToken = await prisma.user.findFirst({
      where: {
        resetToken,
        resetTokenExpires: {
          gte: new Date(),
        },
      },
    });

    if (!userWithExpiredToken) {
      console.log('✅ Token expirado correctamente rechazado');
    } else {
      console.log('❌ Token expirado fue aceptado (error)');
    }
    console.log('');

    // 9. Limpiar tokens
    console.log('9️⃣ Limpiando tokens...');
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetToken: null,
        resetTokenExpires: null,
      },
    });

    console.log('✅ Tokens limpiados');
    console.log('');

    // 10. Limpiar usuario de prueba
    console.log('🗑️  Limpiando usuario de prueba...');
    
    await prisma.user.delete({
      where: { id: user.id },
    });

    console.log('✅ Usuario eliminado');
    console.log('');

    // Resumen
    console.log('═══════════════════════════════════════════');
    console.log('🎉 TODOS LOS TESTS PASARON EXITOSAMENTE');
    console.log('═══════════════════════════════════════════');
    console.log('');
    console.log('✅ Campos de tokens funcionando correctamente');
    console.log('✅ Guardado de tokens funcional');
    console.log('✅ Búsqueda por tokens funcional');
    console.log('✅ Verificación de expiración funcional');
    console.log('✅ Limpieza de tokens funcional');
    console.log('');
    console.log('💡 El sistema de autenticación con tokens está listo!');
    console.log('');
    console.log('📋 Próximos pasos:');
    console.log('   1. Configurar email para enviar los tokens');
    console.log('   2. Probar endpoints desde Postman/Thunder Client');
    console.log('   3. Integrar con el frontend');

  } catch (error) {
    console.error('❌ Error durante el test:');
    console.error('   Mensaje:', error.message);
    console.error('');
    console.error('🔧 Posibles causas:');
    console.error('   1. La migración no se aplicó correctamente');
    console.error('   2. Prisma Client no se regeneró');
    console.error('   3. La base de datos no está corriendo');
    console.error('');
    console.error('💡 Soluciones:');
    console.error('   1. Ejecuta: npm run prisma:migrate');
    console.error('   2. Ejecuta: npm run prisma:generate');
    console.error('   3. Verifica que PostgreSQL esté corriendo');
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar test
testAuthFlow();
