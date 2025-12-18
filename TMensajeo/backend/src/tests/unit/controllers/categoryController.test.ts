// ============================================
// CATEGORY CONTROLLER UNIT TESTS
// ============================================

import prisma from '../../../config/database';
import { getAllCategories } from '../../../controllers/categoryController';

const mockRes = () => {
  const res: any = {};
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

describe('CategoryController - getAllCategories', () => {
  it('returns ordered categories with counts', async () => {
    jest.spyOn(prisma.category, 'findMany').mockResolvedValueOnce([
      {
        id: '1',
        name: 'Comida',
        slug: 'comida',
        icon: '🍔',
        order: 1,
        description: null,
        color: '#000',
        _count: { businesses: 3 },
      },
    ] as any);

    const req: any = { };
    const res = mockRes();

    await getAllCategories(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({ success: true, data: expect.any(Array) })
    );
  });
});
