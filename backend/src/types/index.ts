import { Request } from 'express';
import { users } from '../database/schema';

export interface AuthRequest extends Request {
  user?: typeof users.$inferSelect;
}

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export interface JwtPayload {
  userId: string;
  email: string;
  role: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
