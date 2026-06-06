import { useState, useEffect, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Search, SlidersHorizontal, X, Bed, Bath, Maximize, Home, Check, Star } from 'lucide-react';
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
  const [filters, setFilters] = useState({ beds: 'all', available: true, query: '', maxPrice: 'all', furnished: 'all', sort: 'featured' });
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
            description: 'Luxurious penthouse with panoramic city views, private rooftop terrace, and premium finishes throughout.',
            location: 'Labone, Accra',
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
            description: 'Spacious 2-bedroom apartment with modern design, premium appliances, and abundant natural light.',
            location: 'Labone, Accra',
            images: [{ url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%202%20bedroom%20apartment%20modern%20interior%20elegant%20design&image_size=landscape_16_9' }],
          },
          {
            id: '3',
            title: 'Executive Suite',
            slug: 'executive-suite',
            price: 6800,
            roomCount: 2,
            bathrooms: 2.5,
            squareFootage: 2100,
            available: true,
            featured: true,
            furnished: true,
            description: 'Premium executive suite with separate living and dining areas, private study, and luxury finishes.',
            location: 'Labone, Accra',
            images: [{ url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20executive%20apartment%20modern%20elegant%20design&image_size=landscape_16_9' }],
          },
          {
            id: '4',
            title: 'Studio Loft',
            slug: 'studio-loft',
            price: 3200,
            roomCount: 1,
            bathrooms: 1,
            squareFootage: 850,
            available: false,
            featured: false,
            furnished: true,
            description: 'Charming studio loft with high ceilings, open concept design, and premium finishes.',
            location: 'Labone, Accra',
            images: [{ url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20studio%20loft%20modern%20design&image_size=landscape_16_9' }],
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchApartments();
  }, [filters.available]);

  const getNumericPrice = (price: number | string) => {
    const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
    return Number.isFinite(numericPrice) ? numericPrice : 0;
  };

  const filteredApartments = apartments.filter((apt) => {
    const query = filters.query.trim().toLowerCase();
    if (query) {
      const searchable = `${apt.title} ${apt.location || ''} ${apt.description || ''}`.toLowerCase();
      if (!searchable.includes(query)) return false;
    }
    if (filters.beds !== 'all') {
      const beds = parseInt(filters.beds);
      if (beds === 3 && apt.roomCount < 3) return false;
      if (beds !== 3 && apt.roomCount !== beds) return false;
    }
    if (filters.available && !apt.available) return false;
    if (filters.maxPrice !== 'all' && getNumericPrice(apt.price) > parseInt(filters.maxPrice)) return false;
    if (filters.furnished !== 'all' && String(apt.furnished) !== filters.furnished) return false;
    return true;
  });

  const displayedApartments = [...filteredApartments].sort((a, b) => {
    if (filters.sort === 'price-asc') return getNumericPrice(a.price) - getNumericPrice(b.price);
    if (filters.sort === 'price-desc') return getNumericPrice(b.price) - getNumericPrice(a.price);
    if (filters.sort === 'beds-desc') return b.roomCount - a.roomCount;
    return Number(b.featured) - Number(a.featured) || getNumericPrice(a.price) - getNumericPrice(b.price);
  });

  const hasActiveFilters = filters.query || filters.beds !== 'all' || !filters.available || filters.maxPrice !== 'all' || filters.furnished !== 'all' || filters.sort !== 'featured';
  const resetFilters = () => setFilters({ beds: 'all', available: true, query: '', maxPrice: 'all', furnished: 'all', sort: 'featured' });

  const getImageUrl = (apt: Apartment) => {
    const primaryImage = apt.images?.find(img => img.isPrimary);
    if (primaryImage?.url) {
      return primaryImage.url;
    }
    if (apt.images?.[0]?.url) {
      return apt.images[0].url;
    }
    return 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20modern%20elegant%20design&image_size=landscape_16_9';
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
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
      
      <section className="relative min-h-[75vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`w-full h-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-white via-amber-50 to-white'
          }`} />
          <div className="absolute inset-0 opacity-25" style={{ 
            backgroundImage: `url(https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20building%20exterior%20modern%20architecture%20cinematic&image_size=landscape_16_9)`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(15px)'
          }} />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/20 rounded-full mb-8">
              <Home className="w-5 h-5 text-amber-400" />
              <p className="text-amber-400 tracking-[0.2em] uppercase font-medium">Find Your Home</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="text-amber-400">Our</span> Residences
            </h1>
            <p className={`text-xl max-w-2xl mx-auto mb-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Explore our exceptional collection of luxury apartments and find your perfect residence in Labone, Accra
            </p>
          </FadeIn>
        </div>
      </section>

      <section className={`py-8 border-y sticky top-16 z-40 backdrop-blur-2xl transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900/90 border-gray-800' : 'bg-white/90 border-amber-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div className="flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-amber-400" />
                <span className={`text-sm font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Filter Residences</span>
              </div>
              <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                Showing <span className="text-amber-400 font-bold">{displayedApartments.length}</span> of {apartments.length} residences
              </span>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-6">
              <div className="relative lg:col-span-2">
                <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400" />
                <input
                  type="search"
                  value={filters.query}
                  onChange={(e) => setFilters({ ...filters, query: e.target.value })}
                  placeholder="Search residences..."
                  className={`w-full border rounded-xl py-3 pl-12 pr-4 outline-none transition-all focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 ${
                    theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-gray-200 text-gray-900 placeholder:text-gray-400'
                  }`}
                />
              </div>
              
              <select
                value={filters.beds}
                onChange={(e) => setFilters({ ...filters, beds: e.target.value })}
                className={`px-4 py-3 border rounded-xl transition-all duration-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">All Bedrooms</option>
                <option value="1">1 Bedroom</option>
                <option value="2">2 Bedrooms</option>
                <option value="3">3+ Bedrooms</option>
              </select>
              
              <select
                value={filters.maxPrice}
                onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                className={`px-4 py-3 border rounded-xl transition-all duration-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="all">Any Price</option>
                <option value="4000">Up to $4,000</option>
                <option value="6000">Up to $6,000</option>
                <option value="9000">Up to $9,000</option>
              </select>
              
              <select
                value={filters.sort}
                onChange={(e) => setFilters({ ...filters, sort: e.target.value })}
                className={`px-4 py-3 border rounded-xl transition-all duration-300 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 ${
                  theme === 'dark' ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-200 text-gray-900'
                }`}
              >
                <option value="featured">Featured First</option>
                <option value="price-asc">Lowest Price</option>
                <option value="price-desc">Highest Price</option>
                <option value="beds-desc">Most Bedrooms</option>
              </select>
              
              <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 cursor-pointer transition-all hover:border-amber-400 ${
                theme === 'dark' ? 'border-gray-700 bg-gray-800' : 'border-gray-200 bg-white'
              }`}>
                <input
                  type="checkbox"
                  id="available"
                  checked={filters.available}
                  onChange={(e) => setFilters({ ...filters, available: e.target.checked })}
                  className="h-5 w-5 text-amber-500 rounded"
                />
                <label htmlFor="available" className="text-sm font-medium cursor-pointer">Available Only</label>
              </div>
            </div>
            
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className={`inline-flex items-center gap-2 text-sm font-semibold transition-all hover:text-amber-400 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                }`}
              >
                <X className="h-4 w-4" />
                Clear All Filters
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4">
          {displayedApartments.length > 0 ? (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">
              {displayedApartments.map((apt, i) => (
                <FadeIn key={apt.id} delay={i * 0.1}>
                  <motion.div
                    whileHover={{ y: -12 }}
                    className={`group rounded-3xl overflow-hidden border transition-all duration-300 ${
                      theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                    }`}
                  >
                    <div className="relative">
                      <div className="aspect-[4/3] overflow-hidden">
                        <img
                          src={getImageUrl(apt)}
                          alt={apt.title}
                          onError={handleImageError}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                      <div className="absolute top-4 left-4 flex gap-2">
                        {apt.available && (
                          <div className="px-4 py-2 bg-green-500 text-black font-bold rounded-xl text-sm flex items-center gap-1">
                            <Check className="w-4 h-4" />
                            Available
                          </div>
                        )}
                        {apt.featured && (
                          <div className="px-4 py-2 bg-amber-500 text-black font-bold rounded-xl text-sm flex items-center gap-1">
                            <Star className="w-4 h-4" />
                            Featured
                          </div>
                        )}
                        {!apt.available && (
                          <div className="px-4 py-2 bg-red-500 text-white font-bold rounded-xl text-sm">
                            Rented
                          </div>
                        )}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                    
                    <div className="p-8">
                      <h3 className={`text-2xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {apt.title}
                      </h3>
                      
                      {apt.location && (
                        <p className={`text-sm mb-4 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {apt.location}
                        </p>
                      )}
                      
                      {apt.description && (
                        <p className={`text-sm mb-6 line-clamp-2 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                          {apt.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap gap-4 mb-6">
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700/50' : 'bg-amber-50'
                        }`}>
                          <Bed className="w-4 h-4 text-amber-400" />
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {apt.roomCount} Bed{apt.roomCount > 1 ? 's' : ''}
                          </span>
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                          theme === 'dark' ? 'bg-gray-700/50' : 'bg-amber-50'
                        }`}>
                          <Bath className="w-4 h-4 text-amber-400" />
                          <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                            {apt.bathrooms} Bath{apt.bathrooms > 1 ? 's' : ''}
                          </span>
                        </div>
                        {apt.squareFootage && (
                          <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${
                            theme === 'dark' ? 'bg-gray-700/50' : 'bg-amber-50'
                          }`}>
                            <Maximize className="w-4 h-4 text-amber-400" />
                            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                              {apt.squareFootage.toLocaleString()} sqft
                            </span>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between pt-4 border-t border-gray-200/30">
                        <div>
                          <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                            Monthly Rent
                          </p>
                          <p className="text-3xl font-bold text-amber-400">
                            ${getPrice(apt)}
                          </p>
                        </div>
                        <Link
                          to={`/apartment/${apt.id}`}
                          className={`px-6 py-3 font-semibold rounded-xl transition-all ${
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
          ) : (
            <FadeIn>
              <div className={`mx-auto max-w-2xl rounded-3xl border p-12 text-center ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
              }`}>
                <h3 className={`mb-3 text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                  No residences match your filters
                </h3>
                <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                  Try widening your search criteria to see more options
                </p>
                <button
                  onClick={resetFilters}
                  className="inline-flex items-center gap-2 rounded-xl bg-amber-500 px-8 py-4 font-semibold text-black transition-all hover:bg-amber-400"
                >
                  <X className="h-5 w-5" />
                  Clear All Filters
                </button>
              </div>
            </FadeIn>
          )}
        </div>
      </section>
    </div>
  );
};

export default Residences;