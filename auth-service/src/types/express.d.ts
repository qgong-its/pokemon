import type { Role } from '#types';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        roles: Role[];
      };
    }
  }
}

export {};
