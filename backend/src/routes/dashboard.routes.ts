import { Router } from 'express';
import { dashboardController } from '../controllers/dashboard.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/stats', authenticate, authorizeAdmin, dashboardController.getStats);

export default router;
