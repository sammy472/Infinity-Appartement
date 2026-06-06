import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronRight, Zap, Droplets, Utensils, Dumbbell, Film, Leaf, Heart } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  );
};

const Amenities = () => {
  const { theme } = useTheme();
  const [hoveredAmenity, setHoveredAmenity] = useState<string | null>(null);

  const amenitiesList = [
    { 
      name: 'Infinity Pool', 
      description: 'Relax in our stunning rooftop infinity pool with panoramic city views. Experience breathtaking sunsets and city lights while enjoying a refreshing swim.',
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20infinity%20pool%20night%20modern%20design%20city%20skyline%20premium%20lighting&image_size=landscape_16_9', 
      icon: Droplets,
      features: ['Heated pool', 'Poolside bar', 'Sun loungers', 'City views']
    },
    { 
      name: 'Fitness Center', 
      description: 'State-of-the-art gym with premium equipment and personal training services. Achieve your fitness goals in our luxury wellness facility.',
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20luxury%20gym%20fitness%20center%20premium%20equipment%20elegant%20design&image_size=landscape_16_9', 
      icon: Dumbbell,
      features: ['24/7 access', 'Personal training', 'Yoga studio', 'Premium equipment']
    },
    { 
      name: 'Wine Lounge', 
      description: 'Exclusive wine tasting lounge with an extensive collection of fine wines. A perfect setting for sophisticated gatherings and celebrations.',
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=elegant%20wine%20lounge%20luxury%20interior%20warm%20lighting%20wood%20design&image_size=landscape_16_9', 
      icon: Utensils,
      features: ['Wine cellar', 'Tasting events', 'Cigar lounge', 'Private rooms']
    },
    { 
      name: 'Private Cinema', 
      description: 'Premium home theater experience for private screenings and entertainment. Enjoy the latest films in ultimate comfort and style.',
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20private%20cinema%20home%20theater%20plush%20seating%20premium%20lighting&image_size=landscape_16_9', 
      icon: Film,
      features: ['Dolby Atmos', '4K projection', 'Comfort seating', 'Concierge service']
    },
    { 
      name: 'Sky Garden', 
      description: 'Beautiful rooftop green space perfect for relaxation and social gatherings. A tranquil escape in the heart of the city.',
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=rooftop%20sky%20garden%20luxury%20green%20space%20modern%20landscaping%20city%20view&image_size=landscape_16_9', 
      icon: Leaf,
      features: ['Meditation area', 'Lounge seating', 'Greenery', 'Event space']
    },
    { 
      name: 'Spa & Wellness', 
      description: 'Luxury spa facilities offering massage, skincare, and wellness treatments. Rejuvenate your body and mind in our serene sanctuary.',
      image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20spa%20wellness%20center%20relaxing%20atmosphere%20elegant%20design&image_size=landscape_16_9', 
      icon: Heart,
      features: ['Massage rooms', 'Sauna & steam', 'Facials', 'Wellness packages']
    },
  ];

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`w-full h-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-b from-white via-amber-50 to-white'
          }`} />
          <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-black/40" />
        </div>
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/20 rounded-full mb-6">
              <Zap className="w-5 h-5 text-amber-400" />
              <p className="text-amber-400 tracking-[0.2em] uppercase font-medium">Premium Experience</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="text-amber-400">Luxury</span> Amenities
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Discover world-class facilities designed for your ultimate comfort and enjoyment
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid gap-8">
            {amenitiesList.map((amenity, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -4 }}
                  onMouseEnter={() => setHoveredAmenity(amenity.name)}
                  onMouseLeave={() => setHoveredAmenity(null)}
                  className={`relative overflow-hidden rounded-3xl border transition-all duration-500 ${
                    theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                  }`}
                >
                  <div className="grid md:grid-cols-2 gap-0">
                    <div className="relative aspect-video md:aspect-auto overflow-hidden">
                      <motion.img 
                        src={amenity.image} 
                        alt={amenity.name} 
                        className="w-full h-full object-cover"
                        animate={{ scale: hoveredAmenity === amenity.name ? 1.1 : 1 }}
                        transition={{ duration: 0.7 }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute bottom-6 left-6">
                        <div className="w-16 h-16 bg-amber-500/90 rounded-2xl flex items-center justify-center">
                          <amenity.icon className="w-8 h-8 text-black" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="p-8 md:p-12 flex flex-col justify-center">
                      <h3 className={`text-3xl md:text-4xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                        {amenity.name}
                      </h3>
                      <p className={`text-lg mb-8 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                        {amenity.description}
                      </p>
                      
                      <div className="grid grid-cols-2 gap-4 mb-8">
                        {amenity.features.map((feature, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-amber-500 rounded-full" />
                            <span className={`text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{feature}</span>
                          </div>
                        ))}
                      </div>

                      <motion.button
                        whileHover={{ x: 4 }}
                        className="inline-flex items-center gap-2 text-amber-500 font-semibold text-lg"
                      >
                        Explore more <ChevronRight className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-24 ${theme === 'dark' ? 'bg-gray-900/30' : 'bg-amber-50/50'}`}>
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-amber-400 tracking-[0.3em] mb-4 uppercase">Why Choose Us</p>
              <h2 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Unmatched Lifestyle
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { number: '24/7', label: 'Concierge Service' },
              { number: '5★', label: 'Premium Experience' },
              { number: '100%', label: 'Privacy & Security' },
              { number: '∞', label: 'Infinite Comfort' }
            ].map((stat, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`text-center p-8 rounded-2xl border ${
                  theme === 'dark' ? 'bg-gray-800/30 border-gray-700/30' : 'bg-white border-amber-100'
                }`}>
                  <div className="text-5xl font-bold text-amber-400 mb-3">{stat.number}</div>
                  <p className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{stat.label}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Amenities;
