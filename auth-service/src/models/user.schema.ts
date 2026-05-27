import type { UserType } from '#types';
import { Schema } from 'mongoose';

export const userSchema = new Schema<UserType>(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // exclude sensitive fields
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.set('toJSON', {
  transform: (_doc, ret) => {
    const response = ret as {
      _id?: { toString: () => string };
      id?: string;
      __v?: number;
    };

    response.id = response._id?.toString();

    delete response._id;
    delete response.__v;

    return ret;
  },
});
