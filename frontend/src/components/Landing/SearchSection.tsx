import { Search, UploadCloud } from 'lucide-react';

const SearchSection = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 -mt-16 relative z-20">
            <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">

                    {/* Search By Name */}
                    <div className="p-8 md:p-12 border-b md:border-b-0 md:border-r border-gray-100 dark:border-gray-700">
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            Search by Name
                        </h3>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Enter medicine name e.g. Urimax 0.4"
                                className="w-full h-14 pl-6 pr-14 rounded-xl border border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#2DD4BF] focus:border-transparent outline-none transition-all text-lg placeholder:text-gray-400"
                            />
                            <button className="absolute right-2 top-2 h-10 w-10 bg-[#2DD4BF] hover:bg-[#14B8A6] rounded-lg flex items-center justify-center text-white transition-colors">
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Upload Prescription */}
                    <div className="p-8 md:p-12 bg-gray-50/50 dark:bg-gray-800/50">
                        <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4">
                            Or Upload Prescription
                        </h3>
                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 text-center hover:border-[#2DD4BF] hover:bg-white dark:hover:bg-gray-700 transition-all cursor-pointer group">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-[#3B82F6] group-hover:scale-110 transition-transform">
                                    <UploadCloud className="w-6 h-6" />
                                </div>
                                <div>
                                    <p className="font-bold text-gray-900 dark:text-white">Click to Upload Prescription</p>
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">JPG, PNG, PDF supported</p>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Footer of Search Card */}
                <div className="bg-blue-50 dark:bg-blue-900/20 px-8 py-4 flex items-center justify-center gap-2 text-sm text-blue-700 dark:text-blue-300">
                    <ZapIcon className="w-4 h-4 fill-current" />
                    <p>GenMedAI scans your prescription, extracts medicines, identifies salts, and finds the cheapest substitutes in seconds.</p>
                </div>
            </div>
        </div>
    );
};

const ZapIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
    </svg>
);


export default SearchSection;
