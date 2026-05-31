import { useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../context/ThemeContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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

const SingleApartment = () => {
  const { id } = useParams<{ id: string }>();
  const [activeImage, setActiveImage] = useState(0);
  const [apartment, setApartment] = useState<Apartment | null>(null);
  const [loading, setLoading] = useState(true);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchApartment = async () => {
      if (!id) return;
      try {
        const response = await fetch(`${API_BASE}/apartments/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch apartment');
        }
        const data = await response.json();
        setApartment(data.data);
      } catch (err) {
        console.error('Error fetching apartment:', err);
        // Fallback data
        setApartment({
          id: '1',
          title: 'The Presidential Penthouse',
          slug: 'presidential-penthouse',
          price: 8500,
          roomCount: 3,
          bathrooms: 3.5,
          squareFootage: 2800,
          available: true,
          featured: true,
          furnished: true,
          location: 'Labone, Accra',
          description: 'Experience luxury living in our stunning Presidential Penthouse. Featuring breathtaking city views, premium finishes, and spacious living areas.',
          images: [
            { url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20penthouse%20living%20room%20city%20view%20modern%20elegant%20design%20cinematic&image_size=landscape_16_9' },
            { url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20penthouse%20bedroom%20king%20bed%20elegant%20design%20city%20view&image_size=landscape_16_9' },
            { url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20penthouse%20kitchen%20modern%20appliances%20marble%20island&image_size=landscape_16_9' }
          ]
        });
      } finally {
        setLoading(false);
      }
    };

    fetchApartment();
  }, [id]);

  if (loading) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-amber-400 text-2xl">Loading apartment...</div>
      </div>
    );
  }

  if (!apartment) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Apartment Not Found</h2>
          <Link to="/residences" className="px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm transition-all">
            Back to Residences
          </Link>
        </div>
      </div>
    );
  }

  const images = apartment.images || [];
  const getPrice = (price: number | string) => {
    const numPrice = typeof price === 'string' ? parseFloat(price) : price;
    return numPrice.toLocaleString();
  };

  // Handle broken images
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    console.log('Image failed to load, using fallback');
    e.currentTarget.src = 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20modern%20elegant%20design&image_size=landscape_16_9';
  };

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <Helmet>
        <title>{apartment.title} - Infinity Appartements</title>
        <meta name="description" content={apartment.description || `Discover ${apartment.title}, a luxury apartment in ${apartment.location || 'Accra'}.`} />
      </Helmet>
      <Navbar />
      <section className="relative">
        <div className="aspect-[16/9] max-h-[70vh] overflow-hidden">
          <img 
            src={images[activeImage]?.url || ''} 
            alt={apartment.title} 
            onError={handleImageError}
            className="w-full h-full object-cover" 
          />
        </div>
        {images.length > 0 && (
          <div className="container mx-auto px-4 -mt-24 relative z-10">
            <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
              {images.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)} 
                  className={`aspect-video rounded-lg overflow-hidden border-2 transition-all ${
                    activeImage === i ? 'border-amber-500' : 'border-transparent hover:border-gray-600'
                  }`}
                >
                  <img src={img.url} alt={`Gallery ${i + 1}`} onError={handleImageError} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>
        )}
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <FadeIn>
                <div>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
                    <div>
                      <h1 className="text-4xl md:text-5xl font-bold mb-2">{apartment.title}</h1>
                      {apartment.location && (
                        <p className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>{apartment.location}</p>
                      )}
                    </div>
                    <div className="text-right">
                      <p className="text-4xl font-bold text-amber-400">${getPrice(apartment.price)}</p>
                      <p className={theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}>per month</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4 mb-8">
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-100 border-gray-200'
                    }`}>
                      <span className="text-amber-400">B</span>
                      <span>{apartment.roomCount} Bed{apartment.roomCount > 1 ? 's' : ''}</span>
                    </div>
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-100 border-gray-200'
                    }`}>
                      <span className="text-amber-400">B</span>
                      <span>{apartment.bathrooms} Bath{apartment.bathrooms > 1 ? 's' : ''}</span>
                    </div>
                    {apartment.squareFootage && (
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-100 border-gray-200'
                      }`}>
                        <span className="text-amber-400">S</span>
                        <span>{apartment.squareFootage.toLocaleString()} sqft</span>
                      </div>
                    )}
                    <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                      apartment.available 
                        ? 'bg-green-500/20 border-green-500/30' 
                        : theme === 'dark' ? 'bg-red-500/20 border-red-500/30' : 'bg-red-100 border-red-200'
                    }`}>
                      <span className={`font-bold ${apartment.available ? 'text-green-400' : 'text-red-400'}`}>
                        {apartment.available ? '✓' : '✗'}
                      </span>
                      <span className={apartment.available ? 'text-green-400' : 'text-red-400'}>
                        {apartment.available ? 'Available' : 'Rented'}
                      </span>
                    </div>
                    {apartment.furnished && (
                      <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${
                        theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-gray-100 border-gray-200'
                      }`}>
                        <span className="text-amber-400">F</span>
                        <span>Furnished</span>
                      </div>
                    )}
                  </div>
                  {apartment.description && (
                    <div className="mb-8">
                      <h2 className="text-2xl font-bold mb-4">Description</h2>
                      <p className={theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}>
                        {apartment.description}
                      </p>
                    </div>
                  )}
                </div>
              </FadeIn>
            </div>
            <div className="lg:col-span-1">
              <FadeIn delay={0.2}>
                <div className={`backdrop-blur-sm rounded-2xl p-8 border sticky top-28 ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                }`}>
                  <h3 className="text-2xl font-bold mb-6">Schedule a Tour</h3>
                  {apartment.available ? (
                    <Link 
                      to="/booking" 
                      state={{ apartmentId: apartment.id, apartmentTitle: apartment.title }}
                      className="block w-full py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm text-center transition-all"
                    >
                      Book Now
                    </Link>
                  ) : (
                    <div className={`py-4 px-6 rounded-sm text-center ${
                      theme === 'dark' ? 'bg-gray-700 text-gray-400' : 'bg-gray-200 text-gray-600'
                    }`}>
                      Not Available
                    </div>
                  )}
                  <div className="mt-6 pt-6 border-t border-gray-700/50">
                    <h4 className="font-semibold mb-3">Quick Info</h4>
                    <ul className={theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}>
                      <li className="py-2 flex justify-between">
                        <span>Price</span>
                        <span className="font-semibold">${getPrice(apartment.price)}/mo</span>
                      </li>
                      <li className="py-2 flex justify-between">
                        <span>Bedrooms</span>
                        <span className="font-semibold">{apartment.roomCount}</span>
                      </li>
                      <li className="py-2 flex justify-between">
                        <span>Bathrooms</span>
                        <span className="font-semibold">{apartment.bathrooms}</span>
                      </li>
                      {apartment.squareFootage && (
                        <li className="py-2 flex justify-between">
                          <span>Square Footage</span>
                          <span className="font-semibold">{apartment.squareFootage.toLocaleString()} sqft</span>
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default SingleApartment;
