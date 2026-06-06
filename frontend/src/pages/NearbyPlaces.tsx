import { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Coffee, Dumbbell, Landmark, MapPin, ShoppingBag, Star, Utensils } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  );
};

const NearbyPlaces = () => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const categories = [
    {
      id: 'dining',
      name: 'Dining & Restaurants',
      icon: Utensils,
      places: [
        { name: 'The Bistro Labone', distance: '3 min walk', rating: 4.8, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=elegant%20fine%20dining%20restaurant%20luxury%20interior%20ambiance&image_size=square' },
        { name: 'Kozo Restaurant', distance: '5 min walk', rating: 4.6, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20sushi%20restaurant%20elegant%20interior%20design&image_size=square' },
        { name: 'Bistro 22', distance: '7 min drive', rating: 4.7, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=upscale%20bistro%20restaurant%20warm%20modern%20interior%20accra&image_size=square' },
      ],
    },
    {
      id: 'cafes',
      name: 'Cafes & Lounges',
      icon: Coffee,
      places: [
        { name: 'Kukun Cafe', distance: '6 min drive', rating: 4.5, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=bright%20modern%20cafe%20workspace%20plants%20natural%20light&image_size=square' },
        { name: 'Vida e Caffe Labone', distance: '4 min drive', rating: 4.4, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20coffee%20bar%20cafe%20modern%20interior%20warm%20lighting&image_size=square' },
      ],
    },
    {
      id: 'wellness',
      name: 'Wellness & Fitness',
      icon: Dumbbell,
      places: [
        { name: 'Pippa\'s Health Centre', distance: '5 min drive', rating: 4.6, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=premium%20wellness%20center%20fitness%20spa%20calm%20interior&image_size=square' },
        { name: 'Labone Fitness Studio', distance: '8 min walk', rating: 4.5, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=modern%20boutique%20fitness%20studio%20clean%20premium%20equipment&image_size=square' },
      ],
    },
    {
      id: 'shopping',
      name: 'Shopping & Culture',
      icon: ShoppingBag,
      places: [
        { name: 'Osu Oxford Street', distance: '5 min drive', rating: 4.5, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=vibrant%20urban%20shopping%20street%20boutiques%20evening%20lights&image_size=square' },
        { name: 'Artists Alliance Gallery', distance: '10 min drive', rating: 4.7, image: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=contemporary%20african%20art%20gallery%20warm%20museum%20lighting&image_size=square' },
      ],
    },
  ];
  const visibleCategories = selectedCategory === 'all' ? categories : categories.filter((category) => category.id === selectedCategory);

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
      <section className={`sticky top-24 z-30 border-y py-5 backdrop-blur-xl transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gray-950/80 border-gray-800' : 'bg-white/80 border-amber-100'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setSelectedCategory('all')}
              className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-semibold transition-all ${
                selectedCategory === 'all'
                  ? 'bg-amber-500 border-amber-500 text-black'
                  : theme === 'dark' ? 'border-gray-700 text-gray-300 hover:border-amber-500' : 'border-amber-100 text-gray-700 hover:border-amber-400'
              }`}
            >
              <Landmark className="h-4 w-4" />
              All
            </button>
            {categories.map((category) => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setSelectedCategory(category.id)}
                  className={`inline-flex items-center gap-2 rounded-sm border px-4 py-2 text-sm font-semibold transition-all ${
                    selectedCategory === category.id
                      ? 'bg-amber-500 border-amber-500 text-black'
                      : theme === 'dark' ? 'border-gray-700 text-gray-300 hover:border-amber-500' : 'border-amber-100 text-gray-700 hover:border-amber-400'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {category.name}
                </button>
              );
            })}
          </div>
        </div>
      </section>
      <section className="py-24">
        <div className="container mx-auto px-4">
          {visibleCategories.map((category, catIndex) => {
            const Icon = category.icon;
            return (
              <div key={category.id} className="mb-20 last:mb-0">
                <FadeIn delay={catIndex * 0.2}>
                  <div className="flex items-center gap-4 mb-8">
                    <span className="flex h-12 w-12 items-center justify-center rounded-sm bg-amber-500/15 text-amber-400">
                      <Icon className="h-7 w-7" />
                    </span>
                    <h2 className={`text-3xl md:text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{category.name}</h2>
                  </div>
                </FadeIn>
                <div className="grid md:grid-cols-3 gap-6">
                  {category.places.map((place, placeIndex) => (
                    <FadeIn key={place.name} delay={catIndex * 0.2 + placeIndex * 0.1}>
                      <motion.div whileHover={{ y: -6 }} className={`rounded-2xl overflow-hidden border transition-colors duration-300 ${
                        theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                      }`}>
                        <div className="aspect-square overflow-hidden">
                          <img src={place.image} alt={place.name} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                        </div>
                        <div className="p-6">
                          <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{place.name}</h3>
                          <div className="flex items-center justify-between text-sm mb-5">
                            <span className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{place.distance}</span>
                            <span className="text-amber-400 flex items-center gap-1 font-semibold">
                              <Star className="h-4 w-4 fill-current" />
                              {place.rating}
                            </span>
                          </div>
                          <a
                            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${place.name} Accra Ghana`)}`}
                            target="_blank"
                            rel="noreferrer"
                            className={`inline-flex items-center gap-2 text-sm font-semibold transition-colors ${
                              theme === 'dark' ? 'text-gray-300 hover:text-amber-400' : 'text-gray-700 hover:text-amber-500'
                            }`}
                          >
                            <MapPin className="h-4 w-4" />
                            Open directions
                          </a>
                        </div>
                      </motion.div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default NearbyPlaces;
