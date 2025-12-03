import { Router } from 'express';
import { signup, login, editUserDetail } from '../controllers/auth.controller';
import { validate } from '../middleware/validate.middleware';
import { signupSchema, loginSchema } from '../schemas/auth.schema';

const router = Router();

// @route   POST /api/v1/auth/signup
router.post('/signup', validate(signupSchema), signup);

// @route   POST /api/v1/auth/login
router.post('/login', validate(loginSchema), login);

router.post('/edit-user-detail', editUserDetail)

export default router;