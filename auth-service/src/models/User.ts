import { model } from 'mongoose';
import type { User } from '#types';
import { userSchema } from './user.schema.ts';

export const UserModel = model<User>('User', userSchema);
