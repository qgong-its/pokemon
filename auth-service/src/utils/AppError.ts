import type { LogLevel } from '#utils';

export class AppError extends Error {
  statusCode: number;
  errorCode: string;
  logLevel: LogLevel;

  constructor(
    statusCode: number,
    message: string,
    errorCode = 'APP_ERROR',
    logLevel: LogLevel = (process.env.LOG_LEVEL as LogLevel) || 'ERROR',
  ) {
    super(message);

    this.name = 'AppError';
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.logLevel = logLevel;

    Error.captureStackTrace(this, this.constructor);
  }
}
