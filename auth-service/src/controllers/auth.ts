import type { RequestHandler } from 'express';

import { UserModel } from '#models';
import { loginZodSchema } from '#schemas';
import {
  AppError,
  comparePassword,
  createAccessToken,
  createRefreshToken,
  getCookieOpts,
  verifyToken,
} from '#utils';
import { assertUserExists } from '#services';
import { REFRESH_JWT_SECRET, REFRESH_TOKEN_TTL } from '#config';
import type { TokenPayload } from '#types';

export const login: RequestHandler = async (req, res, next) => {
  try {
    const { email, password } = loginZodSchema.parse(req.body);

    const user = await UserModel.findOne({ email, isActive: true }).select(
      '+password',
    );

    if (!user) {
      throw new AppError(
        401,
        `Invalid email or password`,
        'INVALID_CREDENTIALS',
        'WARN',
      );
    }

    const isPasswordValid = await comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        401,
        'Invalid email or password',
        'INVALID_CREDENTIALS',
        'WARN',
      );
    }

    const accessToken = createAccessToken(user.id, user.roles);

    const refreshToken = createRefreshToken(user.id);

    res.cookie('accessToken', accessToken, getCookieOpts());
    res.cookie('refreshToken', refreshToken, {
      ...getCookieOpts(),
      expires: new Date(Date.now() + REFRESH_TOKEN_TTL * 1000),
    });

    res.status(200).json(user);
  } catch (error: unknown) {
    next(error);
  }
};

export const logout: RequestHandler = (req, res, next) => {
  try {
    res.clearCookie('accessToken', {
      ...getCookieOpts(),
    });

    res.clearCookie('refreshToken', {
      ...getCookieOpts(),
    });

    res.status(204).send();
  } catch (error: unknown) {
    next(error);
  }
};

export const refresh: RequestHandler = async (req, res, next) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new AppError(
        401,
        'Missing refresh token',
        'NO_REFRESH_TOKEN',
        'WARN',
      );
    }

    const payLoad = verifyToken<TokenPayload>(refreshToken, REFRESH_JWT_SECRET);

    if (!payLoad.sub) {
      throw new AppError(
        401,
        'Missing refresh token',
        'NO_REFRESH_TOKEN',
        'WARN',
      );
    }

    const user = await assertUserExists(payLoad.sub);

    if (!user.isActive) {
      throw new AppError(
        401,
        'Invalid refresh token',
        'INVALID_REFRESH_TOKEN',
        'WARN',
      );
    }

    const accessToken = createAccessToken(user.id, user.roles);

    res.cookie('accessToken', accessToken, getCookieOpts());

    res.status(200).json(user);
  } catch (error: unknown) {
    next(error);
  }
};
