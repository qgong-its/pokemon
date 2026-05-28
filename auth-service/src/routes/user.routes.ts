import { Router } from 'express';

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '#controllers';

import { authRole, authToken, validate } from '#middleware';
import {
  createUserZodSchema,
  updateUserZodSchema,
  userIdParamsZodSchema,
} from '#schemas';

const userRouter = Router();

userRouter
  .route('/')
  .get(authToken, authRole('admin'), getUsers)
  .post(validate(createUserZodSchema), createUser);

userRouter
  .route('/:id')
  .get(validate(userIdParamsZodSchema, 'params'), authToken, getUserById)
  .patch(
    validate(userIdParamsZodSchema, 'params'),
    authToken,
    validate(updateUserZodSchema),
    updateUser,
  )
  .delete(validate(userIdParamsZodSchema, 'params'), authToken, deleteUser);

export default userRouter;
