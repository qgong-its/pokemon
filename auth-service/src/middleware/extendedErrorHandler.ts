import type { ErrorRequestHandler } from 'express';

import { AppError, writeLog } from '#utils';

export const extendedErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  next,
) => {
  if (!(err instanceof AppError)) {
    next(err);
    return;
  }

  writeLog(
    err.logLevel,
    `${req.method} | ${req.originalUrl} | AppError | ${err.statusCode} | ${err.message} | ${err.errorCode}`,
  );

  res.status(err.statusCode).json({
    method: req.method,
    path: req.originalUrl,
    errorType: 'AppError',
    statusCode: err.statusCode,
    message: err.message,
    errorCode: err.errorCode,
    stack:
      process.env.NODE_ENV === 'development' && err instanceof Error
        ? err.stack?.split('\n').map((line) => line.trim())
        : undefined,
  });
};
