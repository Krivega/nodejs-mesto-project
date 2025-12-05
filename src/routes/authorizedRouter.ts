import { Router } from 'express';

import cardsRouter from './cards';
import usersRouter from './users';

const authorizedRouter = Router();

authorizedRouter.use('/users', usersRouter);
authorizedRouter.use('/cards', cardsRouter);

export default authorizedRouter;
