import { ReactNode, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  );
};

const LocationIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const PhoneIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const EnvelopeIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const ClockIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckIcon = ({ className = '' }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
  </svg>
);

const Contact = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const { theme } = useTheme();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const response = await fetch(`${API_BASE}/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to send message');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error sending message:', error);
      alert(error instanceof Error ? error.message : 'Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setFormData({ ...formData, [e.target.name]: e.target.value });

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
            poster="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20building%20lobby%20contact%20us%20elegant%20design%20cinematic&image_size=landscape_16_9"
            onError={(e) => console.error('Video error:', e)}
          >
            <source src="/293085_medium.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30" />
        </div>
        <div className="relative z-10 text-center px-4">
          <FadeIn>
            <p className="text-lg text-amber-400 tracking-[0.3em] mb-4 uppercase">Get In Touch</p>
            <h1 className="text-5xl md:text-7xl font-bold mb-6">Contact Us</h1>
          </FadeIn>
        </div>
      </section>
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <FadeIn>
              <div className={`backdrop-blur-sm rounded-2xl p-8 md:p-10 border transition-colors duration-300 ${
                theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
              }`}>
                {submitted ? (
                  <div className="text-center py-10">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckIcon className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Message Sent!</h3>
                    <p className={`mb-8 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Thank you for reaching out. Our team will get back to you soon.</p>
                    <button onClick={() => { setSubmitted(false); setFormData({ name: '', email: '', phone: '', message: '' }); }} className="px-8 py-3 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm transition-all">Send Another</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Full Name</label>
                      <input type="text" name="name" value={formData.name} onChange={handleChange} required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                        theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`} placeholder="John Doe" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`} placeholder="john@example.com" />
                      </div>
                      <div>
                        <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Phone</label>
                        <input type="tel" name="phone" value={formData.phone} onChange={handleChange} className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                          theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                        }`} placeholder="+233 24 123 4567" />
                      </div>
                    </div>
                    <div>
                      <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Message</label>
                      <textarea name="message" value={formData.message} onChange={handleChange} required rows={5} className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 resize-none transition-colors ${
                        theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                      }`} placeholder="How can we help you?" />
                    </div>
                    <button type="submit" disabled={submitting} className={`w-full py-4 font-semibold rounded-sm transition-all ${submitting ? 'bg-gray-600 cursor-not-allowed' : 'bg-amber-500 hover:bg-amber-400 text-black'}`}>
                      {submitting ? 'Sending...' : 'Send Message'}
                    </button>
                  </form>
                )}
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div className="space-y-8">
                <div className={`rounded-2xl p-8 border transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
                }`}>
                  <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <LocationIcon className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Address</p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>123 Labone Road, Labone, Accra, Ghana</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <PhoneIcon className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Phone</p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>+233 24 123 4567</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <EnvelopeIcon className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Email</p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>info@infinityappartements.com</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center">
                        <ClockIcon className="w-6 h-6 text-amber-400" />
                      </div>
                      <div>
                        <p className="font-semibold mb-1">Hours</p>
                        <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Mon-Sun: 9:00 AM - 9:00 PM</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className={`rounded-2xl overflow-hidden border transition-colors duration-300 ${
                  theme === 'dark' ? 'border-gray-700/50' : 'border-amber-100'
                }`}>
                  <iframe
                    title="Infinity Appartements Location"
                    width="100%"
                    height="400"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src="https://www.openstreetmap.org/export/embed.html?bbox=-0.1924%2C5.5725%2C-0.1676%2C5.5875&layer=mapnik&marker=5.58%2C-0.18"
                    allowFullScreen
                  ></iframe>
                  <div className={`p-4 text-center ${theme === 'dark' ? 'bg-gray-800/50' : 'bg-white'}`}>
                    <a
                      href="https://www.openstreetmap.org/?mlat=5.58&mlon=-0.18#map=15/5.58/-0.18"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-amber-400 hover:text-amber-300 font-medium text-sm"
                    >
                      View Larger Map
                    </a>
                  </div>
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
