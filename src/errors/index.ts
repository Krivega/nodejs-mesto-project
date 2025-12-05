import ConflictError from './ConflictError';
import NotFoundError from './NotFoundError';
import UnauthorizedError from './UnauthorizedError';

export const cardNotExistsError = new NotFoundError('Карточка не найдена');
export const userNotExistsError = new NotFoundError('Пользователь не найден');
export const unauthorizedError = new UnauthorizedError('Неверный email или пароль');
export const conflictError = new ConflictError('Такой email уже занят');
