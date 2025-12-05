import express from 'express';

import { PORT } from './config';
import connectDb from './db';
import log from './log';
import addUserToRequest from './middlewares/addUserToRequest';
import errorHandlers from './middlewares/errorHandlers';
import router from './routes';

const app = express();

app.use(express.json());

app.use(addUserToRequest);
app.use(router);

app.use(errorHandlers);

connectDb().then(() => {
  app.listen(PORT, () => {
    log('Server started on PORT:', `http://localhost:${PORT}`);
  });
}).catch((error) => {
  log('Error connecting to database:', error);
  throw new Error('Failed to connect to database');
});
