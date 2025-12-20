import { useState } from 'react';
import { FrappeProvider, useFrappeGetDoc } from 'frappe-react-sdk';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import UpdatePassword from './pages/auth/UpdatePassword';

import AboutUs from './pages/AboutUs';
import ContactUs from './pages/ContactUs';
import MyAccount from './pages/MyAccount';
import HowItWorks from './pages/HowItWorks';
import FAQs from './pages/FAQs';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsOfService from './pages/TermsOfService';
import Medicines from './pages/Medicines';

import Search from './pages/Search';

import NotFound from './pages/NotFound';
import { ThemeProvider } from './components/theme-provider';
import SplashScreen from './components/SplashScreen';

const AppContent = () => {
  const { data: settings } = useFrappeGetDoc('GenMedAI Settings', 'GenMedAI Settings');

  const [showSplash, setShowSplash] = useState(() => {
    return !sessionStorage.getItem('hasSeenSplash');
  });

  // If settings loaded and splash is disabled (0 or false), hide it immediately
  // We check for not undefined/null to ensure we have data, then check if falsy
  if (settings && (settings.enable_splash_screen == 0 || settings.enable_splash_screen === false) && showSplash) {
    setShowSplash(false);
  }

  const handleSplashComplete = () => {
    setShowSplash(false);
    sessionStorage.setItem('hasSeenSplash', 'true');
  };

  const splashMedia = settings?.splash_media;
  const splashDuration = settings?.splash_duration;

  // Determine if splash should be active based on settings
  // If settings are missing (loading or error), we default to showing it to prevent unstyled flash,
  // unless showSplash is already false.
  const isSplashEnabled = settings ? (settings.enable_splash_screen != 0 && settings.enable_splash_screen !== false) : true;

  return (
    <AnimatePresence mode="wait">
      {showSplash && isSplashEnabled ? (
        <SplashScreen key="splash" onComplete={handleSplashComplete} mediaUrl={splashMedia} duration={splashDuration} />
      ) : (
        <BrowserRouter key="router" basename={import.meta.env.DEV ? '/' : (window.location.pathname.startsWith('/frontend') ? '/frontend' : '/')}>
          <Routes>
            <Route element={<Layout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/update-password" element={<UpdatePassword />} />
              <Route path="/" element={<Home />} />
              <Route path="/index" element={<Home />} />

              <Route path="/about" element={<AboutUs />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/search" element={<Search />} />
              <Route path="/medicines" element={<Medicines />} />

              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      )}
    </AnimatePresence>
  );
}

function App() {
  const enableSocket = import.meta.env.VITE_ENABLE_SOCKET === 'true';
  const siteName = import.meta.env.VITE_SITE_NAME;

  return (
    <FrappeProvider enableSocket={enableSocket} siteName={siteName}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <AppContent />
      </ThemeProvider>
    </FrappeProvider>
  );
}

export default App;
