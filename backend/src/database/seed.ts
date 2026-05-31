import { db } from './index';
import { bookingStatuses, amenities, users } from './schema';
import bcrypt from 'bcrypt';

async function seed() {
  console.log('🌱 Starting database seeding...');

  console.log('📋 Creating booking statuses...');
  await db.insert(bookingStatuses).values([
    { name: 'pending', description: 'Booking is pending approval' },
    { name: 'approved', description: 'Booking has been approved' },
    { name: 'rejected', description: 'Booking has been rejected' },
    { name: 'cancelled', description: 'Booking has been cancelled' },
    { name: 'completed', description: 'Booking has been completed' },
  ]);
  console.log('✅ Booking statuses created');

  console.log('🏢 Creating amenities...');
  await db.insert(amenities).values([
    { name: 'WiFi', icon: 'wifi', description: 'High-speed internet' },
    { name: 'Swimming Pool', icon: 'pool', description: 'Outdoor swimming pool' },
    { name: 'Gym', icon: 'dumbbell', description: 'Fitness center' },
    { name: 'Parking', icon: 'car', description: 'Secure parking' },
    { name: 'Air Conditioning', icon: 'snowflake', description: 'Climate control' },
    { name: 'Security', icon: 'shield', description: '24/7 security' },
    { name: 'Elevator', icon: 'elevator', description: 'Modern elevators' },
    { name: 'Balcony', icon: 'sun', description: 'Private balcony' },
    { name: 'Kitchen', icon: 'utensils', description: 'Fully equipped kitchen' },
    { name: 'Laundry', icon: 'shirt', description: 'Washer and dryer' },
  ]);
  console.log('✅ Amenities created');

  console.log('👤 Creating admin user...');
  const hashedPassword = await bcrypt.hash('admin123', 12);
  await db.insert(users).values({
    email: 'admin@infinityapartments.com',
    password: hashedPassword,
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
  });
  console.log('✅ Admin user created (email: admin@infinityapartments.com, password: admin123)');

  console.log('🎉 Database seeding completed!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
});
