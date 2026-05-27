import cors from 'cors';

const allowedOrigins =
  process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL?.split(',') ?? [])
    : ['http://localhost:5173'];

export const corsHandler = cors({
  origin:
    allowedOrigins.length > 0
      ? allowedOrigins
      : process.env.NODE_ENV === 'production'
        ? false
        : true,
  credentials: true,
});
