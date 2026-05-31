# Infinity Appartements Backend

Production-ready backend for Infinity Appartements luxury real estate platform in Labone, Accra, Ghana.

## Tech Stack

- **Node.js** - Runtime
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **PostgreSQL** - Database
- **Drizzle ORM** - ORM
- **JWT** - Authentication
- **Zod** - Validation
- **Helmet** - Security headers
- **CORS** - Cross-origin resource sharing
- **Rate Limiting** - Request throttling

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── index.ts
│   ├── controllers/
│   ├── database/
│   │   ├── index.ts
│   │   ├── schema.ts
│   │   └── seed.ts
│   ├── middleware/
│   ├── routes/
│   ├── services/
│   ├── types/
│   ├── validators/
│   └── server.ts
├── package.json
├── tsconfig.json
├── drizzle.config.ts
└── .env.example
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database (or Neon Serverless PostgreSQL)

### Installation

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.example .env
```

4. Update `.env` with your configuration

### Database Setup

1. Generate database migrations:
```bash
npm run db:generate
```

2. Push migrations to database:
```bash
npm run db:push
```

3. Seed initial data:
```bash
npx ts-node src/database/seed.ts
```

### Running the Server

Development:
```bash
npm run dev
```

Production:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register user
- `POST /api/v1/auth/login` - Login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `GET /api/v1/auth/me` - Get current user

### Apartments
- `GET /api/v1/apartments` - Get all apartments (filters: available, featured, minPrice, maxPrice, search, sortBy)
- `GET /api/v1/apartments/slug/:slug` - Get apartment by slug
- `GET /api/v1/apartments/:id` - Get apartment by ID
- `POST /api/v1/apartments` - Create apartment (admin only)
- `PUT /api/v1/apartments/:id` - Update apartment (admin only)
- `DELETE /api/v1/apartments/:id` - Delete apartment (admin only)

### Bookings
- `POST /api/v1/bookings` - Create booking
- `GET /api/v1/bookings` - Get all bookings (admin only)
- `GET /api/v1/bookings/:id` - Get booking by ID
- `PUT /api/v1/bookings/:id/status` - Update booking status (admin only)

### Contact
- `POST /api/v1/contact` - Send contact message
- `GET /api/v1/contact` - Get all messages (admin only)
- `GET /api/v1/contact/:id` - Get message by ID (admin only)
- `PUT /api/v1/contact/:id/read` - Mark as read (admin only)
- `DELETE /api/v1/contact/:id` - Delete message (admin only)

### Testimonials
- `GET /api/v1/testimonials` - Get all testimonials
- `GET /api/v1/testimonials/:id` - Get testimonial by ID
- `POST /api/v1/testimonials` - Submit testimonial
- `PUT /api/v1/testimonials/:id` - Update testimonial (admin only)
- `DELETE /api/v1/testimonials/:id` - Delete testimonial (admin only)

### Dashboard
- `GET /api/v1/dashboard/stats` - Get dashboard statistics (admin only)

## Default Admin Credentials

- Email: `admin@infinityapartments.com`
- Password: `admin123`

## Environment Variables

See `.env.example` for required environment variables.
