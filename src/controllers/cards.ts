import { celebrate, Joi } from 'celebrate';

import type { Request, Response, NextFunction } from 'express';
import NotFoundError from '../errors/NotFoundError';
import getMeUserId from './getMeUserId';
import cardModel, { checkCardExists } from '../models/card';

import type { ICard } from '../models/card';
import type { IUser } from '../models/user';

export const createCardSchema = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    link: Joi.string().uri().required(),
  }),
});

const cardNotExistsError = new NotFoundError('Карточка не найдена');

const getCardId = async (req: Request): Promise<string> => {
  const { cardId } = req.params;

  return Promise.resolve().then(async () => {
    const isCardExists = await checkCardExists(cardId);

    if (!isCardExists) {
      throw cardNotExistsError;
    }

    return cardId;
  });
};

const parseCardToResponse = (card: ICard) => ({
  id: card._id,
  name: card.name,
  link: card.link,
  owner: card.owner,
  likes: card.likes,
});

const resolveSendCardToResponse = (res: Response, next: NextFunction) => (card: ICard | null) => {
  if (!card) {
    next(cardNotExistsError);

    return;
  }

  res.send({ data: parseCardToResponse(card) });
};

export const createCard = async (
  req: Request<unknown, unknown, { name: string; link: string }>,
  res: Response,
  next: NextFunction,
) => {
  const { name, link } = req.body;

  return getMeUserId(req)
    .then(async (userId) => cardModel.create({ name, link, owner: userId as unknown as IUser }))
    .then(resolveSendCardToResponse(res, next))
    .catch(next);
};

export const getCards = async (_req: Request, res: Response, next: NextFunction) => cardModel
  .find({})
  .then((cards) => res.send({ data: cards.map(parseCardToResponse) }))
  .catch(next);

export const getCardByIdSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

export const getCardById = async (req: Request, res: Response, next: NextFunction) => getCardId(req)
  .then((cardId) => cardModel.findById(cardId))
  .then(resolveSendCardToResponse(res, next))
  .catch(next);

export const deleteCardByIdSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

export const deleteCardById = async (req: Request, res: Response, next: NextFunction) => getCardId(req)
  .then((cardId) => cardModel.findByIdAndDelete(cardId))
  .then(resolveSendCardToResponse(res, next))
  .catch(next);

export const likeCardByIdSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

export const likeCardById = async (req: Request, res: Response, next: NextFunction) => Promise.all([getMeUserId(req), getCardId(req)])
  .then(([userId, cardId]) => cardModel.findByIdAndUpdate(cardId, { $addToSet: { likes: userId } }, { new: true }))
  .then(resolveSendCardToResponse(res, next))
  .catch(next);

export const dislikeCardByIdSchema = celebrate({
  params: Joi.object().keys({
    cardId: Joi.string().required(),
  }),
});

export const dislikeCardById = async (req: Request, res: Response, next: NextFunction) => Promise.all([getMeUserId(req), getCardId(req)])
  .then(([userId, cardId]) => cardModel.findByIdAndUpdate(cardId, { $pull: { likes: userId } }, { new: true }))
  .then(resolveSendCardToResponse(res, next))
  .catch(next);
