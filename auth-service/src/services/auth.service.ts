import { REFRESH_JWT_SECRET } from '#config';
import { UserModel } from '#models';
import type { TokenPayload } from '#types';
import { AppError, createAccessToken, verifyToken } from '#utils';

export const refreshAccessToken = async (refreshToken: string) => {
  const payload = verifyToken<TokenPayload>(refreshToken, REFRESH_JWT_SECRET);

  const user = await UserModel.findById(payload.sub);

  if (!user || !user.isActive) {
    throw new AppError(401, 'Invalid refresh token');
  }

  return createAccessToken(user._id.toString(), user.roles);
};
