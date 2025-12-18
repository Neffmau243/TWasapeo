// ============================================
// EXPRESS TYPES EXTENSION
// ============================================
// Extender tipos de Express para agregar req.user

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};
