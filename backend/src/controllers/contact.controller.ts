import { Request, Response, NextFunction } from 'express';
import { contactService } from '../services/contact.service';

export const contactController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await contactService.getAll({
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        read: req.query.read !== undefined ? req.query.read === 'true' : undefined,
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
      const message = await contactService.getById(id);
      res.json({
        success: true,
        data: message,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const message = await contactService.create(req.body);
      res.status(201).json({
        success: true,
        message: 'Message sent successfully',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const message = await contactService.markAsRead(id);
      res.json({
        success: true,
        message: 'Message marked as read',
        data: message,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await contactService.delete(id);
      res.json({
        success: true,
        message: 'Message deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
