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

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone?: string;
  message: string;
  apartmentId?: string;
  inquiryType?: string;
  read: boolean;
  createdAt: string;
}

const ManageMessages = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const { theme } = useTheme();
  const { token } = useAuth();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        setLoading(true);
        const response = await fetch(`${API_BASE}/contact`, {
          headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
        });
        if (!response.ok) {
          throw new Error('Failed to fetch messages');
        }
        const data = await response.json();
        setMessages(data.data.items || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [token]);

  const markAsRead = async (id: string) => {
    try {
      setUpdatingId(id);
      const response = await fetch(`${API_BASE}/contact/${id}/read`, {
        method: 'PUT',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
      
      if (response.ok) {
        setMessages(messages.map(msg => 
          msg.id === id ? { ...msg, read: true } : msg
        ));
      } else {
        throw new Error('Failed to mark as read');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to mark as read');
    } finally {
      setUpdatingId(null);
    }
  };

  const deleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to delete this message?')) return;
    
    try {
      setDeletingId(id);
      const response = await fetch(`${API_BASE}/contact/${id}`, {
        method: 'DELETE',
        headers: token ? { 'Authorization': `Bearer ${token}` } : undefined,
      });
      
      if (response.ok) {
        setMessages(messages.filter(msg => msg.id !== id));
      } else {
        throw new Error('Failed to delete message');
      }
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete message');
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleString();
  };

  if (loading) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-amber-400 text-2xl">Loading messages...</div>
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
        <title>Manage Messages - Infinity Appartements</title>
      </Helmet>
      <div className="container mx-auto px-4">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <p className="text-amber-400 tracking-[0.2em] mb-2 uppercase text-sm">Admin Dashboard</p>
              <h1 className="text-4xl font-bold">Manage Messages</h1>
            </div>
            <Link to="/dashboard" className={`px-5 py-2.5 border hover:border-amber-500/50 rounded-sm transition-all ${
              theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            }`}>Back to Dashboard</Link>
          </div>
        </FadeIn>

        {messages.length === 0 ? (
          <div className={`text-center py-20 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
            No messages yet.
          </div>
        ) : (
          <div className="space-y-6">
            {messages.map((msg, i) => (
              <FadeIn key={msg.id} delay={i * 0.05}>
                <motion.div whileHover={{ y: -2 }} className={`backdrop-blur-sm rounded-xl p-6 border transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                } ${!msg.read ? 'border-l-4 border-l-amber-500' : ''}`}>
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-3 mb-2">
                        <h3 className="text-xl font-bold">{msg.name}</h3>
                        {!msg.read && <span className="px-2 py-1 rounded-sm text-xs font-bold bg-amber-500/20 text-amber-400">New</span>}
                      </div>
                      <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                        {msg.email} · {msg.phone || 'No phone'} · {formatDate(msg.createdAt)}
                      </p>
                      {msg.inquiryType && (
                        <p className={`text-xs mb-2 px-2 py-1 inline-block rounded-sm ${
                          theme === 'dark' ? 'bg-gray-700 text-gray-300' : 'bg-gray-200 text-gray-700'
                        }`}>
                          {msg.inquiryType.charAt(0).toUpperCase() + msg.inquiryType.slice(1)}
                        </p>
                      )}
                      <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex flex-col gap-2 min-w-[150px]">
                      {!msg.read && (
                        <button
                          onClick={() => markAsRead(msg.id)}
                          disabled={updatingId === msg.id}
                          className="px-4 py-2 border border-amber-500/30 hover:bg-amber-500/20 text-amber-400 rounded-sm text-sm transition-all disabled:opacity-50"
                        >
                          {updatingId === msg.id ? 'Marking...' : 'Mark as Read'}
                        </button>
                      )}
                      <button
                        onClick={() => deleteMessage(msg.id)}
                        disabled={deletingId === msg.id}
                        className="px-4 py-2 border border-red-500/30 hover:bg-red-500/20 text-red-400 rounded-sm text-sm transition-all disabled:opacity-50"
                      >
                        {deletingId === msg.id ? 'Deleting...' : 'Delete'}
                      </button>
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

export default ManageMessages;
