import type { TErrorWithStatusCode } from './types';
import { EHttpStatus } from './types';

class InternalServerError extends Error implements TErrorWithStatusCode {
  public statusCode: EHttpStatus;

  public constructor(message: string) {
    super(message);
    this.statusCode = EHttpStatus.InternalServerError;
  }
}

export default InternalServerError;
