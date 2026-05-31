import { Router } from 'express';
import { authController } from '../controllers/auth.controller';
import { validate } from '../middleware/validation';
import { authValidators } from '../validators';
import { authLimiter } from '../middleware/rateLimiter';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', validate(authValidators.register), authController.register);
router.post('/login', authLimiter, validate(authValidators.login), authController.login);
router.post('/refresh', validate(authValidators.refreshToken), authController.refreshToken);
router.post('/logout', authenticate, authController.logout);
router.get('/me', authenticate, authController.getMe);

export default router;
