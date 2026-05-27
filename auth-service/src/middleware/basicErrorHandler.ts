import type { ErrorRequestHandler } from 'express';

export const basicErrorHandler: ErrorRequestHandler = (
  err,
  req,
  res,
  _next,
) => {
  const errorType = err instanceof Error ? err.name : 'UnknownError';
  const message = err instanceof Error ? err.message : String(err);

  res.status(500).json({
    method: req.method,
    path: req.originalUrl,
    errorType,
    statusCode: 500,
    message,
    errorCode: 'INTERNAL_ERROR',
  });
};
