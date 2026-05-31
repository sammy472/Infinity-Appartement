import { Request, Response, NextFunction } from 'express';
import { apartmentService } from '../services/apartment.service';

export const apartmentController = {
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await apartmentService.getAll({
        page: req.query.page ? parseInt(req.query.page as string) : undefined,
        limit: req.query.limit ? parseInt(req.query.limit as string) : undefined,
        available: req.query.available !== undefined ? req.query.available === 'true' : undefined,
        featured: req.query.featured !== undefined ? req.query.featured === 'true' : undefined,
        minPrice: req.query.minPrice ? parseFloat(req.query.minPrice as string) : undefined,
        maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
        search: req.query.search as string | undefined,
        sortBy: req.query.sortBy as string | undefined,
        sortOrder: req.query.sortOrder as 'asc' | 'desc' | undefined,
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
      const apartment = await apartmentService.getById(id);
      res.json({
        success: true,
        data: apartment,
      });
    } catch (error) {
      next(error);
    }
  },

  async getBySlug(req: Request, res: Response, next: NextFunction) {
    try {
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const apartment = await apartmentService.getBySlug(slug);
      res.json({
        success: true,
        data: apartment,
      });
    } catch (error) {
      next(error);
    }
  },

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const apartment = await apartmentService.create(req.body, req.files as Express.Multer.File[]);
      res.status(201).json({
        success: true,
        message: 'Apartment created successfully',
        data: apartment,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const apartment = await apartmentService.update(id, req.body, req.files as Express.Multer.File[]);
      res.json({
        success: true,
        message: 'Apartment updated successfully',
        data: apartment,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      await apartmentService.delete(id);
      res.json({
        success: true,
        message: 'Apartment deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },

  async addImage(req: Request, res: Response, next: NextFunction) {
    try {
      const apartmentId = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
      const { url, order = 0, isPrimary = false } = req.body;
      const image = await apartmentService.addImage(apartmentId, url, order, isPrimary);
      res.status(201).json({
        success: true,
        message: 'Image added successfully',
        data: image,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateImage(req: Request, res: Response, next: NextFunction) {
    try {
      const imageId = Array.isArray(req.params.imageId) ? req.params.imageId[0] : req.params.imageId;
      const { order, isPrimary } = req.body;
      const image = await apartmentService.updateImage(imageId, { order, isPrimary });
      res.json({
        success: true,
        message: 'Image updated successfully',
        data: image,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteImage(req: Request, res: Response, next: NextFunction) {
    try {
      const imageId = Array.isArray(req.params.imageId) ? req.params.imageId[0] : req.params.imageId;
      await apartmentService.deleteImage(imageId);
      res.json({
        success: true,
        message: 'Image deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};
