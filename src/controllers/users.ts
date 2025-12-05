import { celebrate, Joi } from 'celebrate';
import validator from 'validator';

import type { NextFunction, Request, Response } from 'express';
import { userNotExistsError, unauthorizedError, conflictError } from '../errors/index';
import { isMongoDuplicateKeyError } from '../models/errors';
import userModel from '../models/user';
import { login as loginAuth } from './auth';
import { getMeUserId } from './userId';

import type { IUser, IUserPublic } from '../models/user';

export const createUserSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string()
      .required()
      .custom((value: string, helpers) => {
        if (!validator.isEmail(value)) {
          return helpers.error('any.invalid');
        }

        return value;
      })
      .messages({
        'any.invalid': 'Некорректный формат email',
      }),
    password: Joi.string().required(),
    name: Joi.string().min(2).max(30).optional(),
    about: Joi.string().min(2).max(200).optional(),
    avatar: Joi.string().uri().optional(),
  }),
});

const getUserId = async (req: Request): Promise<string> => {
  const { userId } = req.params;

  return Promise.resolve().then(async () => {
    const isUserExists = await userModel.checkUserExists(userId);

    if (!isUserExists) {
      throw userNotExistsError;
    }

    return userId;
  });
};

const parseUserToResponse = (user: IUserPublic) => ({
  id: user._id,
  email: user.email,
  name: user.name,
  about: user.about,
  avatar: user.avatar,
});

export const createUser = async (
  req: Request<
    unknown,
    unknown,
    {
      email: string;
      password: string;
      name?: string;
      about?: string;
      avatar?: string;
    }
  >,
  res: Response,
  next: NextFunction,
) => {
  const {
    email, password, name, about, avatar,
  } = req.body;

  return userModel
    .createUser({
      email, password, name, about, avatar,
    })
    .then((user) => res.send({ data: parseUserToResponse(user) }))
    .catch((error: unknown) => {
      if (isMongoDuplicateKeyError(error)) {
        next(conflictError);
      } else {
        next(error);
      }
    });
};

export const loginSchema = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

export const login = async (
  req: Request<unknown, unknown, { email: string; password: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { email, password } = req.body;

  return userModel
    .findUserByCredentials({ email, password })
    .catch(() => {
      throw unauthorizedError;
    })
    .then((user) => {
      loginAuth(user._id, res);

      return res.send({ data: parseUserToResponse(user) });
    })
    .catch(next);
};

export const getUsers = async (_req: Request, res: Response, next: NextFunction) => userModel
  .find({})
  .then((users) => res.send({ data: users.map(parseUserToResponse) }))
  .catch(next);

const resolveSendUserToResponse = (res: Response, next: NextFunction) => (user: IUser | null) => {
  if (!user) {
    next(userNotExistsError);

    return;
  }

  res.send({ data: parseUserToResponse(user) });
};

export const getUserByIdSchema = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required(),
  }),
});

export const getUserById = async (req: Request, res: Response, next: NextFunction) => getUserId(req)
  .then((userId) => userModel.findById(userId))
  .then(resolveSendUserToResponse(res, next))
  .catch(next);

export const updateUserByIdSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(200).required(),
  }),
});

export const updateUserById = async (
  req: Request<unknown, unknown, { name: string; about: string }>,
  res: Response,
  next: NextFunction,
) => getMeUserId(req)
  .then(async (userId) => userModel.findByIdAndUpdate(userId, req.body))
  .then(resolveSendUserToResponse(res, next))
  .catch(next);

export const updateUserAvatarByIdSchema = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().required(),
  }),
});

export const updateUserAvatarById = async (
  req: Request<unknown, unknown, { avatar: string }>,
  res: Response,
  next: NextFunction,
) => getMeUserId(req)
  .then(async (userId) => userModel.findByIdAndUpdate(userId, req.body))
  .then(resolveSendUserToResponse(res, next))
  .catch(next);

export const getMe = async (req: Request, res: Response, next: NextFunction) => getMeUserId(req)
  .then((userId) => userModel.findById(userId))
  .then(resolveSendUserToResponse(res, next))
  .catch(next);
