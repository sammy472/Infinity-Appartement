import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { X, ChevronLeft, ChevronRight, Maximize2, Image as ImageIcon } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  );
};

interface GalleryImage {
  url: string;
  title: string;
  category: string;
}

const Gallery = () => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const { theme } = useTheme();

  const galleryImages: GalleryImage[] = [
    {
      url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20living%20room%20modern%20elegant%20design%20cinematic%20lighting&image_size=landscape_16_9',
      title: 'Grand Living Room',
      category: 'Living Spaces'
    },
    {
      url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20bedroom%20king%20size%20bed%20elegant%20design%20premium%20linen&image_size=landscape_4_3',
      title: 'Master Bedroom',
      category: 'Bedrooms'
    },
    {
      url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20kitchen%20modern%20appliances%20marble%20countertops%20elegant&image_size=landscape_16_9',
      title: 'Designer Kitchen',
      category: 'Kitchen'
    },
    {
      url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20bathroom%20marble%20shower%20rain%20head%20elegant%20fixtures&image_size=square',
      title: 'Spa Bathroom',
      category: 'Bathrooms'
    },
    {
      url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20infinity%20pool%20night%20city%20view%20modern%20design&image_size=landscape_16_9',
      title: 'Infinity Pool',
      category: 'Amenities'
    },
    {
      url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20dining%20room%20elegant%20table%20chandelier%20premium%20design&image_size=landscape_4_3',
      title: 'Dining Area',
      category: 'Living Spaces'
    },
    {
      url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20home%20office%20modern%20desk%20elegant%20design%20city%20view&image_size=square',
      title: 'Home Office',
      category: 'Living Spaces'
    },
    {
      url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20walk-in%20closet%20elegant%20design%20premium%20storage&image_size=landscape_4_3',
      title: 'Walk-in Closet',
      category: 'Bedrooms'
    },
    {
      url: 'https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20rooftop%20terrace%20city%20view%20elegant%20outdoor%20furniture&image_size=landscape_16_9',
      title: 'Rooftop Terrace',
      category: 'Amenities'
    },
  ];

  const nextImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! + 1) % galleryImages.length);
  };

  const prevImage = () => {
    if (selectedImageIndex === null) return;
    setSelectedImageIndex((prev) => (prev! - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`w-full h-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gradient-to-br from-gray-900 via-black to-gray-900' : 'bg-gradient-to-br from-white via-amber-50 to-white'
          }`} />
          <div className="absolute inset-0 opacity-20" style={{ 
            backgroundImage: `url(${galleryImages[0].url})`, 
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            filter: 'blur(20px)'
          }} />
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <FadeIn>
            <div className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500/20 rounded-full mb-8">
              <ImageIcon className="w-5 h-5 text-amber-400" />
              <p className="text-amber-400 tracking-[0.2em] uppercase font-medium">Photo Collection</p>
            </div>
            <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
              <span className="text-amber-400">Our</span> Gallery
            </h1>
            <p className={`text-xl max-w-2xl mx-auto ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
              Explore our collection of stunning photographs showcasing every detail of our luxury residences
            </p>
          </FadeIn>
        </div>
      </section>

      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {galleryImages.map((image, i) => (
              <FadeIn key={i} delay={i * 0.08}>
                <motion.div
                  whileHover={{ y: -8, scale: 1.02 }}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`group relative overflow-hidden rounded-3xl cursor-pointer border transition-all duration-300 ${
                    theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                  }`}
                >
                  <div className={`overflow-hidden ${
                    i % 5 === 0 ? 'col-span-1 md:col-span-2 lg:col-span-2 row-span-2' : ''
                  }`}>
                    <img
                      src={image.url}
                      alt={image.title}
                      className={`w-full h-64 md:h-80 object-cover transition-transform duration-700 group-hover:scale-110 ${
                        i % 5 === 0 ? 'md:h-[500px]' : ''
                      }`}
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <p className="text-amber-400 text-sm font-medium mb-1">{image.category}</p>
                    <h3 className="text-white text-xl font-bold">{image.title}</h3>
                  </div>
                  <div className="absolute top-4 right-4 w-12 h-12 bg-amber-500/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                    <Maximize2 className="w-6 h-6 text-black" />
                  </div>
                </motion.div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedImageIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelectedImageIndex(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="max-w-6xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <button
                  onClick={() => setSelectedImageIndex(null)}
                  className="absolute -top-16 right-0 w-12 h-12 bg-gray-800/80 hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>

                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-800/80 hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <ChevronLeft className="w-7 h-7" />
                </button>

                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-14 h-14 bg-gray-800/80 hover:bg-amber-500 rounded-full flex items-center justify-center text-white transition-all"
                >
                  <ChevronRight className="w-7 h-7" />
                </button>

                <img
                  src={galleryImages[selectedImageIndex].url}
                  alt={galleryImages[selectedImageIndex].title}
                  className="w-full h-[70vh] object-contain rounded-2xl"
                />

                <div className="mt-6 text-center">
                  <p className="text-amber-400 text-sm font-medium mb-2">
                    {galleryImages[selectedImageIndex].category}
                  </p>
                  <h2 className="text-white text-2xl font-bold">
                    {galleryImages[selectedImageIndex].title}
                  </h2>
                  <p className="text-gray-400 mt-2">
                    {selectedImageIndex + 1} / {galleryImages.length}
                  </p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Gallery;
