import { Request, Response, NextFunction } from 'express';
import { bookingService } from '../services/booking.service';
import { AuthRequest } from '../types';

export const bookingController = {
  async getAll(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const result = await bookingService.getAll({
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        statusId: req.query.statusId as string | undefined,
        userId: (req.user?.role !== 'admin' && req.user?.id) ? req.user.id : (req.query.userId as string | undefined),
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
      const booking = await bookingService.getById(id);
      res.json({
        success: true,
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const booking = await bookingService.create(req.body, req.user?.id);
      res.status(201).json({
        success: true,
        message: 'Booking request submitted successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const statusIdentifier = req.body.statusId || req.body.status;
      const booking = await bookingService.updateStatus(id, statusIdentifier);
      res.json({
        success: true,
        message: 'Booking status updated successfully',
        data: booking,
      });
    } catch (error) {
      next(error);
    }
  },
};
