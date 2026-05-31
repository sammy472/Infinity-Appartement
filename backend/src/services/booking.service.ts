import { db } from '../database';
import { bookings, bookingStatuses } from '../database/schema';
import { eq, and, gte, lte, or } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler';
import { apartmentService } from './apartment.service';

export const bookingService = {
  async getAll(options: { page?: number; limit?: number; statusId?: string; userId?: string }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    let whereClause: any = undefined;
    if (options.statusId) {
      whereClause = eq(bookings.statusId, options.statusId);
    }
    if (options.userId) {
      const userCondition = eq(bookings.userId, options.userId);
      whereClause = whereClause ? and(whereClause, userCondition) : userCondition;
    }

    const items = await db.query.bookings.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [bookings.createdAt],
      with: {
        apartment: true,
        status: true,
        user: { columns: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    const totalResult = await db.select({ count: bookings.id }).from(bookings).where(whereClause);
    const total = totalResult.length;
    const totalPages = Math.ceil(total / limit);

    return {
      items,
      total,
      page,
      limit,
      totalPages,
    };
  },

  async getById(id: string) {
    const booking = await db.query.bookings.findFirst({
      where: eq(bookings.id, id),
      with: {
        apartment: true,
        status: true,
        user: { columns: { id: true, email: true, firstName: true, lastName: true } },
      },
    });

    if (!booking) {
      throw new AppError('Booking not found', 404);
    }

    return booking;
  },

  async create(data: any, userId?: string) {
    const apartment = await apartmentService.getById(data.apartmentId);

    if (!apartment.available) {
      throw new AppError('Apartment is not available', 400);
    }

    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    if (checkIn >= checkOut) {
      throw new AppError('Check-out must be after check-in', 400);
    }

    const conflictingBookings = await db.query.bookings.findMany({
      where: and(
        eq(bookings.apartmentId, data.apartmentId),
        or(
          and(
            lte(bookings.checkIn, checkOut),
            gte(bookings.checkOut, checkIn)
          )
        )
      ),
    });

    if (conflictingBookings.length > 0) {
      throw new AppError('Apartment is not available for these dates', 400);
    }

    const pendingStatus = await db.query.bookingStatuses.findFirst({
      where: eq(bookingStatuses.name, 'pending'),
    });

    if (!pendingStatus) {
      throw new AppError('Booking status not found', 500);
    }

    const [booking] = await db.insert(bookings).values({
      apartmentId: data.apartmentId,
      userId,
      guestName: data.guestName,
      guestEmail: data.guestEmail,
      guestPhone: data.guestPhone,
      checkIn,
      checkOut,
      guests: data.guests || 1,
      specialRequests: data.specialRequests,
      statusId: pendingStatus.id,
    }).returning();

    return this.getById(booking.id);
  },

  async updateStatus(id: string, statusIdentifier: string) {
    await this.getById(id);

    let status;
    // First try to find by name (avoids UUID validation errors when status is a name)
    status = await db.query.bookingStatuses.findFirst({
      where: eq(bookingStatuses.name, statusIdentifier),
    });
    // If not found, try to find by ID (if it's a valid UUID)
    if (!status) {
      status = await db.query.bookingStatuses.findFirst({
        where: eq(bookingStatuses.id, statusIdentifier),
      });
    }

    if (!status) {
      throw new AppError('Status not found', 404);
    }

    const [updated] = await db.update(bookings)
      .set({ statusId: status.id, updatedAt: new Date() })
      .where(eq(bookings.id, id))
      .returning();

    return this.getById(id);
  },
};
