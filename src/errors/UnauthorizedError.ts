import { EHttpStatus } from './types';

import type { TErrorWithStatusCode, THttpStatus } from './types';

class UnauthorizedError extends Error implements TErrorWithStatusCode {
  public statusCode: THttpStatus;

  public constructor(message: string) {
    super(message);
    this.statusCode = EHttpStatus.Unauthorized;
  }
}

export default UnauthorizedError;
