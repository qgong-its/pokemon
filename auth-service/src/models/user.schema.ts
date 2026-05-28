import type { User } from '#types';
import { Schema } from 'mongoose';

export const userSchema = new Schema<User>(
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
      lowercase:true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      select: false, // exclude sensitive fields
      minlength: [8, 'Password must be at least 8 characters long'],
    },
    roles: {
      type: [String],
      default: ['user'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    pokemonIds: {
      type: [Number],
      default: [],
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
