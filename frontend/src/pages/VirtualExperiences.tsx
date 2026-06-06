import { ReactNode, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
import { ChevronLeft, ChevronRight, Maximize2, Move, MousePointer2, ZoomIn, Sparkles, Play } from 'lucide-react';
import 'react-photo-sphere-viewer/dist/index.css';

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

interface VirtualTour {
  id: number;
  title: string;
  subtitle: string;
  type: 'panorama' | 'video';
  image: string;
  description: string;
}

const VirtualExperiences = () => {
  const [currentView, setCurrentView] = useState(0);
  const { theme } = useTheme();

  const virtualTours: VirtualTour[] = [
    {
      id: 0,
      title: 'Grand Living Room',
      subtitle: 'Enter the luxury',
      type: 'panorama',
      image: '/procurement_1.jpg',
      description: 'Experience our spacious and elegant living room with floor-to-ceiling windows and premium furnishings.'
    },
    {
      id: 1,
      title: 'Designer Kitchen',
      subtitle: 'Premium appliances',
      type: 'panorama',
      image: '/procurement_2.jpg',
      description: 'Our state-of-the-art kitchen features top-of-the-line appliances and beautiful marble countertops.'
    },
    {
      id: 2,
      title: 'Master Suite',
      subtitle: 'Your sanctuary',
      type: 'panorama',
      image: '/procurement_3.jpg',
      description: 'Retreat to your private oasis with a king-size bed, walk-in closet, and stunning views.'
    },
    {
      id: 3,
      title: 'Spa Bathroom',
      subtitle: 'Relax in style',
      type: 'panorama',
      image: '/procurement_4.jpg',
      description: 'Indulge in our spa-inspired bathroom with rainfall shower and luxurious finishes.'
    },
    {
      id: 4,
      title: 'Private Balcony',
      subtitle: 'City views',
      type: 'panorama',
      image: '/panorama.png',
      description: 'Step outside and enjoy breathtaking views of the city skyline from your private balcony.'
    },
  ];

  const nextTour = () => {
    setCurrentView((prev) => (prev + 1) % virtualTours.length);
  };

  const prevTour = () => {
    setCurrentView((prev) => (prev - 1 + virtualTours.length) % virtualTours.length);
  };

  const PanoramaViewer = ({ url, title }: { url: string; title: string }) => {
    const viewerRef = useRef<any>(null);
    return (
      <div className={`relative w-full aspect-[16/9] rounded-3xl overflow-hidden ${
        theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
      }`}>
        <ReactPhotoSphereViewer
          ref={viewerRef}
          src={url}
          panorama={url}
          width="100%"
          height="100%"
          caption={title}
          description="Drag to look around • Scroll to zoom"
          defaultZoomLvl={50}
          minFov={30}
          maxFov={90}
        />
      </div>
    );
  };

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`w-full h-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-white via-amber-50 to-white'
          }`} />
          <div className="absolute inset-0 opacity-30" style={{ 
            backgroundImage: `url(${virtualTours[currentView].image})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)'
          }} />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/20 rounded-full mb-8">
              <Sparkles className="w-5 h-5 text-amber-400" />
              <p className="text-amber-400 tracking-[0.2em] uppercase font-medium">Immersive Experience</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="text-amber-400">Virtual</span> Tours
            </h1>
            <p className={`text-xl max-w-2xl mx-auto mb-12 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Explore every corner of our luxury residences from the comfort of your home
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16 -mt-24 relative z-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="relative">
              <PanoramaViewer
                url={virtualTours[currentView].image}
                title={virtualTours[currentView].title}
              />
              
              <button
                onClick={prevTour}
                className={`absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-900/80 hover:bg-amber-500' 
                    : 'bg-white/80 hover:bg-amber-500'
                }`}
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              
              <button
                onClick={nextTour}
                className={`absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                  theme === 'dark' 
                    ? 'bg-gray-900/80 hover:bg-amber-500' 
                    : 'bg-white/80 hover:bg-amber-500'
                }`}
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>

            <div className="mt-8 text-center">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentView}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <h2 className={`text-3xl md:text-4xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                    {virtualTours[currentView].title}
                  </h2>
                  <p className={`text-lg mb-2 ${theme === 'dark' ? 'text-amber-400' : 'text-amber-600'}`}>
                    {virtualTours[currentView].subtitle}
                  </p>
                  <p className={`max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
                    {virtualTours[currentView].description}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </FadeIn>

          <div className="mt-16">
            <FadeIn>
              <div className="flex flex-wrap justify-center gap-4">
                {virtualTours.map((tour, index) => (
                  <motion.button
                    key={tour.id}
                    whileHover={{ scale: 1.05, y: -4 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentView(index)}
                    className={`relative group rounded-2xl overflow-hidden transition-all ${
                      currentView === index 
                        ? 'ring-4 ring-amber-500' 
                        : ''
                    }`}
                  >
                    <div className="w-32 h-24 md:w-40 md:h-28 overflow-hidden">
                      <img
                        src={tour.image}
                        alt={tour.title}
                        className={`w-full h-full object-cover transition-transform duration-500 ${
                          currentView === index ? 'scale-110' : 'group-hover:scale-110'
                        }`}
                      />
                      <div className={`absolute inset-0 transition-all ${
                        currentView === index 
                          ? 'bg-amber-500/30' 
                          : 'bg-black/40 group-hover:bg-black/20'
                      }`} />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {currentView === index ? (
                          <div className="w-10 h-10 bg-amber-500 rounded-full flex items-center justify-center">
                            <Maximize2 className="w-5 h-5 text-black" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-amber-500/80 transition-all">
                            <Play className="w-5 h-5 text-white" />
                          </div>
                        )}
                      </div>
                    </div>
                    <div className={`p-3 text-center ${
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                    }`}>
                      <p className={`font-semibold text-sm ${
                        currentView === index 
                          ? 'text-amber-400' 
                          : theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
                      }`}>
                        {tour.title}
                      </p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className={`py-24 ${theme === 'dark' ? 'bg-gray-900/30' : 'bg-amber-50/50'}`}>
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="text-center mb-16">
              <p className="text-amber-400 tracking-[0.3em] mb-4 uppercase">How It Works</p>
              <h2 className={`text-4xl md:text-5xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Interactive Controls
              </h2>
            </div>
          </FadeIn>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Move, title: 'Drag to Explore', description: 'Click and drag or use touch to look around in any direction' },
              { icon: ZoomIn, title: 'Scroll to Zoom', description: 'Use your mouse wheel or pinch to zoom in and out' },
              { icon: MousePointer2, title: 'Click to Navigate', description: 'Select any room from the gallery below to explore' }
            ].map((item, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <motion.div 
                  whileHover={{ y: -8 }}
                  className={`rounded-3xl p-8 border text-center transition-all duration-300 ${
                    theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                  }`}
                >
                  <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-amber-500/20 to-amber-500/5 rounded-2xl flex items-center justify-center">
                    <item.icon className="w-10 h-10 text-amber-400" />
                  </div>
                  <h3 className={`text-xl font-bold mb-3 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{item.title}</h3>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{item.description}</p>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default VirtualExperiences;
