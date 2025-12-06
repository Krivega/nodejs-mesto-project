import type { NextFunction, Request, Response } from 'express';
import { verify } from '../controllers/auth';
import { setAuthenticatedUserIdToReq } from '../controllers/userId';
import UnauthorizedError from '../errors/UnauthorizedError';

const auth = (req: Request, _res: Response, next: NextFunction): void => {
  const payload = verify(req);

  if (
    payload === undefined
    || typeof payload === 'string'
    || !('userId' in payload)
    || typeof payload.userId !== 'string'
  ) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  setAuthenticatedUserIdToReq(req, payload);

  next();
};

export default auth;
