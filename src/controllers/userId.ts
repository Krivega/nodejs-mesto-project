import type { Request } from 'express';
import type { JwtPayload } from 'jsonwebtoken';
import { unauthorizedError } from '../errors/index';
import userModel from '../models/user';

export const setAuthenticatedUserIdToReq = (
  req: Request<unknown, unknown, unknown, unknown>,
  payload: JwtPayload,
): void => {
  req.user = payload as JwtPayload & { userId: string };
};

const getUserIdFromReq = (req: Request<unknown, unknown, unknown, unknown>): string | undefined => req.user?.userId;

export const getAuthenticatedUserId = async (
  req: Request<unknown, unknown, unknown, unknown>,
): Promise<string> => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const userId = getUserIdFromReq(req)!;

  return Promise.resolve().then(async () => {
    const isUserExists = await userModel.checkUserExists(userId);

    if (!isUserExists) {
      throw unauthorizedError;
    }

    return userId;
  });
};
