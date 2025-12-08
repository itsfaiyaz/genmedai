import { FrappeProvider } from 'frappe-react-sdk';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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

import Search from './pages/Search';

import NotFound from './pages/NotFound';
import { ThemeProvider } from './components/theme-provider';

function App() {
  const enableSocket = import.meta.env.VITE_ENABLE_SOCKET === 'true';
  const siteName = import.meta.env.VITE_SITE_NAME;

  return (
    <FrappeProvider enableSocket={enableSocket} siteName={siteName}>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <BrowserRouter basename={import.meta.env.DEV ? '/' : (window.location.pathname.startsWith('/frontend') ? '/frontend' : '/')}>
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

              <Route path="/how-it-works" element={<HowItWorks />} />
              <Route path="/faqs" element={<FAQs />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route path="/terms" element={<TermsOfService />} />

              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </FrappeProvider>
  );
}

export default App;
