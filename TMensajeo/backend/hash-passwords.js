// Script para generar hashes de contraseñas con bcrypt
const bcrypt = require('bcrypt');

async function generateHash(password) {
  const hash = await bcrypt.hash(password, 10);
  return hash;
}

async function main() {
  const password = '12345678';
  const hash = await generateHash(password);
  
  console.log('\n=================================');
  console.log('PASSWORD HASH GENERATOR');
  console.log('=================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('=================================\n');
  console.log('SQL para actualizar usuarios:');
  console.log('=================================\n');
  
  console.log(`-- Actualizar contraseña hasheada para todos los usuarios de prueba`);
  console.log(`UPDATE users SET password = '${hash}' WHERE email IN ('user@test.com', 'owner@test.com', 'admin@test.com');\n`);
}

main();
