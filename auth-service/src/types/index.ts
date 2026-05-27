import type { Types } from 'mongoose';

export type UserType = {
  name: string;
  email: string;
  password: string;
  isActive?: boolean;
  userId?: Types.ObjectId;
};
