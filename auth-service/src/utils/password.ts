import bcrypt from 'bcrypt';
import { SALT_ROUNDS } from '#config';

export const salt = await bcrypt.genSalt(SALT_ROUNDS);

export const hashPassword = async (password: string) =>
  bcrypt.hash(password, salt);

export const comparePassword = async (
  password: string,
  hashedPassword: string,
) => bcrypt.compare(password, hashedPassword);
