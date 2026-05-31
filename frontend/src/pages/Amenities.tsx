import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  );
};

const PoolIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const DumbbellIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const WineGlassIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const FilmIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
  </svg>
);

const PlantIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const SpaIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const Amenities = () => {
  const { theme } = useTheme();

  const amenitiesList = [
    { name: 'Infinity Pool', description: 'Relax in our stunning rooftop infinity pool with panoramic city views.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20infinity%20pool%20night%20modern%20design%20city%20skyline%20premium%20lighting&image_size=landscape_16_9', icon: <PoolIcon className="w-12 h-12 text-amber-400" /> },
    { name: 'Fitness Center', description: 'State-of-the-art gym with premium equipment and personal training services.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20luxury%20gym%20fitness%20center%20premium%20equipment%20elegant%20design&image_size=landscape_16_9', icon: <DumbbellIcon className="w-12 h-12 text-amber-400" /> },
    { name: 'Wine Lounge', description: 'Exclusive wine tasting lounge with an extensive collection of fine wines.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=elegant%20wine%20lounge%20luxury%20interior%20warm%20lighting%20wood%20design&image_size=landscape_16_9', icon: <WineGlassIcon className="w-12 h-12 text-amber-400" /> },
    { name: 'Private Cinema', description: 'Premium home theater experience for private screenings and entertainment.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20private%20cinema%20home%20theater%20plush%20seating%20premium%20lighting&image_size=landscape_16_9', icon: <FilmIcon className="w-12 h-12 text-amber-400" /> },
    { name: 'Sky Garden', description: 'Beautiful rooftop green space perfect for relaxation and social gatherings.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=rooftop%20sky%20garden%20luxury%20green%20space%20modern%20landscaping%20city%20view&image_size=landscape_16_9', icon: <PlantIcon className="w-12 h-12 text-amber-400" /> },
    { name: 'Spa & Wellness', description: 'Luxury spa facilities offering massage, skincare, and wellness treatments.', image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20spa%20wellness%20center%20relaxing%20atmosphere%20elegant%20design&image_size=landscape_16_9', icon: <SpaIcon className="w-12 h-12 text-amber-400" /> },
  ];

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
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
            poster="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20amenities%20overview%20pool%20gym%20cinema%20elegant%20design%20cinematic&image_size=landscape_16_9"
            onError={(e) => console.error('Video error:', e)}
          >
            <source src="/amenities.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>
        <div className="relative z-10 text-center px-4">
          <FadeIn>
            <p className="text-lg text-amber-400 tracking-[0.3em] mb-4 uppercase">Premium Experience</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Amenities</h1>
          </FadeIn>
        </div>
      </section>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            {amenitiesList.map((amenity, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div whileHover={{ y: -8 }} className={`rounded-2xl overflow-hidden border transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                }`}>
                  <div className="aspect-video overflow-hidden">
                    <img src={amenity.image} alt={amenity.name} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-16 h-16 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        {amenity.icon}
                      </div>
                      <h3 className="text-2xl font-bold">{amenity.name}</h3>
                    </div>
                    <p className={`text-lg ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{amenity.description}</p>
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

export default Amenities;
