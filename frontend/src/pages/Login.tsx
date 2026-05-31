import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  );
};

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const { theme } = useTheme();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className={`min-h-screen flex items-center justify-center pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-br from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <div className="container mx-auto px-4">
        <div className="max-w-md mx-auto">
          <FadeIn>
            <div className={`backdrop-blur-xl rounded-2xl p-10 border shadow-2xl transition-colors duration-300 ${
              theme === 'dark' ? 'bg-gray-800/70 border-gray-700' : 'bg-white border-amber-100'
            }`}>
              <div className="text-center mb-10">
                <p className="text-amber-400 tracking-[0.3em] mb-3 uppercase font-medium text-sm">Infinity Appartements</p>
                <h1 className="text-4xl font-bold mb-2">Welcome Back</h1>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Sign in to your Infinity Appartements account</p>
              </div>
              {error && <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">{error}</motion.div>}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Email Address</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                    theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`} placeholder="you@example.com" />
                </div>
                <div>
                  <label className={`block mb-2 text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Password</label>
                  <input type="password" name="password" value={formData.password} onChange={handleChange} required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                    theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`} placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading} className="w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-sm transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed">{loading ? 'Signing in...' : 'Sign In'}</button>
              </form>
            </div>
          </FadeIn>
        </div>
      </div>
    </div>
  );
};

export default Login;
