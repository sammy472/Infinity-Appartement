import { Request, Response, NextFunction } from 'express';
import { db } from '../database';
import { apartments, bookings, contactMessages, testimonials, users } from '../database/schema';
import { eq, and, gte, count } from 'drizzle-orm';

export const dashboardController = {
  async getStats(req: Request, res: Response, next: NextFunction) {
    try {
      const [totalApartments] = await db.select({ count: count() }).from(apartments);
      const [totalBookings] = await db.select({ count: count() }).from(bookings);
      const [totalMessages] = await db.select({ count: count() }).from(contactMessages);
      const [totalTestimonials] = await db.select({ count: count() }).from(testimonials);
      const [totalUsers] = await db.select({ count: count() }).from(users);
      const [availableApartments] = await db.select({ count: count() }).from(apartments).where(eq(apartments.available, true));
      const [featuredApartments] = await db.select({ count: count() }).from(apartments).where(eq(apartments.featured, true));
      const [unreadMessages] = await db.select({ count: count() }).from(contactMessages).where(eq(contactMessages.read, false));
      const [pendingTestimonials] = await db.select({ count: count() }).from(testimonials).where(eq(testimonials.approved, false));

      res.json({
        success: true,
        data: {
          totalApartments: totalApartments.count,
          totalBookings: totalBookings.count,
          totalMessages: totalMessages.count,
          totalTestimonials: totalTestimonials.count,
          totalUsers: totalUsers.count,
          availableApartments: availableApartments.count,
          featuredApartments: featuredApartments.count,
          unreadMessages: unreadMessages.count,
          pendingTestimonials: pendingTestimonials.count,
        },
      });
    } catch (error) {
      next(error);
    }
  },
};
