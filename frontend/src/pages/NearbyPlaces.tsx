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

const NearbyPlaces = () => {
  const { theme } = useTheme();
  const categories = [
    {
      name: 'Dining & Restaurants',
      icon: 'D',
      places: [
        { name: 'The Bistro Labone', distance: '3 min walk', rating: 4.8, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=elegant%20fine%20dining%20restaurant%20luxury%20interior%20ambiance&image_size=square' },
        { name: 'Kozo Restaurant', distance: '5 min walk', rating: 4.6, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20sushi%20restaurant%20elegant%20interior%20design&image_size=square' },
      ],
    },
  ];
  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <section className="relative h-[45vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`w-full h-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-b from-white via-amber-50 to-white'
          }`} />
        </div>
        <div className="relative z-10 text-center px-4">
          <FadeIn>
            <p className="text-lg text-amber-400 tracking-[0.3em] mb-4 uppercase">Location</p>
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Nearby Places</h1>
          </FadeIn>
        </div>
      </section>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {categories.map((category, catIndex) => (
            <div key={catIndex} className="mb-20">
              <FadeIn delay={catIndex * 0.2}>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-4xl font-bold text-amber-400">{category.icon}</span>
                  <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{category.name}</h2>
                </div>
              </FadeIn>
              <div className="grid md:grid-cols-3 gap-6">
                {category.places.map((place, placeIndex) => (
                  <FadeIn key={placeIndex} delay={catIndex * 0.2 + placeIndex * 0.1}>
                    <motion.div whileHover={{ y: -6 }} className={`rounded-2xl overflow-hidden border transition-colors duration-300 ${
                      theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                    }`}>
                      <div className="aspect-square overflow-hidden">
                        <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                      </div>
                      <div className="p-6">
                        <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{place.name}</h3>
                        <div className="flex items-center justify-between text-sm mb-3">
                          <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{place.distance}</span>
                          <span className="text-amber-400 flex items-center gap-1 font-semibold">★ {place.rating}</span>
                        </div>
                      </div>
                    </motion.div>
                  </FadeIn>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      <footer className={`py-12 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'border-gray-800 bg-black' : 'border-amber-100 bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Infinity</div>
            <p className="text-gray-500 text-sm">© 2026 Infinity Appartements. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default NearbyPlaces;
