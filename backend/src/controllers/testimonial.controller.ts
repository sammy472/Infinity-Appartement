import { Request, Response, NextFunction } from 'express';
import { testimonialService } from '../services/testimonial.service';

export const testimonialController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await testimonialService.getAll({
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        approved: req.query.approved !== undefined ? req.query.approved === 'true' : undefined,
        featured: req.query.featured !== undefined ? req.query.featured === 'true' : undefined,
      });
      res.json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  },

  async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const testimonial = await testimonialService.getById(id);
      res.json({
        success: true,
        data: testimonial,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const testimonial = await testimonialService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Testimonial submitted successfully',
        data: testimonial,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const testimonial = await testimonialService.update(id, req.body);
      res.json({
        success: true,
        message: 'Testimonial updated successfully',
        data: testimonial,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await testimonialService.delete(id);
      res.json({
        success: true,
        message: 'Testimonial deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
