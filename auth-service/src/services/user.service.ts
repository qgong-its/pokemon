import { UserModel } from '#models';
import { AppError } from '#utils';

export const assertUserExists = async (userId: string) => {
  const user = await UserModel.findById(userId);

  if (!user) {
    throw new AppError(404, `User: ${userId} not found`, 'NO_USER', 'WARN');
  }

  return user;
};

export const assertUserEmailAvailable = async (
  email: string,
  excludeId?: string,
) => {
  const found = await UserModel.findOne({
    email,
    ...(excludeId && {
      _id: { $ne: excludeId },
    }),
  });

  if (found) {
    throw new AppError(
      400,
      `Email: ${email} already exists`,
      'EXISTED_EMAIL',
      'WARN',
    );
  }
};
