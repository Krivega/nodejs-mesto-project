import { errors } from 'celebrate';

import type { NextFunction, Request, Response } from 'express';

import InternalServerError from '../errors/InternalServerError';
import type { TErrorWithStatusCode } from '../errors/types';

const celebrateErrorHandler = (errors());

const parseErrors = ((error: TErrorWithStatusCode | Error, _req: Request, _res: Response, next: NextFunction) => {
  if ('statusCode' in error) {
    next(error);
  } else {
    next(new InternalServerError(error.message));
  }
});

const globalErrorHandler = ((error: TErrorWithStatusCode, _req: Request, res: Response, _next: NextFunction) => {
  const { statusCode, message } = error;

  res.status(statusCode).send({
    message,
  });
});

const errorHandlers = [celebrateErrorHandler, parseErrors, globalErrorHandler];

export default errorHandlers;
