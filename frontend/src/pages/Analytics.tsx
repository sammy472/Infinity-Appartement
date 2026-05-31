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

interface DashboardStats {
  totalApartments?: number;
  availableApartments?: number;
  totalBookings?: number;
  totalMessages?: number;
  [key: string]: any;
}

const Analytics = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();
  const { token } = useAuth();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/dashboard/stats`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        });
        if (!response.ok) {
          throw new Error('Failed to fetch statistics');
        }
        const data = await response.json();
        setStats(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [token]);

  if (loading) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-amber-400 text-2xl">Loading analytics...</div>
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

  const StatCard = ({ title, value, icon, color }: { title: string; value: string | number; icon: string; color: string }) => (
    <motion.div whileHover={{ y: -4 }} className={`backdrop-blur-sm rounded-xl p-6 border transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-amber-100'
    }`}>
      <div className="flex justify-between items-start mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl font-bold ${color}`}>
          {icon}
        </div>
      </div>
      <h3 className="text-3xl font-bold mb-1">{value}</h3>
      <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{title}</p>
    </motion.div>
  );

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <Helmet>
        <title>Analytics - Infinity Appartements</title>
      </Helmet>
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <p className="text-amber-400 tracking-[0.2em] mb-2 uppercase text-sm">Admin Dashboard</p>
              <h1 className="text-4xl font-bold">Analytics & Insights</h1>
            </div>
            <Link to="/dashboard" className={`px-5 py-2.5 border hover:border-amber-500/50 rounded-sm transition-all ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}>Back to Dashboard</Link>
          </div>
        </FadeIn>

        <FadeIn className="mb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              title="Total Apartments" 
              value={stats?.totalApartments || 0} 
              icon="🏠" 
              color="bg-amber-500/20 text-amber-400" 
            />
            <StatCard 
              title="Available Apartments" 
              value={stats?.availableApartments || 0} 
              icon="✅" 
              color="bg-green-500/20 text-green-400" 
            />
            <StatCard 
              title="Total Bookings" 
              value={stats?.totalBookings || 0} 
              icon="📅" 
              color="bg-blue-500/20 text-blue-400" 
            />
            <StatCard 
              title="Inquiries" 
              value={stats?.totalMessages || 0} 
              icon="💬" 
              color="bg-purple-500/20 text-purple-400" 
            />
          </div>
        </FadeIn>

        <div className="grid lg:grid-cols-2 gap-8">
          <FadeIn delay={0.1}>
            <div className={`backdrop-blur-sm rounded-xl p-8 border transition-colors duration-300 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-amber-100'
            }`}>
              <h2 className="text-2xl font-bold mb-6">Key Metrics</h2>
              <div className="space-y-6">
                {Object.entries(stats || {}).map(([key, value], _) => (
                  <div key={key} className="flex justify-between items-center pb-4 border-b border-gray-700/20">
                    <p className={`capitalize ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </p>
                    <p className="text-xl font-bold text-amber-400">{value || 0}</p>
                  </div>
                ))}
              </div>
            </div>
          </FadeIn>
          <FadeIn delay={0.2}>
            <div className={`backdrop-blur-sm rounded-xl p-8 border transition-colors duration-300 ${
              theme === 'dark' ? 'bg-gray-800/50 border-gray-700' : 'bg-white border-amber-100'
            }`}>
              <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
              <div className="space-y-3">
                <Link to="/admin/apartments" className={`block p-4 border hover:border-amber-500/50 rounded-sm transition-all ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                }`}>
                  Manage Apartments
                </Link>
                <Link to="/admin/bookings" className={`block p-4 border hover:border-amber-500/50 rounded-sm transition-all ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                }`}>
                  View Bookings
                </Link>
                <Link to="/admin/messages" className={`block p-4 border hover:border-amber-500/50 rounded-sm transition-all ${
                  theme === 'dark' ? 'border-gray-700' : 'border-gray-300'
                }`}>
                  Check Inquiries
                </Link>
              </div>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
