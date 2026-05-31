import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const SunIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
  </svg>
);

const MoonIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
  </svg>
);

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout, token } = useAuth();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Residences', href: '/residences' },
    { name: 'Amenities', href: '/amenities' },
    { name: 'Gallery', href: '/gallery' },
    { name: 'Virtual', href: '/virtual' },
    { name: 'Contact', href: '/contact' },
  ];

  const isActive = (href: string) => {
    if (href === '/' && location.pathname === '/') return true;
    if (href !== '/' && location.pathname.startsWith(href)) return true;
    return false;
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b transition-colors duration-300 ${
        theme === 'dark' 
          ? isScrolled ? 'bg-black/95 border-white/5' : 'bg-transparent' 
          : isScrolled ? 'bg-white/95 border-black/5' : 'bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-24">
          <Link
            to="/" className="flex items-center gap-2">
            <span className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Infinity</span>
          </Link>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className={`font-medium tracking-wide transition-colors ${isActive(link.href) ? 'text-amber-500' : theme === 'dark' ? 'text-gray-300 hover:text-amber-400' : 'text-gray-700 hover:text-amber-500'}`}
              >
                {link.name}
              </Link>
            ))}
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-all hover:scale-110 ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-6 h-6 text-amber-400" />
              ) : (
                <MoonIcon className="w-6 h-6 text-gray-800" />
              )}
            </button>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {user && token ? (
            <>
              <Link
                to="/dashboard" className={`px-5 py-2.5 border rounded-sm transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-gray-600 text-white' : 'bg-gray-100 border-gray-200 hover:border-gray-300 text-black'}`}>
                Dashboard
              </Link>
              <button
                onClick={logout} className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm transition-all">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login" className={`px-5 py-2.5 border rounded-sm transition-all ${theme === 'dark' ? 'bg-gray-800 border-gray-700 hover:border-gray-600 text-white' : 'bg-gray-100 border-gray-200 hover:border-gray-300 text-black'}`}>
                Login
              </Link>
              <Link
                to="/signup" className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm transition-all">
                Sign Up
              </Link>
            </>
          )}
          </div>
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg ${
                theme === 'dark' ? 'hover:bg-gray-800' : 'hover:bg-gray-100'
              }`}
              aria-label="Toggle theme"
            >
              {theme === 'dark' ? (
                <SunIcon className="w-6 h-6 text-amber-400" />
              ) : (
                <MoonIcon className="w-6 h-6 text-gray-800" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`p-2 ${theme === 'dark' ? 'text-white' : 'text-black'}`}
            >
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className={`md:hidden py-6 border-t ${theme === 'dark' ? 'border-white/10' : 'border-black/10'}`}>
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className={`py-2 transition-colors ${isActive(link.href) ? 'text-amber-500 font-medium' : theme === 'dark' ? 'text-gray-300 hover:text-amber-400' : 'text-gray-700 hover:text-amber-500'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-gray-800">
                {user && token ? (
              <>
                <Link
                  to="/dashboard" className={`block w-full text-left py-2 font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-amber-400' : 'text-gray-700 hover:text-amber-500'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <button
                  onClick={logout} className={`w-full text-left py-2 font-medium text-amber-500`}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login" className={`block w-full text-left py-2 font-medium ${theme === 'dark' ? 'text-gray-300 hover:text-amber-400' : 'text-gray-700 hover:text-amber-500'}`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Login
                </Link>
                <Link
                  to="/signup" className={`block w-full text-left py-2 font-medium text-amber-500`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Sign Up
                </Link>
              </>
            )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
