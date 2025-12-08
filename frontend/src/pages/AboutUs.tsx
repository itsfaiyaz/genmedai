import { Info } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 mb-6">
                    <Info className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                    About GenMedAI
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    We are dedicated to making healthcare affordable for everyone. Our mission is to provide accurate medicine substitutes and transparent pricing.
                </p>

                <div className="mt-12 p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-gray-500 dark:text-gray-500 font-medium">
                        Our story and mission details coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
