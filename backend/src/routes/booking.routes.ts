import { Router } from 'express';
import { bookingController } from '../controllers/booking.controller';
import { validate } from '../middleware/validation';
import { bookingValidators } from '../validators';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.post('/', validate(bookingValidators.create), bookingController.create);
router.get('/', authenticate, bookingController.getAll); // Now accessible to all authenticated users
router.get('/:id', authenticate, validate(bookingValidators.getById), bookingController.getById);
router.put('/:id/status', authenticate, authorizeAdmin, validate(bookingValidators.update), bookingController.updateStatus);

export default router;
