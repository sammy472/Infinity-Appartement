import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { ChevronDown, Search } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  );
};

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [query, setQuery] = useState('');
  const { theme } = useTheme();
  const faqs = [
    { question: 'What amenities are included?', answer: 'Our residences include access to the infinity pool, fitness center, wine lounge, private cinema, sky garden, valet parking, 24/7 concierge, high-speed WiFi, and smart home features.' },
    { question: 'Are the apartments furnished?', answer: 'We offer both furnished and unfurnished options. All apartments come with premium fixtures and appliances, and furniture packages are available upon request.' },
    { question: 'Is parking available?', answer: 'Yes! We offer valet parking service 24/7 for all residents. Each residence comes with dedicated parking spaces based on the unit size.' },
    { question: 'How secure is the building?', answer: 'Our building features 24/7 security, CCTV surveillance, keycard access, biometric entry, and on-site security personnel to ensure your safety and peace of mind.' },
  ];
  const filteredFaqs = faqs.filter((faq) => {
    const searchable = `${faq.question} ${faq.answer}`.toLowerCase();
    return searchable.includes(query.trim().toLowerCase());
  });

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
          <FadeIn>
            <div className="relative mb-8">
              <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-amber-400" />
              <input
                type="search"
                value={query}
                onChange={(event) => {
                  setQuery(event.target.value);
                  setOpenIndex(null);
                }}
                placeholder="Search amenities, parking, security..."
                className={`w-full rounded-sm border py-4 pl-12 pr-4 outline-none transition-colors focus:border-amber-500 ${
                  theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white placeholder:text-gray-500' : 'bg-white border-amber-100 text-gray-900 placeholder:text-gray-400'
                }`}
              />
            </div>
          </FadeIn>
          <div className="space-y-4">
            {filteredFaqs.map((faq, i) => (
              <FadeIn key={faq.question} delay={i * 0.1}>
                <div className={`rounded-xl border overflow-hidden transition-colors duration-300 ${
                  theme === 'dark'
                    ? 'bg-gray-800/50 border-gray-700/50'
                    : 'bg-white border-amber-100'
                }`}>
                  <button
                    onClick={() => setOpenIndex(openIndex === i ? null : i)}
                    className={`w-full px-8 py-6 text-left flex justify-between items-center gap-4 transition-colors ${
                      theme === 'dark' ? 'hover:bg-gray-800/70' : 'hover:bg-gray-50'
                    }`}
                    aria-expanded={openIndex === i}
                  >
                    <span className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{faq.question}</span>
                    <motion.span animate={{ rotate: openIndex === i ? 180 : 0 }} transition={{ duration: 0.3 }} className="text-amber-400 flex-shrink-0">
                      <ChevronDown className="h-6 w-6" />
                    </motion.span>
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
            {filteredFaqs.length === 0 && (
              <div className={`rounded-xl border p-8 text-center ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50 text-gray-400' : 'bg-white border-amber-100 text-gray-600'
              }`}>
                No answers match your search yet.
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default FAQ;
