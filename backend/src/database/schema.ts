import { text, uuid, timestamp, integer, boolean, decimal, jsonb, index, pgTableCreator } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

const createTable = pgTableCreator((name) => name);

// Users table
export const users = createTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').unique().notNull(),
  password: text('password').notNull(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  phone: text('phone'),
  role: text('role').notNull().default('user'), // user, admin
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
});

// Refresh Tokens table
export const refreshTokens = createTable('refresh_tokens', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Amenities table
export const amenities = createTable('amenities', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  icon: text('icon'),
  description: text('description'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Apartments table
export const apartments = createTable('apartments', {
  id: uuid('id').primaryKey().defaultRandom(),
  title: text('title').notNull(),
  slug: text('slug').unique().notNull(),
  description: text('description'),
  price: decimal('price', { precision: 12, scale: 2 }).notNull(),
  roomCount: integer('room_count').notNull(),
  bathrooms: integer('bathrooms').notNull(),
  squareFootage: integer('square_footage'),
  furnished: boolean('furnished').default(false).notNull(),
  available: boolean('available').default(true).notNull(),
  featured: boolean('featured').default(false).notNull(),
  tourUrl: text('tour_url'),
  location: text('location'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  availableIdx: index('apt_available_idx').on(table.available),
  featuredIdx: index('apt_featured_idx').on(table.featured),
  priceIdx: index('apt_price_idx').on(table.price),
}));

// Apartment Amenities junction table
export const apartmentAmenities = createTable('apartment_amenities', {
  id: uuid('id').primaryKey().defaultRandom(),
  apartmentId: uuid('apartment_id').references(() => apartments.id, { onDelete: 'cascade' }).notNull(),
  amenityId: uuid('amenity_id').references(() => amenities.id, { onDelete: 'cascade' }).notNull(),
}, (table) => ({
  uniqueAmenity: index('apt_amenity_unique').on(table.apartmentId, table.amenityId),
}));

// Apartment Images table
export const apartmentImages = createTable('apartment_images', {
  id: uuid('id').primaryKey().defaultRandom(),
  apartmentId: uuid('apartment_id').references(() => apartments.id, { onDelete: 'cascade' }).notNull(),
  url: text('url').notNull(),
  publicId: text('public_id'),
  isPrimary: boolean('is_primary').default(false).notNull(),
  order: integer('order').default(0),
  createdAt: timestamp('created_at').defaultNow().notNull(),
});

// Booking Statuses enum table
export const bookingStatuses = createTable('booking_statuses', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').unique().notNull(), // pending, approved, rejected, cancelled, completed
  description: text('description'),
});

// Bookings table
export const bookings = createTable('bookings', {
  id: uuid('id').primaryKey().defaultRandom(),
  apartmentId: uuid('apartment_id').references(() => apartments.id, { onDelete: 'cascade' }).notNull(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  guestName: text('guest_name').notNull(),
  guestEmail: text('guest_email').notNull(),
  guestPhone: text('guest_phone'),
  checkIn: timestamp('check_in').notNull(),
  checkOut: timestamp('check_out').notNull(),
  guests: integer('guests').default(1).notNull(),
  specialRequests: text('special_requests'),
  statusId: uuid('status_id').references(() => bookingStatuses.id).notNull(),
  totalPrice: decimal('total_price', { precision: 12, scale: 2 }),
  createdAt: timestamp('created_at').defaultNow().notNull(),
  updatedAt: timestamp('updated_at').defaultNow().notNull(),
}, (table) => ({
  statusIdx: index('booking_status_idx').on(table.statusId),
  dateIdx: index('booking_date_idx').on(table.checkIn, table.checkOut),
}));

// Contact Messages table
export const contactMessages = createTable('contact_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email').notNull(),
  phone: text('phone'),
  message: text('message').notNull(),
  apartmentId: uuid('apartment_id').references(() => apartments.id),
  inquiryType: text('inquiry_type'), // general, viewing, booking
  read: boolean('read').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  emailIdx: index('contact_email_idx').on(table.email),
  readIdx: index('contact_read_idx').on(table.read),
}));

// Testimonials table
export const testimonials = createTable('testimonials', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  email: text('email'),
  avatar: text('avatar'),
  rating: integer('rating').notNull(), // 1-5
  comment: text('comment').notNull(),
  apartmentId: uuid('apartment_id').references(() => apartments.id),
  approved: boolean('approved').default(false).notNull(),
  featured: boolean('featured').default(false).notNull(),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  approvedIdx: index('testimonial_approved_idx').on(table.approved),
  featuredIdx: index('testimonial_featured_idx').on(table.featured),
}));

// Audit Logs table
export const auditLogs = createTable('audit_logs', {
  id: uuid('id').primaryKey().defaultRandom(),
  action: text('action').notNull(),
  entity: text('entity').notNull(),
  entityId: uuid('entity_id'),
  userId: uuid('user_id').references(() => users.id),
  details: jsonb('details'),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
  createdAt: timestamp('created_at').defaultNow().notNull(),
}, (table) => ({
  actionIdx: index('audit_action_idx').on(table.action),
  userIdx: index('audit_user_idx').on(table.userId),
  dateIdx: index('audit_date_idx').on(table.createdAt),
}));

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  bookings: many(bookings),
  refreshTokens: many(refreshTokens),
  auditLogs: many(auditLogs),
}));

export const apartmentsRelations = relations(apartments, ({ many }) => ({
  amenities: many(apartmentAmenities),
  images: many(apartmentImages),
  bookings: many(bookings),
  contactMessages: many(contactMessages),
  testimonials: many(testimonials),
}));

export const apartmentImagesRelations = relations(apartmentImages, ({ one }) => ({
  apartment: one(apartments, {
    fields: [apartmentImages.apartmentId],
    references: [apartments.id],
  }),
}));

export const apartmentAmenitiesRelations = relations(apartmentAmenities, ({ one }) => ({
  apartment: one(apartments, {
    fields: [apartmentAmenities.apartmentId],
    references: [apartments.id],
  }),
  amenity: one(amenities, {
    fields: [apartmentAmenities.amenityId],
    references: [amenities.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  apartment: one(apartments, {
    fields: [bookings.apartmentId],
    references: [apartments.id],
  }),
  user: one(users, {
    fields: [bookings.userId],
    references: [users.id],
  }),
  status: one(bookingStatuses, {
    fields: [bookings.statusId],
    references: [bookingStatuses.id],
  }),
}));

export const contactMessagesRelations = relations(contactMessages, ({ one }) => ({
  apartment: one(apartments, {
    fields: [contactMessages.apartmentId],
    references: [apartments.id],
  }),
}));

export const testimonialsRelations = relations(testimonials, ({ one }) => ({
  apartment: one(apartments, {
    fields: [testimonials.apartmentId],
    references: [apartments.id],
  }),
}));

export const auditLogsRelations = relations(auditLogs, ({ one }) => ({
  user: one(users, {
    fields: [auditLogs.userId],
    references: [users.id],
  }),
}));
