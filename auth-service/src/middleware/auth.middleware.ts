import type { RequestHandler } from 'express';

import { AppError, parseAccessToken } from '#utils';
import type { Role } from '#types';

export const authToken: RequestHandler = (req, _res, next) => {
  try {
    req.user = parseAccessToken(req.headers.authorization);

    next();
  } catch (error) {
    next(error);
  }
};

export const authRole = (...allowedRoles: Role[]): RequestHandler => {
  return (req, _res, next) => {
    if (!req.user) {
      return next(new AppError(401, 'Unauthorized', 'UNAUTHORIZED', 'WARN'));
    }

    const hasRole = req.user.roles.some((role) => allowedRoles.includes(role));

    if (!hasRole) {
      return next(new AppError(403, 'Forbidden', 'FORBIDDEN', 'WARN'));
    }

    next();
  };
};
