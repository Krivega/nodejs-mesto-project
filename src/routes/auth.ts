import express from 'express';

import {
  createUser, createUserSchema, loginSchema, login,
} from '../controllers/users';
import authLimiter from '../middlewares/authLimiter';

const router = express.Router();

router.post('/signin', authLimiter, loginSchema, login);
router.post('/signup', authLimiter, createUserSchema, createUser);

export default router;
