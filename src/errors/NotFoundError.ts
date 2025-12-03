import type { TErrorWithStatusCode } from './types';

class NotFoundError extends Error implements TErrorWithStatusCode {
  public statusCode: number;

  public constructor(message: string) {
    super(message);
    this.statusCode = 404;
  }
}

export default NotFoundError;
