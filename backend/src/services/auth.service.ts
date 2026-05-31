import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database';
import { users, refreshTokens } from '../database/schema';
import { eq } from 'drizzle-orm';
import { config } from '../config';
import { AppError } from '../middleware/errorHandler';
import { NewUser } from '../types';
import dotenv from 'dotenv';
dotenv.config();


export const authService = {
  async register(userData: Omit<NewUser, 'id' | 'createdAt' | 'updatedAt'>) {
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, userData.email),
    });

    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    const hashedPassword = await bcrypt.hash(userData.password, 12);

    // Check if email is admin email
    const isAdmin = userData.email.toLowerCase() === (process.env.ADMIN_EMAIL || '').toLowerCase();
    
    const [newUser] = await db.insert(users).values({
      ...userData,
      password: hashedPassword,
      role: isAdmin ? 'admin' : (userData.role || 'user'), // Override role to admin if it's the admin email
    }).returning();

    const { password: _, ...userWithoutPassword } = newUser;

    const tokens = await this.generateTokens(newUser.id, newUser.email, newUser.role);

    return { user: userWithoutPassword, tokens };
  },

  async login(email: string, password: string) {
    const user = await db.query.users.findFirst({
      where: eq(users.email, email),
    });

    if (!user) {
      throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError('Invalid credentials', 401);
    }

    const { password: _, ...userWithoutPassword } = user;

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return { user: userWithoutPassword, tokens };
  },

  async generateTokens(userId: string, email: string, role: string) {
    const accessTokenOptions = { expiresIn: config.jwt.expiresIn } as jwt.SignOptions;
    const accessToken = jwt.sign(
      { userId, email, role },
      config.jwt.secret,
      accessTokenOptions
    );

    const refreshToken = uuidv4();
    const refreshExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

    await db.insert(refreshTokens).values({
      userId,
      token: refreshToken,
      expiresAt: refreshExpiresAt,
    });

    const refreshTokenOptions = { expiresIn: config.jwt.refreshExpiresIn } as jwt.SignOptions;
    const signedRefreshToken = jwt.sign(
      { userId, refreshToken },
      config.jwt.refreshSecret,
      refreshTokenOptions
    );

    return { accessToken, refreshToken: signedRefreshToken };
  },

  async refreshToken(token: string) {
    const decoded = jwt.verify(token, config.jwt.refreshSecret as string) as { userId: string; refreshToken: string };

    const storedToken = await db.query.refreshTokens.findFirst({
      where: eq(refreshTokens.token, decoded.refreshToken),
    });

    if (!storedToken || new Date() > new Date(storedToken.expiresAt)) {
      throw new AppError('Invalid refresh token', 401);
    }

    const user = await db.query.users.findFirst({
      where: eq(users.id, storedToken.userId),
    });

    if (!user) {
      throw new AppError('User not found', 404);
    }

    await db.delete(refreshTokens).where(eq(refreshTokens.id, storedToken.id));

    const { password: _, ...userWithoutPassword } = user;
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return { user: userWithoutPassword, tokens };
  },

  async logout(userId: string) {
    await db.delete(refreshTokens).where(eq(refreshTokens.userId, userId));
  },
};
