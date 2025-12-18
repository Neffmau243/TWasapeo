// ============================================
// PUBLIC ENDPOINTS INTEGRATION TESTS
// ============================================

import request from 'supertest';
import app from '../../app';
import prisma from '../../config/database';

describe('Public endpoints', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('GET /health returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('status', 'ok');
  });

  it('GET /api/public/top-rated returns list', async () => {
    jest.spyOn(prisma.business, 'findMany').mockResolvedValueOnce([
      {
        id: 'b1',
        name: 'Pizza Top',
        slug: 'pizza-top',
        description: 'Deliciosa',
        city: 'Lima',
        address: 'Av. Siempre Viva 123',
        averageRating: 4.8,
        reviewCount: 25,
        viewCount: 1000,
        category: { id: 'c1', name: 'Comida', slug: 'comida', icon: '🍕' },
      },
    ] as any);

    const res = await request(app).get('/api/public/top-rated');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data.businesses)).toBe(true);
    expect(res.body.data.businesses[0]).toHaveProperty('name', 'Pizza Top');
  });
});
