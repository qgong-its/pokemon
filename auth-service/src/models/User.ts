import { model } from 'mongoose';
import type { UserType } from '#types';
import { userSchema } from './user.schema.ts';

export const UserModel = model<UserType>('User', userSchema);
