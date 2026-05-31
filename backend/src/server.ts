import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { config } from './config';
import { errorHandler, AppError } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import authRoutes from './routes/auth.routes';
import apartmentRoutes from './routes/apartment.routes';
import bookingRoutes from './routes/booking.routes';
import contactRoutes from './routes/contact.routes';
import testimonialRoutes from './routes/testimonial.routes';
import dashboardRoutes from './routes/dashboard.routes';
import uploadRoutes from './routes/upload.routes';
import { db } from './database';
import { apartments, apartmentImages, bookingStatuses } from './database/schema';
import { eq } from 'drizzle-orm';

const app = express();

app.use(helmet());
app.use(cors({
  origin: config.frontend.url,
  credentials: true,
}));
app.use(generalLimiter);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Test endpoint to verify apartments and images
app.get('/api/v1/test/apartments', async (req, res) => {
  try {
    const allApartments = await db.query.apartments.findMany({
      with: { images: true },
    });
    const allImages = await db.select().from(apartmentImages);
    res.json({
      success: true,
      apartments: allApartments,
      images: allImages,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: String(error) });
  }
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/apartments', apartmentRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/contact', contactRoutes);
app.use('/api/v1/testimonials', testimonialRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/upload', uploadRoutes);

app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    message: 'Infinity Appartements API is running',
    timestamp: new Date().toISOString(),
  });
});

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(errorHandler);

async function initDatabase() {
  console.log('🔍 Checking database initialization...');
  const existingStatuses = await db.select().from(bookingStatuses);
  if (existingStatuses.length === 0) {
    console.log('📋 Inserting booking statuses...');
    await db.insert(bookingStatuses).values([
      { name: 'pending', description: 'Booking is pending approval' },
      { name: 'approved', description: 'Booking has been approved' },
      { name: 'rejected', description: 'Booking has been rejected' },
      { name: 'cancelled', description: 'Booking has been cancelled' },
      { name: 'completed', description: 'Booking has been completed' },
    ]);
    console.log('✅ Booking statuses inserted');
  } else {
    console.log('✅ Booking statuses already exist');
  }
}

initDatabase().then(() => {
  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
    console.log(`Environment: ${config.nodeEnv}`);
    console.log(`API Base URL: http://localhost:${config.port}/api/v1`);
  });
}).catch((error) => {
  console.error('❌ Failed to initialize database:', error);
  process.exit(1);
});
