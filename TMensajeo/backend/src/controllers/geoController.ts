// ============================================
// GEO CONTROLLER
// ============================================
// Controlador de búsqueda geoespacial
// Maneja: búsqueda por ubicación, negocios cercanos

import { Request, Response } from 'express';

export const searchNearby = async (req: Request, res: Response) => {
  res.status(501).json({ message: 'Por implementar' });
};
