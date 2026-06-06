import { useState, useEffect, ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { Building2, CalendarDays, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { useTheme } from '../context/ThemeContext';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3001/api/v1';

const FadeIn = ({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 50 }} animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }} transition={{ duration: 0.8, delay, ease: 'easeOut' }} className={className}>{children}</motion.div>
  );
};

interface Apartment {
  id: string;
  title: string;
  price: number | string;
  available: boolean;
}

interface BookingFormData {
  apartment: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  name: string;
  email: string;
  phone: string;
}

interface BookingLocationState {
  apartmentId?: string;
  apartmentTitle?: string;
}

const createInitialFormData = (apartment = ''): BookingFormData => ({
  apartment,
  checkIn: '',
  checkOut: '',
  guests: 1,
  name: '',
  email: '',
  phone: '',
});

const toDateInputValue = (date: Date) => date.toISOString().slice(0, 10);

const addDays = (value: string, days: number) => {
  const date = new Date(`${value}T00:00:00`);
  date.setDate(date.getDate() + days);
  return toDateInputValue(date);
};

const getNightCount = (checkIn: string, checkOut: string) => {
  if (!checkIn || !checkOut) return 0;
  const start = new Date(`${checkIn}T00:00:00`).getTime();
  const end = new Date(`${checkOut}T00:00:00`).getTime();
  return Math.max(0, Math.round((end - start) / 86400000));
};

const formatPrice = (price: number | string) => {
  if (price === '') return '';
  return typeof price === 'number' ? price.toLocaleString() : price;
};

const Booking = () => {
  const { theme } = useTheme();
  const location = useLocation();
  const bookingState = location.state as BookingLocationState | null;
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<BookingFormData>(() => createInitialFormData(bookingState?.apartmentId || ''));
  const [dateError, setDateError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchApartments = async () => {
      try {
        const response = await fetch(`${API_BASE}/apartments?available=true`);
        if (!response.ok) throw new Error('Failed to fetch apartments');
        const data = await response.json();
        setApartments(data.data.items || [
          { id: '1', title: 'Presidential Penthouse', price: 8500, available: true },
          { id: '2', title: 'Deluxe 2-Bedroom', price: 5200, available: true },
        ]);
      } catch (error) {
        console.error('Error fetching apartments:', error);
        setApartments([
          { id: '1', title: 'Presidential Penthouse', price: 8500, available: true },
          { id: '2', title: 'Deluxe 2-Bedroom', price: 5200, available: true },
        ]);
      } finally {
        setLoading(false);
      }
    };
    fetchApartments();
  }, []);

  const today = toDateInputValue(new Date());
  const minimumCheckOut = formData.checkIn ? addDays(formData.checkIn, 1) : today;
  const stayLength = getNightCount(formData.checkIn, formData.checkOut);
  const apartmentOptions = formData.apartment && bookingState?.apartmentTitle && !apartments.some((apt) => apt.id === formData.apartment)
    ? [{ id: formData.apartment, title: bookingState.apartmentTitle, price: '', available: true }, ...apartments]
    : apartments;
  const selectedApartment = apartmentOptions.find((apt) => apt.id === formData.apartment);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && formData.checkIn && formData.checkOut && formData.checkOut <= formData.checkIn) {
      setDateError('Choose a check-out date after your check-in date.');
      return;
    }
    if (step < 3) {
      setDateError('');
      setStep(step + 1);
      return;
    }

    setSubmitting(true);
    try {
      const bookingData = {
        apartmentId: formData.apartment,
        guestName: formData.name,
        guestEmail: formData.email,
        guestPhone: formData.phone,
        checkIn: formData.checkIn,
        checkOut: formData.checkOut,
        guests: formData.guests,
      };

      const response = await fetch(`${API_BASE}/bookings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bookingData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Booking failed');
      }

      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting booking:', error);
      alert(error instanceof Error ? error.message : 'Failed to submit booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDateError('');

    if (name === 'guests') {
      setFormData((current) => ({ ...current, guests: Math.min(10, Math.max(1, parseInt(value) || 1)) }));
      return;
    }

    if (name === 'checkIn') {
      setFormData((current) => ({
        ...current,
        checkIn: value,
        checkOut: current.checkOut && current.checkOut <= value ? '' : current.checkOut,
      }));
      return;
    }

    setFormData((current) => ({ ...current, [name]: value }));
  };

  if (submitted) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="max-w-2xl mx-auto text-center">
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-8">
                <CheckCircle className="h-12 w-12 text-green-400" />
              </div>
              <h1 className={`text-4xl md:text-5xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Booking Request Submitted!</h1>
              <p className={`text-xl mb-8 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>Thank you for your booking request. Our team will review it and get back to you within 24 hours.</p>
              <button onClick={() => { setSubmitted(false); setStep(1); setFormData(createInitialFormData()); }} className="px-10 py-4 bg-amber-500 hover:bg-amber-400 text-black font-semibold rounded-sm transition-all">Book Another</button>
            </div>
          </FadeIn>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className={`pt-24 pb-16 min-h-screen flex items-center justify-center transition-colors duration-300 ${
        theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
      }`}>
        <div className="text-amber-400 text-2xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className={`pt-24 pb-16 transition-colors duration-300 ${
      theme === 'dark' ? 'bg-gradient-to-b from-black via-gray-900 to-black' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50'
    }`}>
      <section className="relative h-[35vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className={`w-full h-full transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gradient-to-b from-gray-900 via-gray-800 to-black' : 'bg-gradient-to-b from-white via-amber-50 to-white'
          }`} />
        </div>
        <div className="relative z-10 text-center px-4"><FadeIn><p className="text-lg text-amber-400 tracking-[0.3em] mb-4 uppercase">Reserve Your Stay</p><h1 className={`text-4xl md:text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Book Your Apartment</h1></FadeIn></div>
      </section>
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className={`backdrop-blur-sm rounded-2xl p-8 md:p-12 border transition-colors duration-300 ${
            theme === 'dark' ? 'bg-gray-800/50 border-gray-700/50' : 'bg-white border-amber-100'
          }`}>
            <form onSubmit={handleSubmit}>
              {step === 1 && <FadeIn><div className="space-y-6">
                {bookingState?.apartmentTitle && formData.apartment && (
                  <div className={`flex items-start gap-3 rounded-sm border p-4 ${
                    theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20 text-amber-100' : 'bg-amber-50 border-amber-100 text-amber-900'
                  }`}>
                    <Building2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-500" />
                    <p className="text-sm">Selected from residence details: <span className="font-semibold">{bookingState.apartmentTitle}</span></p>
                  </div>
                )}
                <div>
                  <label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Select Apartment</label>
                  <select name="apartment" value={formData.apartment} onChange={handleChange} required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                    theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`}>
                    <option value="">Select an apartment</option>
                    {apartmentOptions.map((apt) => (
                      <option key={apt.id} value={apt.id}>
                        {apt.title}{formatPrice(apt.price) ? ` - $${formatPrice(apt.price)}/mo` : ''}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid md:grid-cols-3 gap-6">
                  <div><label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Check-in Date</label><input type="date" name="checkIn" value={formData.checkIn} onChange={handleChange} min={today} required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                    theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`} /></div>
                  <div><label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Check-out Date</label><input type="date" name="checkOut" value={formData.checkOut} onChange={handleChange} min={minimumCheckOut} required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                    theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`} /></div>
                  <div><label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Number of Guests</label><input type="number" name="guests" value={formData.guests} onChange={handleChange} min="1" max="10" required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                    theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`} /></div>
                </div>
                {dateError && <p className="text-sm font-medium text-red-400">{dateError}</p>}
                {(selectedApartment || stayLength > 0) && (
                  <div className={`grid gap-4 rounded-xl border p-5 md:grid-cols-2 ${
                    theme === 'dark' ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white border-amber-100'
                  }`}>
                    <div className="flex items-center gap-3">
                      <Building2 className="h-5 w-5 text-amber-400" />
                      <div>
                        <p className={`text-xs uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Residence</p>
                        <p className="font-semibold">{selectedApartment?.title || 'Choose an apartment'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <CalendarDays className="h-5 w-5 text-amber-400" />
                      <div>
                        <p className={`text-xs uppercase tracking-[0.2em] ${theme === 'dark' ? 'text-gray-500' : 'text-gray-500'}`}>Stay Length</p>
                        <p className="font-semibold">{stayLength > 0 ? `${stayLength} night${stayLength === 1 ? '' : 's'}` : 'Select dates'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div></FadeIn>}
              {step === 2 && <FadeIn><div className="space-y-6">
                <div><label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Full Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                  theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                }`} placeholder="John Doe" /></div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div><label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Email</label><input type="email" name="email" value={formData.email} onChange={handleChange} required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                    theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`} placeholder="john@example.com" /></div>
                  <div><label className={`block mb-2 font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-800'}`}>Phone</label><input type="tel" name="phone" value={formData.phone} onChange={handleChange} required className={`w-full px-4 py-3.5 border rounded-sm focus:outline-none focus:border-amber-500 transition-colors ${
                    theme === 'dark' ? 'bg-gray-900/80 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
                  }`} placeholder="+233 24 123 4567" /></div>
                </div>
              </div></FadeIn>}
              {step === 3 && <FadeIn><div className="space-y-6">
                <h3 className={`text-2xl font-bold mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Review Your Booking</h3>
                <div className={`rounded-xl p-6 border transition-colors duration-300 ${
                  theme === 'dark' ? 'bg-gray-900/50 border-gray-700/50' : 'bg-white border-amber-100'
                }`}>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Apartment: {selectedApartment?.title || 'Not selected'}</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Check-in: {formData.checkIn || 'Not set'}</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Check-out: {formData.checkOut || 'Not set'}</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Nights: {stayLength || 'Not set'}</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Guests: {formData.guests}</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Guest Name: {formData.name || 'Not set'}</p>
                  <p className={`${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>Email: {formData.email || 'Not set'}</p>
                  {selectedApartment && formatPrice(selectedApartment.price) && (
                    <div className={`border-t pt-4 mt-4 ${theme === 'dark' ? 'border-gray-700' : 'border-amber-100'}`}>
                      <p className="text-2xl font-bold text-amber-400">
                        ${formatPrice(selectedApartment.price)}/mo
                      </p>
                    </div>
                  )}
                </div>
              </div></FadeIn>}
              <div className="flex gap-4 mt-10">
                {step > 1 && <button type="button" onClick={() => setStep(step - 1)} className={`flex-1 py-4 border rounded-sm transition-all ${
                  theme === 'dark' ? 'border-gray-600 hover:border-gray-500 text-white' : 'border-gray-300 hover:border-amber-500 text-gray-900'
                } font-semibold`}>Back</button>}
                <button type="submit" disabled={submitting} className={`flex-1 py-4 font-semibold rounded-sm transition-all ${step === 3 ? 'bg-green-500 hover:bg-green-400 text-black' : 'bg-amber-500 hover:bg-amber-400 text-black'} ${submitting ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  {submitting ? 'Submitting...' : step === 3 ? 'Confirm Booking' : 'Continue'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Booking;
