import type { RequestHandler } from 'express';

import { UserModel } from '#models';
import type {
  UserIdParamsZodDTO,
  CreateUserZodDTO,
  UpdateUserZodDTO,
} from '#schemas';
import { AppError } from '#utils';
import { assertUserExists, assertUserEmailAvailable } from '#services';

export const getUsers: RequestHandler = async (_req, res, next) => {
  try {
    const users = await UserModel.find();

    res.json(users);
  } catch (error: unknown) {
    next(error);
  }
};

export const getUserById: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as UserIdParamsZodDTO;
    const user = await assertUserExists(id);

    res.json(user);
  } catch (error: unknown) {
    next(error);
  }
};

export const createUser: RequestHandler = async (req, res, next) => {
  try {
    const data = req.body as CreateUserZodDTO;

    await assertUserEmailAvailable(data.email);

    const user = await UserModel.create(data);

    res.status(201).json(user);
  } catch (error: unknown) {
    next(error);
  }
};

export const updateUser: RequestHandler = async (req, res, next) => {
  try {
    const { id } = req.params as UserIdParamsZodDTO;
    const data = req.body as UpdateUserZodDTO;

    if (data.email) {
      await assertUserEmailAvailable(data.email);
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
    const { id } = req.params as UserIdParamsZodDTO;
    const user = await UserModel.findByIdAndDelete(id);

    if (!user) {
      throw new AppError(404, `User: ${id} not found`, 'NO_USER', 'WARN');
    }

    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};
