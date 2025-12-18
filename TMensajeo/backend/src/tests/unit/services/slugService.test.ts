// ============================================
// SLUG SERVICE UNIT TESTS
// ============================================

import prisma from '../../../config/database';
import { generateSlug, generateUniqueBusinessSlug } from '../../../services/slugService';

describe('SlugService - generateSlug', () => {
  it('normalizes text into slug', () => {
    expect(generateSlug('Mi Negocio Bonito')).toBe('mi-negocio-bonito');
    expect(generateSlug('Café & Té!')).toBe('cafe-te');
    expect(generateSlug('   espacios   extras  ')).toBe('espacios-extras');
  });
});

describe('SlugService - generateUniqueBusinessSlug', () => {
  const spy = jest.spyOn(prisma.business, 'findUnique');

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns base slug when not taken', async () => {
    spy.mockResolvedValueOnce(null as any);
    const slug = await generateUniqueBusinessSlug('Mi Negocio');
    expect(slug).toBe('mi-negocio');
  });

  it('appends increment when taken', async () => {
    spy
      .mockResolvedValueOnce({ id: '1', slug: 'mi-negocio' } as any)
      .mockResolvedValueOnce(null as any);

    const slug = await generateUniqueBusinessSlug('Mi Negocio');
    expect(slug).toBe('mi-negocio-1');
  });
});
