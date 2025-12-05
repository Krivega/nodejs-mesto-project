import { EHttpStatus } from './types';

import type { TErrorWithStatusCode, THttpStatus } from './types';

class ConflictError extends Error implements TErrorWithStatusCode {
  public statusCode: THttpStatus;

  public constructor(message: string) {
    super(message);
    this.statusCode = EHttpStatus.Conflict;
  }
}

export default ConflictError;
