// ============================================
// TEST ALL ENDPOINTS
// ============================================
// Script para probar todos los endpoints del backend

const BASE_URL = 'http://localhost:3000';

const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

// Contador de tests
let passed = 0;
let failed = 0;
const results = [];

// Función auxiliar para hacer requests
async function testEndpoint(method, path, description, options = {}) {
  try {
    const url = `${BASE_URL}${path}`;
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      ...(options.body ? { body: JSON.stringify(options.body) } : {}),
    });

    const expectedStatus = options.expectedStatus || 200;
    const isSuccess = 
      (Array.isArray(expectedStatus) && expectedStatus.includes(response.status)) ||
      response.status === expectedStatus;

    if (isSuccess) {
      console.log(`${colors.green}✓${colors.reset} ${method} ${path} - ${description}`);
      passed++;
      results.push({ status: 'PASS', method, path, description });
    } else {
      console.log(`${colors.red}✗${colors.reset} ${method} ${path} - ${description} (${response.status})`);
      failed++;
      results.push({ status: 'FAIL', method, path, description, actualStatus: response.status });
    }

    return { status: response.status, ok: isSuccess };
  } catch (error) {
    console.log(`${colors.red}✗${colors.reset} ${method} ${path} - ${description} (Error: ${error.message})`);
    failed++;
    results.push({ status: 'ERROR', method, path, description, error: error.message });
    return { status: 'error', ok: false };
  }
}

// Función principal
async function runTests() {
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}🧪 TESTING ALL ENDPOINTS${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // ============================================
  // 1. HEALTH CHECK
  // ============================================
  console.log(`${colors.yellow}\n📍 Health Check${colors.reset}`);
  await testEndpoint('GET', '/health', 'Health check');

  // ============================================
  // 2. PUBLIC ENDPOINTS
  // ============================================
  console.log(`${colors.yellow}\n🌐 Public Endpoints${colors.reset}`);
  await testEndpoint('GET', '/api/public/homepage', 'Homepage data');
  await testEndpoint('GET', '/api/public/categories', 'All categories');
  await testEndpoint('GET', '/api/public/top-rated', 'Top rated businesses');
  await testEndpoint('GET', '/api/public/recent', 'Recent businesses');
  await testEndpoint('GET', '/api/public/popular', 'Popular businesses');

  // ============================================
  // 3. SEARCH ENDPOINTS
  // ============================================
  console.log(`${colors.yellow}\n🔍 Search Endpoints${colors.reset}`);
  await testEndpoint('GET', '/api/search?q=test', 'Search businesses');
  await testEndpoint('GET', '/api/search/autocomplete?q=te', 'Autocomplete');
  await testEndpoint('GET', '/api/search/filters', 'Available filters');

  // ============================================
  // 4. CATEGORIES (PUBLIC READ)
  // ============================================
  console.log(`${colors.yellow}\n📂 Category Endpoints${colors.reset}`);
  await testEndpoint('GET', '/api/categories', 'Get all categories');

  // ============================================
  // 5. AUTH ENDPOINTS (sin autenticación)
  // ============================================
  console.log(`${colors.yellow}\n🔐 Auth Endpoints (Public)${colors.reset}`);
  await testEndpoint('POST', '/api/auth/register', 'Register (missing data)', {
    expectedStatus: 400,
    body: {},
  });
  await testEndpoint('POST', '/api/auth/login', 'Login (missing credentials)', {
    expectedStatus: 400,
    body: {},
  });
  await testEndpoint('POST', '/api/auth/refresh', 'Refresh token (no token)', {
    expectedStatus: 401,
    body: {},
  });
  await testEndpoint('POST', '/api/auth/forgot-password', 'Forgot password (missing email)', {
    expectedStatus: 400,
    body: {},
  });

  // ============================================
  // 6. PROTECTED ENDPOINTS (sin token - deben fallar con 401)
  // ============================================
  console.log(`${colors.yellow}\n🔒 Protected Endpoints (Should require auth)${colors.reset}`);
  await testEndpoint('GET', '/api/user/profile', 'Get profile (no auth)', {
    expectedStatus: 401,
  });
  await testEndpoint('GET', '/api/user/favorites', 'Get favorites (no auth)', {
    expectedStatus: 401,
  });
  await testEndpoint('GET', '/api/owner/businesses', 'Get my businesses (no auth)', {
    expectedStatus: 401,
  });
  await testEndpoint('GET', '/api/admin/pending', 'Get pending businesses (no auth)', {
    expectedStatus: 401,
  });

  // ============================================
  // 7. BUSINESS ENDPOINTS (PUBLIC)
  // ============================================
  console.log(`${colors.yellow}\n🏢 Business Endpoints (Public)${colors.reset}`);
  await testEndpoint('GET', '/api/businesses', 'Get all businesses');
  await testEndpoint('GET', '/api/businesses/public', 'Get public businesses');
  await testEndpoint('GET', '/api/businesses/featured', 'Get featured businesses');

  // ============================================
  // 8. REVIEW ENDPOINTS (GET público, POST protegido)
  // ============================================
  console.log(`${colors.yellow}\n⭐ Review Endpoints${colors.reset}`);
  await testEndpoint('GET', '/api/reviews/business/test-id', 'Get reviews (404 expected)', {
    expectedStatus: [200, 404],
  });
  await testEndpoint('POST', '/api/reviews', 'Create review (no auth)', {
    expectedStatus: 401,
    body: {},
  });

  // ============================================
  // 9. UPLOAD ENDPOINTS (protegidos)
  // ============================================
  console.log(`${colors.yellow}\n📸 Upload Endpoints (Should require auth)${colors.reset}`);
  await testEndpoint('POST', '/api/upload/avatar', 'Upload avatar (no auth)', {
    expectedStatus: 401,
  });
  await testEndpoint('DELETE', '/api/upload/avatar', 'Delete avatar (no auth)', {
    expectedStatus: 401,
  });

  // ============================================
  // 10. API DOCS
  // ============================================
  console.log(`${colors.yellow}\n📚 Documentation${colors.reset}`);
  await testEndpoint('GET', '/api-docs.json', 'Swagger JSON');

  // ============================================
  // RESUMEN
  // ============================================
  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}`);
  console.log(`${colors.blue}📊 RESULTS${colors.reset}`);
  console.log(`${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  console.log(`${colors.green}✓ Passed:${colors.reset} ${passed}`);
  console.log(`${colors.red}✗ Failed:${colors.reset} ${failed}`);
  console.log(`${colors.yellow}📝 Total:${colors.reset} ${passed + failed}\n`);

  const successRate = ((passed / (passed + failed)) * 100).toFixed(2);
  console.log(`${colors.blue}Success Rate: ${successRate}%${colors.reset}\n`);

  if (failed > 0) {
    console.log(`${colors.red}Failed Tests:${colors.reset}`);
    results
      .filter(r => r.status !== 'PASS')
      .forEach(r => {
        console.log(`  - ${r.method} ${r.path}: ${r.description}`);
        if (r.actualStatus) console.log(`    Status: ${r.actualStatus}`);
        if (r.error) console.log(`    Error: ${r.error}`);
      });
  }

  console.log(`\n${colors.blue}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${colors.reset}\n`);

  // Exit code
  process.exit(failed > 0 ? 1 : 0);
}

// Ejecutar tests
runTests().catch(error => {
  console.error(`${colors.red}Fatal error:${colors.reset}`, error);
  process.exit(1);
});
