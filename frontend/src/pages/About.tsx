import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';

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

const Icon = ({ name, className = '' }: { name: string; className?: string }) => {
  const icons = {
    airplane: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
      </svg>
    ),
    theater: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
      </svg>
    ),
    city: (
      <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  };
  return icons[name as keyof typeof icons] || null;
};

const About = () => {
  const { theme } = useTheme();

  const features = [
    {
      title: "Furnished or Unfurnished",
      description: "Choose between fully furnished apartments or bring your own furniture. Foreign tenants can customize their space to feel just like home.",
    },
    {
      title: "24/7 Surveillance & Security",
      description: "State-of-the-art security systems, CCTV surveillance, and on-site security personnel ensure your safety around the clock.",
    },
    {
      title: "Pristine Cleanliness",
      description: "Every apartment is meticulously maintained and kept spotless. We pride ourselves on the highest standards of hygiene.",
    },
    {
      title: "24-Hour Maid Services",
      description: "Professional maid services available around the clock to keep your home looking immaculate and well-maintained.",
    },
    {
      title: "24/7 Customer Support",
      description: "Reach out anytime via email, phone, or our online platform. Our dedicated support team is always ready to assist you.",
    },
  ];

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <section className="relative h-[65vh] flex items-center justify-center overflow-hidden">
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
            onError={(e) => console.error('Video error:', e)}
          >
            <source src="/about.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>
        <div className="relative z-10 text-center px-4">
          <FadeIn>
            <p className="text-lg text-amber-400 tracking-[0.3em] mb-4 uppercase">Our Story</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">About Infinity</h1>
            <p className={`text-xl max-w-3xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Redefining luxury living in the heart of Labone, Accra. Where elegance meets modern sophistication.
            </p>
          </FadeIn>
        </div>
      </section>
      
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <FadeIn>
              <div>
                <p className="text-amber-400 tracking-[0.2em] mb-4 uppercase text-sm">Our Vision</p>
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Crafting Exceptional Living Experiences</h2>
                <p className={`text-lg mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Founded in 2020, Infinity Appartements was born from a passion for creating extraordinary living spaces. 
                  We believe that home is more than just a place to live—it's a reflection of your lifestyle and aspirations.
                </p>
                <p className={`text-lg mb-6 leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>
                  Located in the prestigious neighborhood of Labone, Accra, our residences offer the perfect blend of 
                  modern luxury, comfort, and convenience. Every detail has been meticulously designed to exceed your expectations.
                </p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="relative">
                <div className={`aspect-[4/5] rounded-2xl overflow-hidden border ${theme === 'dark' ? 'border-gray-800' : 'border-amber-100'}`}>
                  <img
                    src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20interior%20modern%20living%20room%20elegant%20design%20cinematic%20lighting&image_size=landscape_4_3"
                    alt="Luxury Interior"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
      
      <section className={`py-20 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-900/30' : 'bg-gradient-to-b from-amber-50 to-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-amber-400 tracking-[0.2em] mb-4 uppercase text-sm">Prime Location</p>
            <h2 className="text-4xl md:text-5xl font-bold">Where Luxury Meets Convenience</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn>
              <div className={`rounded-2xl p-8 border text-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
              }`}>
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Icon name="airplane" className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">10 mins from Airport</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Just a short drive from Kotoka International Airport for effortless travel</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className={`rounded-2xl p-8 border text-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
              }`}>
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Icon name="theater" className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">5 mins to Osu</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Moments from the vibrant energy of Osu's best restaurants and nightlife</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className={`rounded-2xl p-8 border text-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
              }`}>
                <div className="w-16 h-16 mx-auto mb-4 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <Icon name="city" className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className="text-xl font-bold mb-2">Heart of Labone</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Nestled in one of Accra's most exclusive and prestigious neighborhoods</p>
              </div>
            </FadeIn>
          </div>
          
          <div className="mt-16 grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <FadeIn delay={0.3}>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">50+</div>
                <p className="text-gray-500">Restaurants nearby</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.35}>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">20+</div>
                <p className="text-gray-500">Boutiques & shops</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.4}>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">10+</div>
                <p className="text-gray-500">Nightlife spots</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.45}>
              <div className="text-center">
                <div className="text-3xl font-bold text-amber-400 mb-2">5</div>
                <p className="text-gray-500">Star Hotels nearby</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <p className="text-amber-400 tracking-[0.2em] mb-4 uppercase text-sm">Why Choose Us</p>
            <h2 className="text-4xl md:text-5xl font-bold">Premium Services for Premium Living</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`rounded-2xl p-8 border transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                }`}>
                  <h3 className="text-2xl font-bold mb-4 text-amber-400">{feature.title}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-700'}`}>{feature.description}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
