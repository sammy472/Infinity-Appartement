import { Router } from 'express';
import multer from 'multer';
import { apartmentController } from '../controllers/apartment.controller';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB per file
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router.get('/', apartmentController.getAll);
router.get('/slug/:slug', apartmentController.getBySlug);
router.get('/:id', apartmentController.getById);

// Use multer to handle up to 5 images with field name 'images'
router.post('/', authenticate, authorizeAdmin, upload.array('images', 5), apartmentController.create);
router.put('/:id', authenticate, authorizeAdmin, upload.array('images', 5), apartmentController.update);
router.delete('/:id', authenticate, authorizeAdmin, apartmentController.delete);
router.post('/:id/images', authenticate, authorizeAdmin, apartmentController.addImage);
router.put('/:id/images/:imageId', authenticate, authorizeAdmin, apartmentController.updateImage);
router.delete('/:id/images/:imageId', authenticate, authorizeAdmin, apartmentController.deleteImage);

export default router;
