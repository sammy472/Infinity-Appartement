import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Home, CheckCircle, Calendar, MessageSquare, Plus, BarChart3, BookOpen, Mail, Search, Send } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../utils/api';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }} transition={{ duration: 0.6, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  );
};

interface Booking {
  id: string;
  guestName?: string;
  user?: { firstName: string; lastName: string };
  apartment?: { title: string };
  status?: { name: string };
  checkIn?: string;
  checkOut?: string;
}

interface DashboardProps {
  user: any;
  token: string | null;
  logout: () => void;
  theme: 'dark' | 'light';
}

const AdminDashboard = ({ user: _user, token, logout: _logout, theme }: DashboardProps) => {
  const statsQuery = useQuery({
    queryKey: ['dashboard', 'stats'],
    queryFn: () => api.request('/dashboard/stats', {}, token),
    enabled: !!token,
  });

  const bookingsQuery = useQuery({
    queryKey: ['bookings', 'recent'],
    queryFn: () => api.request('/bookings?limit=5', {}, token),
    enabled: !!token,
  });

  const loading = statsQuery.isLoading || bookingsQuery.isLoading;
  const error = statsQuery.error?.message || bookingsQuery.error?.message || null;
  const stats = statsQuery.data?.data;
  const bookings = bookingsQuery.data?.data?.items || bookingsQuery.data?.data || [];

  const StatCard = ({ title, value, color, icon: Icon }: any) => (
    <motion.div whileHover={{ y: -4 }} className={`backdrop-blur-sm rounded-xl p-6 border transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-amber-100'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${color}`}>
          <Icon size={24} />
        </div>
      </div>
      <h3 className={`text-3xl font-bold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{value}</h3>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
    </motion.div>
  );

  if (loading) {
    return <LoadingState theme={theme} />;
  }

  if (error) {
    return <ErrorState error={error} theme={theme} />;
  }

  return (
    <>
      <FadeIn className="mb-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Apartments" value={stats?.totalApartments || 0} color="bg-amber-500/20 text-amber-400" icon={Home} />
          <StatCard title="Available" value={stats?.availableApartments || 0} color="bg-green-500/20 text-green-400" icon={CheckCircle} />
          <StatCard title="Total Bookings" value={stats?.totalBookings || 0} color="bg-blue-500/20 text-blue-400" icon={Calendar} />
          <StatCard title="Inquiries" value={stats?.totalMessages || 0} color="bg-purple-500/20 text-purple-400" icon={MessageSquare} />
        </div>
      </FadeIn>

      <div className="grid lg:grid-cols-2 gap-8">
        <FadeIn>
          <div className={`backdrop-blur-sm rounded-xl p-6 border transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-amber-100'
          }`}>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-amber-400 hover:text-amber-300 text-sm font-medium">View all</Link>
            </div>
            <div className="space-y-4">
              {bookings.length === 0 ? (
                <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                  No bookings yet
                </div>
              ) : (
                bookings.map((booking: Booking) => (
                  <div key={booking.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-300 ${
                    theme === 'dark' ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white border-gray-200'
                  }`}>
                    <div>
                      <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {booking.guestName || (booking.user ? `${booking.user.firstName} ${booking.user.lastName}` : 'Unknown Guest')}
                      </p>
                      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {booking.apartment?.title || 'Unknown Apartment'}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`inline-block px-3 py-1 rounded-sm text-xs font-bold ${
                        booking.status?.name === 'approved' ? 'bg-green-500/20 text-green-400' :
                        booking.status?.name === 'rejected' ? 'bg-red-500/20 text-red-400' :
                        'bg-yellow-500/20 text-yellow-400'
                      }`}>
                        {booking.status?.name || 'pending'}
                      </span>
                      <p className={`text-xs mt-1 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                        {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ''}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </FadeIn>
        <FadeIn delay={0.1}>
          <div className={`backdrop-blur-sm rounded-xl p-6 border transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-amber-100'
          }`}>
            <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-4">
              <Link to="/admin/apartments/create" className={`p-5 rounded-lg border hover:border-amber-500/50 transition-all text-left ${
                theme === 'dark' ? 'bg-gray-900/70 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="text-2xl mb-2">
                  <Plus size={24} className="text-amber-400" />
                </div>
                <p className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Add Apartment</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Create new listing</p>
              </Link>
              <Link to="/admin/analytics" className={`p-5 rounded-lg border hover:border-amber-500/50 transition-all text-left ${
                theme === 'dark' ? 'bg-gray-900/70 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="text-2xl mb-2">
                  <BarChart3 size={24} className="text-amber-400" />
                </div>
                <p className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>View Analytics</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Detailed reports</p>
              </Link>
              <Link to="/admin/bookings" className={`p-5 rounded-lg border hover:border-amber-500/50 transition-all text-left ${
                theme === 'dark' ? 'bg-gray-900/70 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="text-2xl mb-2">
                  <BookOpen size={24} className="text-amber-400" />
                </div>
                <p className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Manage Bookings</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Update statuses</p>
              </Link>
              <Link to="/admin/messages" className={`p-5 rounded-lg border hover:border-amber-500/50 transition-all text-left ${
                theme === 'dark' ? 'bg-gray-900/70 border-gray-700' : 'bg-white border-gray-200'
              }`}>
                <div className="text-2xl mb-2">
                  <Mail size={24} className="text-amber-400" />
                </div>
                <p className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Messages</p>
                <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Reply to inquiries</p>
              </Link>
            </div>
          </div>
        </FadeIn>
      </div>
    </>
  );
};

const UserDashboard = ({ user: _user, token, logout: _logout, theme }: DashboardProps) => {
  const bookingsQuery = useQuery({
    queryKey: ['bookings', 'user'],
    queryFn: () => api.request('/bookings', {}, token),
    enabled: !!token,
  });

  const loading = bookingsQuery.isLoading;
  const error = bookingsQuery.error?.message || null;
  const bookings = bookingsQuery.data?.data?.items || bookingsQuery.data?.data || [];

  if (loading) {
    return <LoadingState theme={theme} />;
  }

  if (error) {
    return <ErrorState error={error} theme={theme} />;
  }

  return (
    <div className="grid lg:grid-cols-1 gap-8">
      <FadeIn>
        <div className={`backdrop-blur-sm rounded-xl p-6 border transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-amber-100'
        }`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">My Bookings</h2>
          </div>
          <div className="space-y-4">
            {bookings.length === 0 ? (
              <div className={`text-center py-8 ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>
                You haven't made any bookings yet
              </div>
            ) : (
              bookings.map((booking: Booking) => (
                <div key={booking.id} className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white border-gray-200'
                }`}>
                  <div>
                    <p className={`font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {booking.apartment?.title || 'Unknown Apartment'}
                    </p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      {booking.checkIn ? new Date(booking.checkIn).toLocaleDateString() : ''} - {booking.checkOut ? new Date(booking.checkOut).toLocaleDateString() : ''}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-block px-3 py-1 rounded-sm text-xs font-bold ${
                      booking.status?.name === 'approved' ? 'bg-green-500/20 text-green-400' :
                      booking.status?.name === 'rejected' ? 'bg-red-500/20 text-red-400' :
                      'bg-yellow-500/20 text-yellow-400'
                    }`}>
                      {booking.status?.name || 'pending'}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </FadeIn>
      <FadeIn delay={0.1}>
        <div className={`backdrop-blur-sm rounded-xl p-6 border transition-colors duration-300 ${
          theme === 'dark' ? 'bg-gray-800/60 border-gray-700' : 'bg-white border-amber-100'
        }`}>
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 gap-4">
            <Link to="/residences" className={`p-5 rounded-lg border hover:border-amber-500/50 transition-all text-left ${
              theme === 'dark' ? 'bg-gray-900/70 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="text-2xl mb-2">
                <Search size={24} className="text-amber-400" />
              </div>
              <p className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Browse Apartments</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Find your perfect stay</p>
            </Link>
            <Link to="/contact" className={`p-5 rounded-lg border hover:border-amber-500/50 transition-all text-left ${
              theme === 'dark' ? 'bg-gray-900/70 border-gray-700' : 'bg-white border-gray-200'
            }`}>
              <div className="text-2xl mb-2">
                <Send size={24} className="text-amber-400" />
              </div>
              <p className={`font-semibold mb-1 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Send Enquiry</p>
              <p className={`text-xs ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Contact us with questions</p>
            </Link>
          </div>
        </div>
      </FadeIn>
    </div>
  );
};

const LoadingState = ({ theme }: { theme: 'dark' | 'light' }) => (
  <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
    <div className="text-amber-400 text-2xl">Loading dashboard...</div>
  </div>
);

const ErrorState = ({ error, theme }: { error: string; theme: 'dark' | 'light' }) => (
  <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
    <div className="text-red-400 text-2xl">{error}</div>
  </div>
);

const Dashboard = () => {
  const { user, logout, token } = useAuth();
  const { theme } = useTheme();
  const isAdmin = user?.role === 'admin';

  return (
    <div className={`min-h-screen pt-24 pb-16 transition-colors duration-300 ${
        theme === 'dark' 
          ? 'bg-gradient-to-b from-black via-gray-900 to-black' 
          : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`} style={theme === 'dark' ? {
        backgroundImage: `url('https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      } : {}}>
      {theme === 'dark' && <div className="absolute h-full inset-0 bg-black/60"></div>}
      <div className="relative z-10 container mx-auto px-4">
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <p className="text-amber-400 tracking-[0.2em] mb-2 uppercase text-sm">
                {isAdmin ? 'Admin Dashboard' : 'User Dashboard'}
              </p>
              <h1 className="text-4xl font-bold text-white">Welcome back, {user?.name}!</h1>
            </div>
            <div className="flex gap-4">
              <Link to="/" className={`px-5 py-2.5 border hover:border-amber-500/50 rounded-sm transition-all ${
                theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
              }`}>View Website</Link>
              <button onClick={logout} className="px-5 py-2.5 bg-red-500/20 border border-red-500/30 hover:bg-red-500/30 text-red-400 rounded-sm transition-all">Logout</button>
            </div>
          </div>
        </div>

        {isAdmin ? (
          <AdminDashboard user={user} token={token} logout={logout} theme={theme} />
        ) : (
          <UserDashboard user={user} token={token} logout={logout} theme={theme} />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
