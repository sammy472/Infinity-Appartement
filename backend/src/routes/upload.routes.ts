import { Router } from 'express';
import multer from 'multer';
import { supabaseStorage } from '../services/supabase.service';
import { authenticate, authorizeAdmin } from '../middleware/auth';
import { AppError } from '../middleware/errorHandler';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(), // Store files in memory
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(null, false);
    }
  },
});

router.post(
  '/image',
  authenticate,
  authorizeAdmin,
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const bucketName = 'apartment-images';
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = `uploads/${fileName}`;

      const result = await supabaseStorage.uploadFile(
        req.file.buffer,
        bucketName,
        filePath,
        {
          contentType: req.file.mimetype,
          upsert: true,
        }
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.post(
  '/video',
  authenticate,
  authorizeAdmin,
  upload.single('file'),
  async (req, res, next) => {
    try {
      if (!req.file) {
        throw new AppError('No file uploaded', 400);
      }

      const bucketName = 'apartment-videos';
      const fileName = `${Date.now()}-${req.file.originalname}`;
      const filePath = `uploads/${fileName}`;

      const result = await supabaseStorage.uploadFile(
        req.file.buffer,
        bucketName,
        filePath,
        {
          contentType: req.file.mimetype,
          upsert: true,
        }
      );

      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  }
);

router.delete(
  '/:bucket/*',
  authenticate,
  authorizeAdmin,
  async (req, res, next) => {
    try {
      const bucketName = req.params.bucket as string;
      const filePath = Array.isArray(req.params[0]) 
        ? req.params[0].join('/') 
        : (req.params[0] as string);

      await supabaseStorage.deleteFile(bucketName, filePath);

      res.json({
        success: true,
        message: 'File deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
);

export default router;
