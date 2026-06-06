import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  ArrowRight,
  Building2,
  Car,
  CheckCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Users,
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.12, triggerOnce: true });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 36 }}
      animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 36 }}
      transition={{ duration: 0.75, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

const About = () => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const stats = [
    { label: 'Minutes to airport', value: '10', icon: Car },
    { label: 'Concierge support', value: '24/7', icon: Clock },
    { label: 'Premium residences', value: '12+', icon: Building2 },
    { label: 'Labone address', value: '01', icon: MapPin },
  ];

  const standards = [
    {
      title: 'Quiet Luxury',
      text: 'Interiors are designed to feel calm, generous, and easy to live in, with premium finishes and considered storage.',
      icon: Sparkles,
    },
    {
      title: 'Everyday Security',
      text: 'Controlled access, resident-first support, and attentive service create a private home base in the city.',
      icon: ShieldCheck,
    },
    {
      title: 'A Connected Address',
      text: 'Labone puts dining, Osu, embassies, business districts, and Kotoka International Airport within effortless reach.',
      icon: MapPin,
    },
  ];

  const journey = [
    'Private consultation to understand your stay, lifestyle, and preferred residence.',
    'Residence walk-through with availability, furnishing, and service details confirmed clearly.',
    'Arrival support, move-in coordination, and ongoing concierge attention after check-in.',
  ];

  return (
    <div className={`pt-24 transition-colors duration-300 ${
      isDark ? 'bg-black text-white' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50 text-gray-900'
    }`}>
      <Helmet>
        <title>About Infinity Appartements - Luxury Living in Labone, Accra</title>
        <meta name="description" content="Learn about Infinity Appartements, a luxury residence experience in Labone, Accra with refined apartments, concierge support, and a connected city address." />
        <meta property="og:title" content="About Infinity Appartements" />
        <meta property="og:description" content="Luxury serviced living in Labone, Accra, designed around privacy, comfort, and effortless city access." />
      </Helmet>

      <section className="relative min-h-[72vh] overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
          poster="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20lobby%20labone%20accra%20warm%20modern%20architecture%20cinematic&image_size=landscape_16_9"
        >
          <source src="/about.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />

        <div className="container relative z-10 mx-auto flex min-h-[72vh] items-center px-4 py-20">
          <FadeIn className="max-w-3xl">
            <p className="mb-5 text-sm uppercase tracking-[0.3em] text-amber-400">About Infinity</p>
            <h1 className="mb-7 text-5xl font-bold leading-tight text-white md:text-7xl">
              A calmer way to live in Accra.
            </h1>
            <p className="mb-10 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
              Infinity Appartements brings refined residences, thoughtful service, and a prime Labone location together for guests who want the city close and home to feel effortless.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <Link to="/residences" className="inline-flex items-center justify-center gap-2 rounded-sm bg-amber-500 px-8 py-4 font-semibold text-black transition-all hover:bg-amber-400">
                Explore Residences
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link to="/booking" className="inline-flex items-center justify-center gap-2 rounded-sm border border-white/30 px-8 py-4 font-semibold text-white transition-all hover:border-amber-400 hover:bg-amber-500/10">
                Schedule a Tour
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className={`border-y py-8 ${isDark ? 'border-gray-800 bg-gray-950' : 'border-amber-100 bg-white/80'}`}>
        <div className="container mx-auto px-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <FadeIn key={stat.label} delay={index * 0.06}>
                  <div className={`rounded-sm border p-5 ${isDark ? 'border-gray-800 bg-gray-900/70' : 'border-amber-100 bg-white'}`}>
                    <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-sm bg-amber-500/15 text-amber-400">
                      <Icon className="h-6 w-6" />
                    </div>
                    <p className="mb-1 text-3xl font-bold text-amber-400">{stat.value}</p>
                    <p className={isDark ? 'text-gray-400' : 'text-gray-600'}>{stat.label}</p>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`py-28 ${isDark ? 'bg-gradient-to-b from-black to-gray-950' : 'bg-gradient-to-b from-white to-amber-50'}`}>
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-14 lg:grid-cols-[1fr_0.9fr]">
            <FadeIn>
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-amber-400">Our Address</p>
              <h2 className="mb-7 text-4xl font-bold leading-tight md:text-5xl">Rooted in Labone, close to everything.</h2>
              <div className={`space-y-5 text-lg leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                <p>
                  Labone gives Infinity Appartements its rhythm: residential calm, polished restaurants, creative spaces, and fast access to Osu, Cantonments, airport routes, and the city center.
                </p>
                <p>
                  The result is a residence that works for extended stays, relocations, business travel, and private getaways without asking guests to trade comfort for convenience.
                </p>
              </div>
              <div className="mt-9 grid gap-3 sm:grid-cols-2">
                {['Kotoka International Airport nearby', 'Dining and nightlife within minutes', 'Quiet residential surroundings', 'Flexible furnished residences'].map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <CheckCircle className="mt-1 h-5 w-5 flex-shrink-0 text-amber-400" />
                    <span className={isDark ? 'text-gray-300' : 'text-gray-700'}>{item}</span>
                  </div>
                ))}
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <div className="overflow-hidden rounded-sm border border-amber-500/20">
                <img
                  src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=elegant%20luxury%20apartment%20terrace%20labone%20accra%20city%20view%20warm%20evening%20architecture&image_size=portrait_4_5"
                  alt="Infinity Appartements terrace view"
                  className="h-full min-h-[520px] w-full object-cover"
                />
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className={`py-28 ${isDark ? 'bg-gray-950' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <FadeIn className="mx-auto mb-14 max-w-3xl text-center">
            <p className="mb-4 text-sm uppercase tracking-[0.25em] text-amber-400">The Standard</p>
            <h2 className="text-4xl font-bold md:text-5xl">Built for guests who notice the details.</h2>
          </FadeIn>
          <div className="grid gap-6 md:grid-cols-3">
            {standards.map((standard, index) => {
              const Icon = standard.icon;
              return (
                <FadeIn key={standard.title} delay={index * 0.1}>
                  <motion.div
                    whileHover={{ y: -6 }}
                    className={`h-full rounded-sm border p-8 transition-colors ${
                      isDark ? 'border-gray-800 bg-gray-900/70' : 'border-amber-100 bg-amber-50/50'
                    }`}
                  >
                    <div className="mb-7 flex h-12 w-12 items-center justify-center rounded-sm bg-amber-500 text-black">
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-4 text-2xl font-bold">{standard.title}</h3>
                    <p className={`leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{standard.text}</p>
                  </motion.div>
                </FadeIn>
              );
            })}
          </div>
        </div>
      </section>

      <section className={`py-28 ${isDark ? 'bg-gradient-to-b from-gray-950 to-black' : 'bg-gradient-to-b from-amber-50 to-white'}`}>
        <div className="container mx-auto px-4">
          <div className="grid gap-14 lg:grid-cols-[0.9fr_1fr] lg:items-center">
            <FadeIn>
              <div className="overflow-hidden rounded-sm border border-amber-500/20">
                <img
                  src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=luxury%20apartment%20concierge%20arrival%20lobby%20warm%20lighting%20premium%20service&image_size=portrait_4_5"
                  alt="Infinity Appartements arrival service"
                  className="h-full min-h-[520px] w-full object-cover"
                />
              </div>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="mb-4 text-sm uppercase tracking-[0.25em] text-amber-400">Resident Journey</p>
              <h2 className="mb-8 text-4xl font-bold leading-tight md:text-5xl">From first tour to settled-in, the process stays personal.</h2>
              <div className="space-y-5">
                {journey.map((item, index) => (
                  <div key={item} className={`flex gap-5 rounded-sm border p-5 ${
                    isDark ? 'border-gray-800 bg-gray-900/70' : 'border-amber-100 bg-white'
                  }`}>
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-sm bg-amber-500 font-bold text-black">
                      {index + 1}
                    </div>
                    <p className={`leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>{item}</p>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      <section className={`py-24 ${isDark ? 'bg-black' : 'bg-white'}`}>
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className={`grid gap-8 rounded-sm border p-8 md:grid-cols-[1fr_auto] md:items-center md:p-12 ${
              isDark ? 'border-amber-500/20 bg-amber-500/10' : 'border-amber-100 bg-amber-50'
            }`}>
              <div>
                <div className="mb-4 flex items-center gap-3 text-amber-400">
                  <Users className="h-6 w-6" />
                  <span className="text-sm font-semibold uppercase tracking-[0.25em]">Private Tours</span>
                </div>
                <h2 className="mb-4 text-3xl font-bold md:text-4xl">See whether Infinity fits your next chapter.</h2>
                <p className={`max-w-2xl text-lg ${isDark ? 'text-gray-300' : 'text-gray-700'}`}>
                  View available residences, compare layouts, or book a private appointment with the team.
                </p>
              </div>
              <Link to="/booking" className="inline-flex items-center justify-center gap-2 rounded-sm bg-amber-500 px-8 py-4 font-semibold text-black transition-all hover:bg-amber-400">
                Book a Tour
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
};

export default About;
