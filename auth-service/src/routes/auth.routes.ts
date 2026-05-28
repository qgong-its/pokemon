import { Router } from 'express';

import { validate } from '#middleware';
import { loginZodSchema } from '#schemas';
import { login, logout, refresh } from '#controllers';

const authRouter = Router();

authRouter.post('/login', validate(loginZodSchema), login);
authRouter.post('/logout', logout);
authRouter.post('/refresh', refresh);

export default authRouter;
