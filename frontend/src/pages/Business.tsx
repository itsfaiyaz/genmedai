import { Briefcase } from 'lucide-react';

const Business = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 mb-6">
                    <Briefcase className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                    Business Directory
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Connect with businesses within the community. Find services, shops, and professionals trusted by GenMedAI.
                </p>

                <div className="mt-12 p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-gray-500 dark:text-gray-500 font-medium">
                        Business listings coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Business;
