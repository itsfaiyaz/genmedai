import { Link } from 'react-router-dom';
import { Home, FileQuestion } from 'lucide-react';

const NotFound = () => {
    return (
        <div className="min-h-[80vh] flex flex-col items-center justify-center p-4 text-center animate-in fade-in duration-500">
            <div className="mb-8 relative">
                {/* Background 404 text */}
                <h1 className="text-[150px] sm:text-[200px] font-black text-gray-100 dark:text-gray-800 leading-none select-none">
                    404
                </h1>

                {/* Overlay content */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="bg-white dark:bg-gray-950 p-4 rounded-full shadow-sm mb-4">
                        <FileQuestion className="w-12 h-12 text-[#E91E63]" />
                    </div>
                    <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white uppercase tracking-widest bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm px-4 py-1 rounded-lg">
                        Page Not Found
                    </span>
                </div>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                There's nothing here
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md text-lg">
                The page you are looking for has gone missing. It might have been moved or deleted.
            </p>

            <Link
                to="/"
                className="inline-flex items-center gap-2 px-8 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1"
            >
                <Home className="w-5 h-5" />
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;
