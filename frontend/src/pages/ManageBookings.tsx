import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

interface Booking {
  id: string;
  guestName: string;
  guestEmail: string;
  guestPhone?: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  specialRequests?: string;
  totalPrice?: string | number;
  status?: { id: string; name: string };
  apartment?: { id: string; title: string };
  createdAt: string;
}

const ManageBookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const { theme } = useTheme();
  const { token } = useAuth();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/bookings`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        });
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        setBookings(data.data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [token]);

  const updateStatus = async (id: string, status: string) => {
    try {
      setUpdatingId(id);
      const response = await fetch(`${API_BASE}/bookings/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setBookings(bookings.map(booking => 
          booking.id === id 
            ? data.data
            : booking
        ));
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Failed to update booking status' }));
        throw new Error(errorData.message || 'Failed to update booking status');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update status');
    } finally {
      setUpdatingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved':
        return 'bg-green-500/20 text-green-400';
      case 'rejected':
        return 'bg-red-500/20 text-red-400';
      case 'cancelled':
        return 'bg-gray-500/20 text-gray-400';
      case 'completed':
        return 'bg-blue-500/20 text-blue-400';
      default:
        return 'bg-yellow-500/20 text-yellow-400';
    }
  };

  if (loading) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-amber-400 text-2xl">Loading bookings...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-red-400 text-2xl">{error}</div>
      </div>
    );
  }

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <Helmet>
        <title>Manage Bookings - Infinity Appartements</title>
      </Helmet>
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <p className="text-amber-400 tracking-[0.2em] mb-2 uppercase text-sm">Admin Dashboard</p>
              <h1 className="text-4xl font-bold">Manage Bookings</h1>
            </div>
            <Link to="/dashboard" className={`px-5 py-2.5 border hover:border-amber-500/50 rounded-sm transition-all ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}>Back to Dashboard</Link>
          </div>
        </FadeIn>

        {bookings.length === 0 ? (
          <div className={`text-center py-20 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No bookings yet.
          </div>
        ) : (
          <div className="space-y-6">
            {bookings.map((booking, i) => (
              <FadeIn key={booking.id} delay={i * 0.05}>
                <motion.div whileHover={{ y: -2 }} className={`backdrop-blur-sm rounded-xl p-6 border transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                }`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-4 mb-2">
                        <h3 className="text-xl font-bold">{booking.guestName}</h3>
                        <span className={`px-3 py-1 rounded-sm text-xs font-bold ${getStatusColor(booking.status?.name || 'pending')}`}>
                          {(booking.status?.name || 'pending').charAt(0).toUpperCase() + (booking.status?.name || 'pending').slice(1)}
                        </span>
                      </div>
                      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {booking.guestEmail} · {booking.guestPhone || 'No phone'}
                      </p>
                      <div className={`text-sm mb-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        <span className="font-semibold">{booking.apartment?.title || 'Unknown Apartment'}</span>
                      </div>
                      <div className="flex flex-wrap gap-6 text-sm">
                        <div>
                          <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Check-in: </span>
                          <span>{formatDate(booking.checkIn)}</span>
                        </div>
                        <div>
                          <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Check-out: </span>
                          <span>{formatDate(booking.checkOut)}</span>
                        </div>
                        <div>
                          <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Guests: </span>
                          <span>{booking.guests}</span>
                        </div>
                        {booking.totalPrice && (
                          <div>
                            <span className={`${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Total: </span>
                            <span className="text-amber-400 font-semibold">
                              ${typeof booking.totalPrice === 'string' ? parseFloat(booking.totalPrice).toLocaleString() : booking.totalPrice.toLocaleString()}
                            </span>
                          </div>
                        )}
                      </div>
                      {booking.specialRequests && (
                        <div className="mt-4 p-4 rounded-sm border-l-4 border-amber-500 bg-amber-500/10">
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            <span className="font-semibold">Special Requests: </span>
                            {booking.specialRequests}
                          </p>
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 min-w-[200px]">
                      <select
                        value={booking.status?.name || 'pending'}
                        onChange={(e) => updateStatus(booking.id, e.target.value)}
                        disabled={updatingId === booking.id}
                        className={`w-full px-3 py-2 border rounded-sm transition-colors duration-300 ${
                          theme === 'dark' ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'
                        }`}
                      >
                        <option value="pending">Pending</option>
                        <option value="approved">Approve</option>
                        <option value="rejected">Reject</option>
                        <option value="cancelled">Cancel</option>
                        <option value="completed">Complete</option>
                      </select>
                      <p className="text-xs text-center">
                        {updatingId === booking.id ? 'Updating...' : ''}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageBookings;
