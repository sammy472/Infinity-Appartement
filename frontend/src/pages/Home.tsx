import { useEffect, useRef, useState, ReactNode } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTheme } from '../context/ThemeContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const StarIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8 2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
  </svg>
);

const StarRating = ({ count = 5 }: { count?: number }) => (
  <div className="flex gap-1">
    {Array.from({ length: count }).map((_, i) => (
      <StarIcon key={i} className="w-6 h-6 text-amber-400" />
    ))}
  </div>
);

const QuoteIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
  </svg>
);

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

const CarIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
  </svg>
);

const CutleryIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

const ChevronLeftIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
  </svg>
);

const ChevronRightIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const ParallaxLayer = ({ children, speed = 0.5, className = '' }: { children: ReactNode; speed?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });
  const y = useTransform(scrollYProgress, [0, 1], [speed * 150, -speed * 150]);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
};

const CinematicText = ({ text, className = '' }: { text: string; className?: string }) => {
  const words = text.split(' ');
  return (
    <div className={className}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, delay: i * 0.1, ease: 'easeOut' }}
          className="inline-block mr-3 mb-2"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
};

const StaggerReveal = ({ children, staggerChildren = 0.1, className = '' }: { children: React.ReactNode; staggerChildren?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={inView ? 'visible' : 'hidden'}
      variants={{
        visible: {
          transition: {
            staggerChildren,
          },
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const RevealItem = ({ children }: { children: ReactNode }) => {
  return (
    <motion.div
      variants={{
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
      }}
    >
      {children}
    </motion.div>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 250]);
  const titleY = useTransform(scrollY, [0, 800], [0, -150]);
  const opacity = useTransform(scrollY, [0, 600], [1, 0]);
  const scale = useTransform(scrollY, [0, 600], [1, 1.1]);

  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section className="relative h-screen flex items-center justify-center overflow-hidden">
      <motion.div style={{ y: backgroundY, scale }} className="absolute inset-0 z-0">
        <div className="w-full h-full bg-gradient-to-b from-gray-900 via-gray-800 to-black" />
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 w-full h-full object-cover opacity-70"
          onError={(e) => console.error('Video error:', e)}
        >
          <source src="/hero.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
      </motion.div>

      <motion.div animate={{ y: [0, 15, 0], x: [0, 5, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }} className="absolute top-24 left-10 md:left-24 z-10 opacity-30">
        <div className="w-32 h-32 rounded-full border border-amber-400/20" />
      </motion.div>

      <motion.div animate={{ y: [0, -20, 0], x: [0, -8, 0] }} transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 1 }} className="absolute bottom-32 right-10 md:right-24 z-10 opacity-30">
        <div className="w-40 h-40 rounded-full border border-amber-400/20" />
      </motion.div>

      <motion.div style={{ y: titleY, opacity, x: mousePosition.x * -0.5 }} className="relative z-10 text-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.3 }}>
          <p className="text-lg md:text-xl text-amber-400 tracking-[0.3em] mb-6 uppercase">Luxury Living Redefined</p>
        </motion.div>
        <CinematicText text="Infinity Appartements" className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8" />
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }} className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-12">
          Experience unparalleled luxury in the heart of Labone, Accra. Where every detail is crafted for your ultimate comfort.
        </motion.p>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 1.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/residences" className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm transition-all duration-300">
            Explore Residences
          </Link>
          <Link to="/virtual" className="px-10 py-4 border border-gray-600 hover:border-amber-500/50 hover:bg-amber-500/10 text-white font-semibold rounded-sm transition-all duration-300">
            Virtual Tour
          </Link>
        </motion.div>
      </motion.div>

      <motion.div animate={{ y: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-gray-400 tracking-wider uppercase">Scroll</span>
          <div className="w-6 h-10 border-2 border-gray-600 rounded-full flex justify-center pt-2">
            <motion.div animate={{ y: [0, 12, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="w-1.5 h-1.5 bg-amber-400 rounded-full" />
          </div>
        </div>
      </motion.div>
    </section>
  );
};

const AboutSection = () => {
  const { theme } = useTheme();

  return (
    <section id="about" className={`py-32 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black to-gray-900' : 'bg-gradient-to-b from-white to-amber-50'
    }`}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <ParallaxLayer speed={0.3}>
            <div className="relative">
              <div className={`aspect-[4/5] rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-gray-800' : 'border-amber-100'}`}>
                <img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20interior%20modern%20living%20room%20elegant%20design%20cinematic%20lighting&image_size=landscape_4_3" alt="Luxury Interior" className="w-full h-full object-cover" />
              </div>
              <div className={`absolute -bottom-8 -right-8 w-48 h-48 rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-gray-800' : 'border-amber-100'} hidden md:block`}>
                <img src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20infinity%20pool%20night%20city%20view%20modern%20architecture&image_size=square" alt="Infinity Pool" className="w-full h-full object-cover" />
              </div>
            </div>
          </ParallaxLayer>
          <ParallaxLayer speed={0.2}>
            <div>
              <p className="text-amber-400 tracking-[0.2em] mb-4 uppercase text-sm">About Us</p>
              <CinematicText text="Redefining Luxury in Accra" className="text-4xl md:text-5xl font-bold mb-8" />
              <p className={`text-lg mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Infinity Appartements is located in the heart of vibrant Labone, Accra – one of the city's most prestigious and sought-after neighborhoods.
              </p>
              <p className={`text-lg mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                <span className="text-amber-400 font-semibold flex items-center gap-2">
                  <CarIcon className="w-5 h-5" /> 10 mins
                </span> from Kotoka International Airport
                <br/>
                <span className="text-amber-400 font-semibold flex items-center gap-2">
                  <CutleryIcon className="w-5 h-5" /> 5 mins
                </span> from the vibrant streets of Osu
                <br/>
                Surrounded by world-class restaurants, exclusive boutiques, and the city's best nightlife.
              </p>
              <p className={`text-lg mb-8 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                Experience the perfect blend of serene residential living and dynamic urban excitement. Every convenience is at your doorstep.
              </p>
              <Link to="/about" className="inline-flex items-center gap-2 text-amber-400 hover:text-amber-300 font-semibold">
                Learn More
              </Link>
            </div>
          </ParallaxLayer>
        </div>
      </div>
    </section>
  );
};

const AmenitiesSection = () => {
  const { theme } = useTheme();
  
  const amenities = [
    { name: 'Infinity Pool', icon: <PoolIcon className="w-8 h-8 text-amber-400" />, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20infinity%20pool%20night%20modern%20design%20city%20skyline%20premium%20lighting&image_size=landscape_16_9' },
    { name: 'Fitness Center', icon: <DumbbellIcon className="w-8 h-8 text-amber-400" />, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20luxury%20gym%20fitness%20center%20premium%20equipment%20elegant%20design&image_size=landscape_16_9' },
    { name: 'Wine Lounge', icon: <WineGlassIcon className="w-8 h-8 text-amber-400" />, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=elegant%20wine%20lounge%20luxury%20interior%20warm%20lighting%20wood%20design&image_size=landscape_16_9' },
    { name: 'Private Cinema', icon: <FilmIcon className="w-8 h-8 text-amber-400" />, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20private%20cinema%20home%20theater%20plush%20seating%20premium%20lighting&image_size=landscape_16_9' },
    { name: 'Sky Garden', icon: <PlantIcon className="w-8 h-8 text-amber-400" />, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=rooftop%20sky%20garden%20luxury%20green%20space%20modern%20landscaping%20city%20view&image_size=landscape_16_9' },
    { name: 'Spa & Wellness', icon: <SpaIcon className="w-8 h-8 text-amber-400" />, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20spa%20wellness%20center%20relaxing%20atmosphere%20elegant%20design&image_size=landscape_16_9' },
  ];

  return (
    <section id="amenities" className={`py-32 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900/50' : 'bg-gradient-to-b from-amber-50 to-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-amber-400 tracking-[0.2em] mb-4 uppercase text-sm">World-Class Amenities</p>
          <CinematicText text="Experience Luxury Living" className="text-4xl md:text-5xl font-bold" />
        </div>
        <StaggerReveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {amenities.map((amenity, i) => (
              <RevealItem key={i}>
                <motion.div whileHover={{ y: -8 }} className={`rounded-2xl overflow-hidden border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'} group`}>
                  <div className="aspect-video overflow-hidden">
                    <img src={amenity.image} alt={amenity.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <div className="p-8">
                    <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-xl flex items-center justify-center">
                        {amenity.icon}
                      </div>
                      <h3 className="text-xl font-bold">{amenity.name}</h3>
                    </div>
                  </div>
                </motion.div>
              </RevealItem>
            ))}
          </div>
        </StaggerReveal>
        <div className="text-center mt-12">
          <Link to="/amenities" className="inline-flex items-center gap-2 px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm transition-all duration-300">
            View All Amenities
          </Link>
        </div>
      </div>
    </section>
  );
};

const GallerySection = () => {
  const { theme } = useTheme();
  
  const images = [
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20living%20room%20modern%20elegant%20design%20cinematic%20lighting&image_size=landscape_16_9',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20bedroom%20king%20size%20bed%20elegant%20design%20premium%20linen&image_size=landscape_4_3',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20kitchen%20modern%20appliances%20marble%20countertops%20elegant&image_size=landscape_16_9',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20bathroom%20marble%20shower%20rain%20head%20elegant%20fixtures&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20infinity%20pool%20night%20city%20view%20modern%20design&image_size=landscape_16_9',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20dining%20room%20elegant%20table%20chandelier%20premium%20design&image_size=landscape_4_3',
  ];

  return (
    <section id="gallery" className={`py-32 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-gray-900/50 to-black' : 'bg-gradient-to-b from-white to-amber-50'
    }`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-amber-400 tracking-[0.2em] mb-4 uppercase text-sm">Visual Experience</p>
          <CinematicText text="Our Gallery" className="text-4xl md:text-5xl font-bold" />
        </div>
        <StaggerReveal>
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {images.map((img, i) => (
              <RevealItem key={i}>
                <motion.div whileHover={{ scale: 1.02 }} className="break-inside-avoid overflow-hidden rounded-xl cursor-pointer">
                  <img src={img} alt={`Gallery ${i + 1}`} className="w-full transition-transform duration-700 hover:scale-110" />
                </motion.div>
              </RevealItem>
            ))}
          </div>
        </StaggerReveal>
        <div className="text-center mt-12">
          <Link to="/gallery" className="inline-flex items-center gap-2 px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm transition-all duration-300">
            View Full Gallery
          </Link>
        </div>
      </div>
    </section>
  );
};

const TestimonialsSection = () => {
  const { theme } = useTheme();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [testimonials, setTestimonials] = useState<any[]>([
    { name: 'Dr. Kwame Asante', role: 'Surgeon', content: 'Living at Infinity Appartements has been an absolute dream. The amenities are world-class and the service is impeccable.', rating: 5 },
    { name: 'Amara Johnson', role: 'Tech Executive', content: 'The perfect blend of luxury and convenience. The smart home features and high-speed internet make remote work a breeze.', rating: 5 },
    { name: 'Michael Chen', role: 'Investment Banker', content: 'Exceptional attention to detail in every aspect. From the architecture to the concierge service, everything exceeds expectations.', rating: 5 },
  ]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await fetch(`${API_BASE}/testimonials?approved=true`);
        if (!response.ok) {
          throw new Error('Failed to fetch testimonials');
        }
        const data = await response.json();
        const fetchedTestimonials = data.data.items || data.data || [];
        if (fetchedTestimonials.length > 0) {
          setTestimonials(fetchedTestimonials);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      }
    };
    fetchTestimonials();
  }, []);

  // Reset currentIndex if it's out of bounds after testimonials update
  useEffect(() => {
    if (testimonials.length > 0 && currentIndex >= testimonials.length) {
      setCurrentIndex(0);
    }
  }, [testimonials.length, currentIndex]);

  const nextTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }
  };

  const prevTestimonial = () => {
    if (testimonials.length > 0) {
      setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    }
  };

  useEffect(() => {
    if (testimonials.length > 0) {
      const interval = setInterval(nextTestimonial, 5000);
      return () => clearInterval(interval);
    }
  }, [testimonials.length]);

  return (
    <section id="testimonials" className={`py-32 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gray-900/70' : 'bg-gradient-to-b from-amber-50 to-white'
    }`}>
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <p className="text-amber-400 tracking-[0.2em] mb-4 uppercase text-sm">Resident Stories</p>
          <CinematicText text="What Our Residents Say" className="text-4xl md:text-5xl font-bold" />
        </div>
        <div className="relative max-w-4xl mx-auto">
          {testimonials.length > 0 && (
            <>
              <div className="overflow-hidden">
                <motion.div
                  key={currentIndex}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className={`backdrop-blur-sm rounded-2xl p-8 md:p-12 border ${theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'}`}>
                    <div className="mb-6">
                      <QuoteIcon className="w-12 h-12 text-amber-400/30" />
                    </div>
                    <div className="mb-6">
                      <StarRating count={testimonials[currentIndex]?.rating || 5} />
                    </div>
                    <p className={`text-xl md:text-2xl mb-10 leading-relaxed italic ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>"{testimonials[currentIndex]?.comment || testimonials[currentIndex]?.content}"</p>
                    <div className="flex items-center gap-6">
                        {testimonials[currentIndex]?.avatar ? (
                          <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-amber-500/30">
                            <img src={testimonials[currentIndex].avatar} alt={testimonials[currentIndex].name} className="w-full h-full object-cover" />
                          </div>
                        ) : (
                          <div className="w-20 h-20 rounded-full bg-amber-500/20 flex items-center justify-center text-amber-400 font-bold text-2xl border-2 border-amber-500/30">
                            {testimonials[currentIndex]?.name?.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <h4 className={`font-bold text-2xl ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{testimonials[currentIndex]?.name}</h4>
                          {testimonials[currentIndex]?.role && <p className="text-amber-400 text-lg">{testimonials[currentIndex].role}</p>}
                        </div>
                      </div>
                  </div>
                </motion.div>
              </div>
              
              <button
                onClick={prevTestimonial}
                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-12 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-amber-500/20 text-white' : 'bg-white hover:bg-amber-500/20 text-gray-900 border border-amber-100'
                }`}
              >
                <ChevronLeftIcon className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextTestimonial}
                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-12 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                  theme === 'dark' ? 'bg-gray-800 hover:bg-amber-500/20 text-white' : 'bg-white hover:bg-amber-500/20 text-gray-900 border border-amber-100'
                }`}
              >
                <ChevronRightIcon className="w-6 h-6" />
              </button>

              <div className="flex justify-center gap-3 mt-8">
                {testimonials.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`w-3 h-3 rounded-full transition-all ${
                      i === currentIndex ? 'bg-amber-500 w-8' : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
};

const CTA = () => {
  const { theme } = useTheme();
  
  return (
    <section className={`py-24 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black to-gray-900/50' : 'bg-gradient-to-b from-white to-amber-50'
    }`}>
      <div className="container mx-auto px-4">
        <div className="bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent rounded-3xl p-12 md:p-16 border border-amber-500/20">
          <div className="text-center max-w-3xl mx-auto">
            <CinematicText text="Ready to Experience Infinity?" className="text-4xl md:text-5xl font-bold mb-6" />
            <p className={`text-xl mb-10 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Schedule a private tour and discover why Infinity Appartement is the ultimate in luxury living.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/booking" className="px-12 py-5 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-sm transition-all duration-300 text-lg">
                Book Your Tour
              </Link>
              <Link to="/contact" className={`px-12 py-5 border rounded-sm transition-all duration-300 text-lg font-semibold ${
                theme === 'dark' ? 'border-gray-600 hover:border-amber-500/50 hover:bg-amber-500/10 text-white' : 'border-gray-300 hover:border-amber-400/50 hover:bg-amber-500/10 text-gray-900'
              }`}>
                Contact Us
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const Home = () => {
  return (
    <div>
      <Helmet>
        <title>Infinity Appartements - Luxury Living in Labone, Accra</title>
        <meta name="description" content="Experience unparalleled luxury in the heart of Labone, Accra. Premium apartments with world-class amenities, 24/7 security, and concierge services." />
        <meta property="og:title" content="Infinity Appartements - Luxury Living in Labone, Accra" />
        <meta property="og:description" content="Experience unparalleled luxury in the heart of Labone, Accra. Premium apartments with world-class amenities, 24/7 security, and concierge services." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://infinityappartements.com/" />
      </Helmet>
      <Hero />
      <AboutSection />
      <AmenitiesSection />
      <GallerySection />
      <TestimonialsSection />
      <CTA />
    </div>
  );
};

export default Home;
