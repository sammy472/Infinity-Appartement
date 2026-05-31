import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Lenis from 'lenis';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import About from './pages/About';
import Residences from './pages/Residences';
import SingleApartment from './pages/SingleApartment';
import Amenities from './pages/Amenities';
import Gallery from './pages/Gallery';
import Booking from './pages/Booking';
import NearbyPlaces from './pages/NearbyPlaces';
import FAQ from './pages/FAQ';
import Contact from './pages/Contact';
import VirtualExperiences from './pages/VirtualExperiences';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import { ManageApartments, CreateEditApartment } from './pages/ManageApartments';
import ManageBookings from './pages/ManageBookings';
import ManageMessages from './pages/ManageMessages';
import Analytics from './pages/Analytics';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { useTheme } from './context/ThemeContext';

const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

const ThemedApp = () => {
  const { theme } = useTheme();
  
  return (
    <div className={`min-h-screen flex flex-col transition-colors duration-300 ${
      theme === 'dark' ? 'bg-black text-white' : 'bg-gradient-to-br from-white via-gray-50 to-amber-50 text-gray-900'
    }`}>
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/residences" element={<Residences />} />
          <Route path="/apartment/:id" element={<SingleApartment />} />
          <Route path="/amenities" element={<Amenities />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/nearby" element={<NearbyPlaces />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/virtual" element={<VirtualExperiences />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/admin/apartments" element={<ManageApartments />} />
          <Route path="/admin/apartments/create" element={<CreateEditApartment />} />
          <Route path="/admin/apartments/edit/:id" element={<CreateEditApartment />} />
          <Route path="/admin/bookings" element={<ManageBookings />} />
          <Route path="/admin/messages" element={<ManageMessages />} />
          <Route path="/admin/analytics" element={<Analytics />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <SmoothScroll>
            <ThemedApp />
          </SmoothScroll>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
