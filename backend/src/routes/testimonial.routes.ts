import { Router } from 'express';
import { testimonialController } from '../controllers/testimonial.controller';
import { validate } from '../middleware/validation';
import { testimonialValidators } from '../validators';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.get('/', testimonialController.getAll);
router.get('/:id', testimonialController.getById);
router.post('/', validate(testimonialValidators.create), testimonialController.create);
router.put('/:id', authenticate, authorizeAdmin, validate(testimonialValidators.update), testimonialController.update);
router.delete('/:id', authenticate, authorizeAdmin, testimonialController.delete);

export default router;
