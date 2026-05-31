import { Router } from 'express';
import { contactController } from '../controllers/contact.controller';
import { validate } from '../middleware/validation';
import { contactValidators } from '../validators';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

router.post('/', validate(contactValidators.create), contactController.create);
router.get('/', authenticate, authorizeAdmin, contactController.getAll);
router.get('/:id', authenticate, authorizeAdmin, contactController.getById);
router.put('/:id/read', authenticate, authorizeAdmin, contactController.markAsRead);
router.delete('/:id', authenticate, authorizeAdmin, contactController.delete);

export default router;
