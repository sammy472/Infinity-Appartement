import { ReactNode, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';
import { ReactPhotoSphereViewer } from 'react-photo-sphere-viewer';
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

interface PanoramaViewerProps {
  url: string;
  title: string;
  type?: 'panorama' | 'video';
}

interface VirtualTour {
  id: number;
  title: string;
  subtitle: string;
  type: 'panorama' | 'video';
  image: string;
}

const PanoramaViewer = ({ url, title, type = 'panorama' }: PanoramaViewerProps) => {
  const viewerRef = useRef<any>(null);
  const { theme } = useTheme();

  return (
    <div className={`relative w-full max-w-6xl mx-auto aspect-video rounded-2xl overflow-hidden border ${
      theme === 'dark' ? 'border-gray-700/50' : 'border-amber-100'
    }`}>
      {type === 'video' ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          onError={(e) => console.error('Video error:', e)}
        >
          <source src={url} type="video/mp4" />
        </video>
      ) : (
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
      )}
    </div>
  );
};

const MoveIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
  </svg>
);

const PlayIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 24 24">
    <path d="M8 5v14l11-7z" />
  </svg>
);

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
    },
    {
      id: 1,
      title: 'Designer Kitchen',
      subtitle: 'Premium appliances',
      type: 'panorama',
      image: '/procurement_2.jpg',
    },
    {
      id: 2,
      title: 'Master Suite',
      subtitle: 'Your sanctuary',
      type: 'panorama',
      image: '/procurement_3.jpg',  
    },
    {
      id: 3,
      title: 'Spa Bathroom',
      subtitle: 'Relax in style',
      type: 'panorama',
      image: '/procurement_4.jpg',
    },
    {
      id: 4,
      title: 'Private Balcony',
      subtitle: 'City views',
      type: 'panorama',
      image: '/panorama.png',
    },
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
            poster="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20interior%20virtual%20tour%20modern%20design%20cinematic&image_size=landscape_16_9"
            onError={(e) => console.error('Video error:', e)}
          >
            <source src="/virtual.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>
        <div className="relative z-10 text-center px-4">
          <FadeIn>
            <p className="text-lg text-amber-400 tracking-[0.3em] mb-4 uppercase">Immersive Tours</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Virtual Tour</h1>
            <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Explore our luxury residences with interactive 3D virtual tours
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          <FadeIn className="mb-16">
            <div className="text-center mb-8">
              <h2 className={`text-3xl font-bold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{virtualTours[currentView].title}</h2>
              <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{virtualTours[currentView].subtitle}</p>
            </div>
            <PanoramaViewer
              url={virtualTours[currentView].image}
              title={virtualTours[currentView].title}
              type={virtualTours[currentView].type}
            />
          </FadeIn>

          <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-4 mt-12">
            {virtualTours.map((tour, index) => (
              <FadeIn key={tour.id} delay={index * 0.05}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setCurrentView(index)}
                  className={`relative rounded-xl overflow-hidden border-2 transition-all ${currentView === index ? 'border-amber-500' : theme === 'dark' ? 'border-gray-700 hover:border-gray-600' : 'border-amber-100 hover:border-amber-300'}`}
                >
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={tour.image}
                      alt={tour.title}
                      className="w-full h-full object-cover"
                    />
                    <div className={`absolute inset-0 transition-all ${currentView === index ? 'bg-amber-500/20' : 'bg-black/30'}`} />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${currentView === index ? 'bg-amber-500' : 'bg-white/20'}`}>
                        <PlayIcon className={`w-6 h-6 ${currentView === index ? 'text-black' : 'text-white'}`} />
                      </div>
                    </div>
                  </div>
                  <div className={`p-3 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}>
                    <p className={`font-semibold text-sm ${currentView === index ? 'text-amber-400' : theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{tour.title}</p>
                  </div>
                </motion.button>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <section className={`py-24 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-t from-black to-gray-900/50' : 'bg-gradient-to-t from-white to-amber-50'
      }`}>
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <FadeIn>
              <p className="text-lg text-amber-400 tracking-[0.3em] mb-4 uppercase">How It Works</p>
              <h2 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Interactive Experience</h2>
            </FadeIn>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FadeIn>
              <div className={`rounded-2xl p-8 border text-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
              }`}>
                <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <MoveIcon className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Drag to Explore</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Click and drag or use touch to look around in any direction</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.1}>
              <div className={`rounded-2xl p-8 border text-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
              }`}>
                <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <PlayIcon className="w-8 h-8 text-amber-400" />
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Switch Rooms</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Select different rooms from the gallery below the viewer</p>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className={`rounded-2xl p-8 border text-center transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
              }`}>
                <div className="w-16 h-16 mx-auto mb-6 bg-amber-500/20 rounded-xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className={`text-xl font-bold mb-2 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Reset Anytime</h3>
                <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Click the reset button to return to the default view</p>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
};

export default VirtualExperiences;
