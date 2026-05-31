import { db } from '../database';
import { testimonials } from '../database/schema';
import { eq, and, desc } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler';

export const testimonialService = {
  async getAll(options: { page?: number; limit?: number; approved?: boolean; featured?: boolean }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    let whereClause: any = undefined;
    const conditions = [];

    if (options.approved !== undefined) {
      conditions.push(eq(testimonials.approved, options.approved));
    }

    if (options.featured !== undefined) {
      conditions.push(eq(testimonials.featured, options.featured));
    }

    if (conditions.length > 0) {
      whereClause = and(...conditions);
    }

    const items = await db.query.testimonials.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(testimonials.createdAt)],
      with: { apartment: true },
    });

    const totalResult = await db.select({ count: testimonials.id }).from(testimonials).where(whereClause);
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
    const testimonial = await db.query.testimonials.findFirst({
      where: eq(testimonials.id, id),
      with: { apartment: true },
    });

    if (!testimonial) {
      throw new AppError('Testimonial not found', 404);
    }

    return testimonial;
  },

  async create(data: any) {
    const [testimonial] = await db.insert(testimonials).values(data).returning();
    return this.getById(testimonial.id);
  },

  async update(id: string, data: { approved?: boolean; featured?: boolean }) {
    await this.getById(id);
    const [updated] = await db.update(testimonials)
      .set(data)
      .where(eq(testimonials.id, id))
      .returning();
    return this.getById(id);
  },

  async delete(id: string) {
    await this.getById(id);
    await db.delete(testimonials).where(eq(testimonials.id, id));
  },
};
