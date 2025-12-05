import express from 'express';

import {
  createUser, createUserSchema, loginSchema, login,
} from '../controllers/users';

const router = express.Router();

router.post('/signin', loginSchema, login);
router.post('/signup', createUserSchema, createUser);

export default router;
