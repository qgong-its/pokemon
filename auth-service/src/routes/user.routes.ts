import { Router } from 'express';

import {
  createUser,
  deleteUser,
  getUserById,
  getUsers,
  updateUser,
} from '#controllers';

import { validate } from '#middleware';
import {
  createUserZodSchema,
  updateUserZodSchema,
  userIdParamsZodSchema,
} from '#schemas';

const userRouter = Router();

userRouter
  .route('/')
  .get(getUsers)
  .post(validate(createUserZodSchema), createUser);

userRouter
  .route('/:id')
  .get(validate(userIdParamsZodSchema, 'params'), getUserById)
  .patch(
    validate(userIdParamsZodSchema, 'params'),
    validate(updateUserZodSchema),
    updateUser,
  )
  .delete(validate(userIdParamsZodSchema, 'params'), deleteUser);

export default userRouter;
