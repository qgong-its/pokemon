import express from 'express';
import cookieParser from 'cookie-parser';

import { PORT } from '#config';
import connectDB from '#db';
import { authRouter, userRouter } from '#routes';
import {
  corsHandler,
  basicErrorHandler,
  extendedErrorHandler,
} from '#middleware';

const app = express();

app.use(corsHandler);
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/users', userRouter);

app.use((_req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// application-level
app.use(extendedErrorHandler);
app.use(basicErrorHandler);

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () =>
      console.log(
        `\x1b[34mMain app listening at http://localhost:${PORT}\x1b[0m`,
      ),
    );
  } catch (error: unknown) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
