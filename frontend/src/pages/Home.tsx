import HeroSection from '../components/Landing/HeroSection';
import SearchSection from '../components/Landing/SearchSection';
import Features from '../components/Landing/Features';
import HowItWorks from '../components/Landing/HowItWorks';
import PriceComparison from '../components/Landing/PriceComparison';

import MedicineBanner from '../components/Landing/MedicineBanner';

const Home = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 font-sans">
            <HeroSection />
            <SearchSection />
            <MedicineBanner />
            <Features />
            <HowItWorks />
            <PriceComparison />
        </div>
    );
};

export default Home;
