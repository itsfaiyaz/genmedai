import { Megaphone } from 'lucide-react';

const Classifieds = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 mb-6">
                    <Megaphone className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">
                    Classifieds
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Buy, sell, or rent within the community. Post ads for jobs, properties, and more.
                </p>

                <div className="mt-12 p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-gray-500 dark:text-gray-500 font-medium">
                        Classified ads coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Classifieds;
