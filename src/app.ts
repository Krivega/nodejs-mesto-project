import cookieParser from 'cookie-parser';
import express from 'express';

import { PORT } from './config';
import connectDb from './db';
import log from './log';
import auth from './middlewares/auth';
import errorHandlers from './middlewares/errorHandlers';
import { requestLogger, errorLogger } from './middlewares/logger';
import authRouter from './routes/auth';
import crashTestRouter from './routes/crashTest';
import authorizedRouter from './routes/authorizedRouter';

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use(requestLogger);
app.use(crashTestRouter);
app.use(authRouter);

app.use(auth, authorizedRouter);

app.use(errorLogger);
app.use(errorHandlers);

connectDb().then(() => {
  app.listen(PORT, () => {
    log('Server started on PORT:', `http://localhost:${PORT}`);
  });
}).catch((error) => {
  log('Error connecting to database:', error);
  throw new Error('Failed to connect to database');
});
