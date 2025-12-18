// ============================================
// TEST CLOUDINARY - Script de prueba
// ============================================
// Ejecutar: node test-cloudinary.js
// Este script verifica que Cloudinary esté configurado correctamente

require('dotenv').config();
const cloudinary = require('cloudinary').v2;

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('🔍 Verificando configuración de Cloudinary...\n');

// Verificar credenciales
console.log('📋 Credenciales cargadas:');
console.log('   Cloud Name:', process.env.CLOUDINARY_CLOUD_NAME);
console.log('   API Key:', process.env.CLOUDINARY_API_KEY);
console.log('   API Secret:', process.env.CLOUDINARY_API_SECRET ? '✅ Configurado' : '❌ No configurado');
console.log('');

// Test de conexión
async function testCloudinary() {
  try {
    console.log('🧪 Probando conexión con Cloudinary...');
    
    // Obtener información de la cuenta
    const result = await cloudinary.api.ping();
    
    console.log('✅ Conexión exitosa!');
    console.log('📊 Estado:', result.status);
    console.log('');
    
    // Obtener uso de recursos
    const usage = await cloudinary.api.usage();
    console.log('📈 Uso de recursos:');
    console.log('   Plan:', usage.plan);
    console.log('   Créditos usados:', usage.credits.usage, '/', usage.credits.limit);
    console.log('   Almacenamiento:', (usage.storage.usage / 1024 / 1024).toFixed(2), 'MB');
    console.log('   Transformaciones:', usage.transformations.usage, '/', usage.transformations.limit);
    console.log('');
    
    console.log('🎉 Cloudinary está configurado correctamente!');
    console.log('');
    console.log('💡 Próximos pasos:');
    console.log('   1. Ya puedes subir imágenes desde tu backend');
    console.log('   2. Las imágenes se guardarán en la carpeta "locales/"');
    console.log('   3. Puedes ver tus imágenes en: https://console.cloudinary.com/console/media_library');
    
  } catch (error) {
    console.error('❌ Error al conectar con Cloudinary:');
    console.error('   Mensaje:', error.message);
    console.error('');
    console.error('🔧 Posibles soluciones:');
    console.error('   1. Verifica que las credenciales en .env sean correctas');
    console.error('   2. Asegúrate de que no haya espacios extra en las credenciales');
    console.error('   3. Verifica que tu cuenta de Cloudinary esté activa');
    console.error('');
    process.exit(1);
  }
}

// Ejecutar test
testCloudinary();
