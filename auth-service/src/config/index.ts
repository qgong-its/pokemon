import { z } from 'zod';

const envZodSchema = z.object({
  MONGO_URI: z.string().min(1),

  DB_NAME: z.string().default('pokemon'),

  ACCESS_JWT_SECRET: z.string().min(64),
  ACCESS_TOKEN_TTL: z.coerce.number().default(15 * 60),

  REFRESH_JWT_SECRET: z.string().min(64),
  REFRESH_TOKEN_TTL: z.coerce.number().default(30 * 24 * 60 * 60),

  SALT_ROUNDS: z.coerce.number().int().min(10).default(13),

  CLIENT_BASE_URL: z.url().default('http://localhost:5173'),

  PORT: z.coerce.number().int().default(3000),
});

const parsedEnv = envZodSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.error(
    '❌ Invalid environment variables:\n',
    z.prettifyError(parsedEnv.error),
  );
  process.exit(1);
}

export const {
  MONGO_URI,
  DB_NAME,
  ACCESS_JWT_SECRET,
  ACCESS_TOKEN_TTL,
  REFRESH_JWT_SECRET,
  REFRESH_TOKEN_TTL,
  SALT_ROUNDS,
  CLIENT_BASE_URL,
  PORT,
} = parsedEnv.data;
