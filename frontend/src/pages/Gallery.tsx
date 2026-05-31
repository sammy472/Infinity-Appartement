import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  );
};

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { theme } = useTheme();

  const galleryImages = [
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20living%20room%20modern%20elegant%20design%20cinematic%20lighting&image_size=landscape_16_9',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20bedroom%20king%20size%20bed%20elegant%20design%20premium%20linen&image_size=landscape_4_3',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20kitchen%20modern%20appliances%20marble%20countertops%20elegant&image_size=landscape_16_9',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20bathroom%20marble%20shower%20rain%20head%20elegant%20fixtures&image_size=square',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20infinity%20pool%20night%20city%20view%20modern%20design&image_size=landscape_16_9',
    'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20dining%20room%20elegant%20table%20chandelier%20premium%20design&image_size=landscape_4_3',
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
            poster="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20gallery%20apartment%20interior%20exterior%20collage%20cinematic&image_size=landscape_16_9"
            onError={(e) => console.error('Video error:', e)}
          >
            <source src="/293085_medium.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>
        <div className="relative z-10 text-center px-4">
          <FadeIn>
            <p className="text-lg text-amber-400 tracking-[0.3em] mb-4 uppercase">Visual Tour</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Our Gallery</h1>
          </FadeIn>
        </div>
      </section>
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {galleryImages.map((image, i) => (
              <FadeIn key={i} delay={i * 0.05} className="break-inside-avoid">
                <motion.div whileHover={{ scale: 1.02 }} className="relative overflow-hidden rounded-xl cursor-pointer group" onClick={() => setSelectedImage(image)}>
                  <img src={image} alt={`Gallery ${i + 1}`} className="w-full transition-transform duration-700 group-hover:scale-110" />
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }} className="max-w-5xl w-full">
              <div className="relative">
                <button onClick={() => setSelectedImage(null)} className="absolute -top-16 right-0 text-white text-4xl hover:text-amber-400 transition-colors">✕</button>
                <img src={selectedImage} alt="Gallery" className="w-full rounded-xl" />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
