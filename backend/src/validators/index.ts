import { z } from 'zod';

export const authValidators = {
  register: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string().min(6),
      firstName: z.string().optional(),
      lastName: z.string().optional(),
      phone: z.string().optional(),
    }),
  }),
  login: z.object({
    body: z.object({
      email: z.string().email(),
      password: z.string(),
    }),
  }),
  refreshToken: z.object({
    body: z.object({
      refreshToken: z.string(),
    }),
  }),
};

export const apartmentValidators = {
  create: z.object({
    body: z.object({
      title: z.string().min(1),
      slug: z.string().min(1),
      description: z.string().optional(),
      price: z.number().positive(),
      roomCount: z.number().int().positive(),
      bathrooms: z.number().int().positive(),
      squareFootage: z.number().int().positive().optional(),
      furnished: z.boolean().optional(),
      available: z.boolean().optional(),
      featured: z.boolean().optional(),
      tourUrl: z.string().url().optional(),
      location: z.string().optional(),
      amenities: z.array(z.string()).optional(),
    }),
  }),
  update: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      title: z.string().min(1).optional(),
      slug: z.string().min(1).optional(),
      description: z.string().optional(),
      price: z.number().positive().optional(),
      roomCount: z.number().int().positive().optional(),
      bathrooms: z.number().int().positive().optional(),
      squareFootage: z.number().int().positive().optional(),
      furnished: z.boolean().optional(),
      available: z.boolean().optional(),
      featured: z.boolean().optional(),
      tourUrl: z.string().url().optional(),
      location: z.string().optional(),
      amenities: z.array(z.string()).optional(),
    }),
  }),
  getById: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
  getBySlug: z.object({
    params: z.object({
      slug: z.string(),
    }),
  }),
};

export const bookingValidators = {
  create: z.object({
    body: z.object({
      apartmentId: z.string().uuid(),
      guestName: z.string().min(1),
      guestEmail: z.string().email(),
      guestPhone: z.string().optional(),
      checkIn: z.string().transform((str) => new Date(str)),
      checkOut: z.string().transform((str) => new Date(str)),
      guests: z.number().int().positive().optional(),
      specialRequests: z.string().optional(),
    }),
  }),
  update: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      statusId: z.string().uuid().optional(),
    }),
  }),
  getById: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
  }),
};

export const contactValidators = {
  create: z.object({
    body: z.object({
      name: z.string().min(1),
      email: z.string().email(),
      phone: z.string().optional(),
      message: z.string().min(1),
      apartmentId: z.string().uuid().optional(),
      inquiryType: z.string().optional(),
    }),
  }),
};

export const testimonialValidators = {
  create: z.object({
    body: z.object({
      name: z.string().min(1),
      email: z.string().email().optional(),
      avatar: z.string().optional(),
      rating: z.number().int().min(1).max(5),
      comment: z.string().min(1),
      apartmentId: z.string().uuid().optional(),
    }),
  }),
  update: z.object({
    params: z.object({
      id: z.string().uuid(),
    }),
    body: z.object({
      approved: z.boolean().optional(),
      featured: z.boolean().optional(),
    }),
  }),
};
