import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../context/ThemeContext';

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

interface ApartmentImage {
  id?: string;
  url: string;
  isPrimary?: boolean;
  order?: number;
}

interface Apartment {
  id: string;
  title: string;
  slug: string;
  price: number | string;
  roomCount: number;
  bathrooms: number;
  squareFootage?: number;
  available: boolean;
  featured: boolean;
  description?: string;
  furnished: boolean;
  tourUrl?: string;
  location?: string;
  images?: ApartmentImage[];
}

const Residences = () => {
  const [filters, setFilters] = useState({ beds: 'all', available: true });
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const params = new URLSearchParams();
        if (filters.available) {
          params.append('available', 'true');
        }

        const response = await fetch(`${API_BASE}/apartments?${params.toString()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch apartments');
        }
        const data = await response.json();
        setApartments(data.data.items || []);
        console.log('Fetched apartments:', data.data.items || []);
      } catch (err) {
        console.error('Error fetching apartments:', err);
        setApartments([
          {
            id: '1',
            title: 'Presidential Penthouse',
            slug: 'presidential-penthouse',
            price: 8500,
            roomCount: 3,
            bathrooms: 3.5,
            squareFootage: 2800,
            available: true,
            featured: true,
            furnished: true,
            images: [{ url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20penthouse%20living%20room%20city%20view%20modern%20elegant%20design&image_size=landscape_16_9' }],
          },
          {
            id: '2',
            title: 'Deluxe 2-Bedroom',
            slug: 'deluxe-2-bedroom',
            price: 5200,
            roomCount: 2,
            bathrooms: 2,
            squareFootage: 1600,
            available: true,
            featured: false,
            furnished: true,
            images: [{ url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%202%20bedroom%20apartment%20modern%20interior%20elegant%20design&image_size=landscape_16_9' }],
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, [filters.available]);

  const filteredApartments = apartments.filter((apt) => {
    if (filters.beds !== 'all') {
      const beds = parseInt(filters.beds);
      if (beds === 3 && apt.roomCount < 3) return false;
      if (beds !== 3 && apt.roomCount !== beds) return false;
    }
    if (filters.available && !apt.available) return false;
    return true;
  });

  const getImageUrl = (apt: Apartment) => {
    console.log('Getting image for apartment:', apt.title, apt.images);
    // First try to find the primary image
    const primaryImage = apt.images?.find(img => img.isPrimary);
    if (primaryImage?.url) {
      return primaryImage.url;
    }
    // If no primary image, use the first one
    if (apt.images?.[0]?.url) {
      return apt.images[0].url;
    }
    // Fallback to default image
    return 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20modern%20elegant%20design&image_size=landscape_16_9';
  };

  // Handle broken images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load, using fallback');
    e.currentTarget.src = 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20modern%20elegant%20design&image_size=landscape_16_9';
  };

  const getPrice = (apt: Apartment) => {
    const price = typeof apt.price === 'string' ? parseFloat(apt.price) : apt.price;
    return price.toLocaleString();
  };

  if (loading) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-amber-400 text-2xl">Loading residences...</div>
      </div>
    );
  }

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <Helmet>
        <title>Residences & Availability - Infinity Appartements</title>
        <meta name="description" content="Browse our complete collection of luxury apartments in Labone, Accra. Check real-time availability and find your perfect home." />
        <meta property="og:title" content="Residences & Availability - Infinity Appartements" />
        <meta property="og:description" content="Browse our complete collection of luxury apartments in Labone, Accra. Check real-time availability and find your perfect home." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://infinityappartements.com/residences" />
      </Helmet>
      <section className="relative h-[60vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`w-full h-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-b from-white via-amber-50 to-white'
          }`} />
          <video
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="absolute inset-0 w-full h-full object-cover opacity-70"
            poster="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20building%20exterior%20modern%20architecture%20cinematic%20availability&image_size=landscape_16_9"
            onError={(e) => console.error('Video error:', e)}
          >
            <source src="/residences.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>
        <div className="relative z-10 text-center px-4">
          <FadeIn>
            <p className="text-lg text-amber-400 tracking-[0.3em] mb-4 uppercase">Find Your Home</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Residences & Availability</h1>
            <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Browse our complete collection and check real-time availability
            </p>
          </FadeIn>
        </div>
      </section>

      <section className={`py-8 border-y sticky top-16 z-40 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900/70 border-gray-800' : 'bg-white/70 border-amber-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center gap-2">
              <label className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>Bedrooms:</label>
              <select
                value={filters.beds}
                onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
                className={`px-3 py-2 border rounded-sm transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`}
              >
                <option value="all">All</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3+</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="available"
                checked={filters.available}
                onChange={(e) => setFilters({ ...filters, available: e.target.checked })}
                className="w-4 h-4 mr-1 text-amber-500"
              />
              <label htmlFor="available" className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Available only</label>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredApartments.map((apt, i) => (
              <FadeIn key={apt.id} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8 }} className={`backdrop-blur-sm rounded-2xl overflow-hidden border transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                }`}>
                  <div className="relative">
                    <div className="aspect-video overflow-hidden">
                      <img src={getImageUrl(apt)} alt={apt.title} onError={handleImageError} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                    </div>
                    <div
                      className={`absolute top-4 right-4 px-4 py-2 font-bold rounded-sm text-sm ${apt.available ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}
                    >
                      {apt.available ? 'Available' : 'Rented'}
                    </div>
                  </div>
                  <div className="p-7">
                    <h3 className="text-xl font-bold mb-3">{apt.title}</h3>
                    <div className={`flex gap-4 text-sm mb-5 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                      <span>{apt.squareFootage?.toLocaleString() || ''} sqft</span>
                      <span>{apt.roomCount} Bed{apt.roomCount > 1 ? 's' : ''}</span>
                      <span>{apt.bathrooms} Bath{apt.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <p className="text-3xl font-bold text-amber-400">${getPrice(apt)}/mo</p>
                      <Link
                        to={`/apartment/${apt.id}`}
                        className={`px-5 py-2.5 font-semibold rounded-sm transition-all ${
                          apt.available 
                            ? 'bg-amber-500 hover:bg-amber-400 text-black' 
                            : theme === 'dark' ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                      >
                        {apt.available ? 'View Details' : 'Not Available'}
                      </Link>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Residences;
