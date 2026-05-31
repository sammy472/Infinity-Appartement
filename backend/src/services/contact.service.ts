import { db } from '../database';
import { contactMessages } from '../database/schema';
import { eq, desc } from 'drizzle-orm';
import { AppError } from '../middleware/errorHandler';

export const contactService = {
  async getAll(options: { page?: number; limit?: number; read?: boolean }) {
    const page = options.page || 1;
    const limit = options.limit || 10;
    const offset = (page - 1) * limit;

    let whereClause: any = undefined;
    if (options.read !== undefined) {
      whereClause = eq(contactMessages.read, options.read);
    }

    const items = await db.query.contactMessages.findMany({
      where: whereClause,
      limit,
      offset,
      orderBy: [desc(contactMessages.createdAt)],
      with: { apartment: true },
    });

    const totalResult = await db.select({ count: contactMessages.id }).from(contactMessages).where(whereClause);
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
    const message = await db.query.contactMessages.findFirst({
      where: eq(contactMessages.id, id),
      with: { apartment: true },
    });

    if (!message) {
      throw new AppError('Message not found', 404);
    }

    return message;
  },

  async create(data: any) {
    const [message] = await db.insert(contactMessages).values(data).returning();
    return this.getById(message.id);
  },

  async markAsRead(id: string) {
    await this.getById(id);
    const [updated] = await db.update(contactMessages)
      .set({ read: true })
      .where(eq(contactMessages.id, id))
      .returning();
    return this.getById(id);
  },

  async delete(id: string) {
    await this.getById(id);
    await db.delete(contactMessages).where(eq(contactMessages.id, id));
  },
};
