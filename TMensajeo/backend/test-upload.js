// ============================================
// TEST UPLOAD - Script para probar subida de imágenes
// ============================================
// Ejecutar: node test-upload.js
// Este script sube una imagen de prueba a Cloudinary

require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const fs = require('fs');
const path = require('path');

// Configurar Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

console.log('📤 Test de subida de imagen a Cloudinary\n');

// Crear una imagen de prueba simple (1x1 pixel PNG)
const testImageBase64 = 'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
const testImagePath = path.join(__dirname, 'test-image.png');

async function testUpload() {
  try {
    // Crear archivo temporal
    fs.writeFileSync(testImagePath, Buffer.from(testImageBase64, 'base64'));
    console.log('✅ Imagen de prueba creada');
    
    console.log('📤 Subiendo imagen a Cloudinary...');
    
    // Subir imagen
    const result = await cloudinary.uploader.upload(testImagePath, {
      folder: 'locales/test',
      transformation: [
        { width: 800, height: 600, crop: 'limit' },
        { quality: 'auto' },
        { fetch_format: 'auto' }
      ]
    });
    
    console.log('✅ Imagen subida exitosamente!\n');
    console.log('📋 Detalles de la imagen:');
    console.log('   URL:', result.secure_url);
    console.log('   Public ID:', result.public_id);
    console.log('   Formato:', result.format);
    console.log('   Tamaño:', result.bytes, 'bytes');
    console.log('   Dimensiones:', result.width, 'x', result.height);
    console.log('');
    
    // Eliminar imagen de prueba
    console.log('🗑️  Eliminando imagen de prueba...');
    await cloudinary.uploader.destroy(result.public_id);
    console.log('✅ Imagen eliminada de Cloudinary');
    
    // Eliminar archivo temporal
    fs.unlinkSync(testImagePath);
    console.log('✅ Archivo temporal eliminado');
    console.log('');
    
    console.log('🎉 Test completado exitosamente!');
    console.log('💡 Tu backend ya puede subir y eliminar imágenes en Cloudinary');
    
  } catch (error) {
    console.error('❌ Error durante el test:');
    console.error('   Mensaje:', error.message);
    console.error('');
    
    // Limpiar archivo temporal si existe
    if (fs.existsSync(testImagePath)) {
      fs.unlinkSync(testImagePath);
    }
    
    process.exit(1);
  }
}

// Ejecutar test
testUpload();
