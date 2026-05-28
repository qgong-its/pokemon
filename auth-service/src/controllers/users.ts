import type { RequestHandler } from 'express';

import { UserModel } from '#models';
import {
  userIdParamsZodSchema,
  createUserZodSchema,
  updateUserZodSchema,
} from '#schemas';
import {
  AppError,
  createAccessToken,
  createRefreshToken,
  getCookieOpts,
  hashPassword,
} from '#utils';
import { assertUserExists, assertUserEmailAvailable } from '#services';
import { REFRESH_TOKEN_TTL } from '#config';

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await UserModel.find();

    res.json(users);
  } catch (error: unknown) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = createUserZodSchema.parse(req.body);
    const { password, ...userData } = data;

    await assertUserEmailAvailable(data.email);

    const hashedPassword = await hashPassword(password);

    const user = await UserModel.create({
      ...userData,
      password: hashedPassword,
    });

    const accessToken = createAccessToken(user.id, user.roles);

    const refreshToken = createRefreshToken(user.id);

    res.cookie('accessToken', accessToken, getCookieOpts());
    res.cookie('refreshToken', refreshToken, {
      ...getCookieOpts(),
      expires: new Date(Date.now() + REFRESH_TOKEN_TTL * 1000),
    });

    res.status(201).json(user);
  } catch (error: unknown) {
    next(error);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = userIdParamsZodSchema.parse(req.params);
    const user = await assertUserExists(id);

    res.json(user);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = userIdParamsZodSchema.parse(req.params);
    const data = updateUserZodSchema.parse(req.body);

    if (data.email) {
      await assertUserEmailAvailable(data.email);
    }

    if (data.password) {
      data.password = await hashPassword(data.password);
    }

    const user = await UserModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      throw new AppError(404, `User: ${id} not found`, 'NO_USER', 'WARN');
    }

    res.json(user);
  } catch (error: unknown) {
    next(error);
  }
};

export const deleteUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = userIdParamsZodSchema.parse(req.params);
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      throw new AppError(404, `User: ${id} not found`, 'NO_USER', 'WARN');
    }

    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};
