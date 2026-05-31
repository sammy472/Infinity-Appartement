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

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { theme } = useTheme();
  const faqs = [
    { question: 'What amenities are included?', answer: 'Our residences include access to the infinity pool, fitness center, wine lounge, private cinema, sky garden, valet parking, 24/7 concierge, high-speed WiFi, and smart home features.' },
    { question: 'Are the apartments furnished?', answer: 'We offer both furnished and unfurnished options. All apartments come with premium fixtures and appliances, and furniture packages are available upon request.' },
    { question: 'Is parking available?', answer: 'Yes! We offer valet parking service 24/7 for all residents. Each residence comes with dedicated parking spaces based on the unit size.' },
    { question: 'How secure is the building?', answer: 'Our building features 24/7 security, CCTV surveillance, keycard access, biometric entry, and on-site security personnel to ensure your safety and peace of mind.' },
  ];
  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <section className="relative h-[40vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`w-full h-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-b from-white via-amber-50 to-white'
          }`} />
        </div>
        <div className="relative z-10 text-center px-4">
          <FadeIn>
            <p className="text-lg text-amber-400 tracking-[0.3em] mb-4 uppercase">Got Questions?</p>
            <h1 className={`text-5xl md:text-7xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Frequently Asked</h1>
          </FadeIn>
        </div>
      </section>
      <section className="py-24">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <FadeIn key={i} delay={i * 0.1}>
                <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${
                  theme === 'dark' 
                    ? 'bg-gray-800/50 border-gray-700/50' 
                    : 'bg-white border-amber-100'
                }`}>
                  <button 
                    onClick={() => setOpenIndex(openIndex === i ? null : i)} 
                    className={`w-full px-8 py-6 text-left flex justify-between items-center transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800/70' : 'hover:bg-gray-50'
                    }`}
                  >
                    <span className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{faq.question}</span>
                    <motion.span animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-amber-400 text-2xl">▼</motion.span>
                  </button>
                  <AnimatePresence>
                    {openIndex === i && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }}>
                        <div className="px-8 pb-6">
                          <p className={`text-lg leading-relaxed ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>
      <footer className={`py-12 border-t transition-colors duration-300 ${
        theme === 'dark' ? 'border-gray-800 bg-black' : 'border-amber-100 bg-white'
      }`}>
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-2xl font-bold bg-gradient-to-r from-amber-300 to-amber-600 bg-clip-text text-transparent">Infinity</div>
            <p className={`text-sm ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>© 2026 Infinity Appartements. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FAQ;
