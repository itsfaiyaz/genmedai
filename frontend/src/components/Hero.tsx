import { Search, RotateCcw } from 'lucide-react';


export interface HeroFilters {
    lookingFor: string;
    minAge: string;
    maxAge: string;
    profession: string;
    hobby: string;
}

interface HeroProps {
    showCheckButton?: boolean;
    onCheckCompatibility?: () => void;
    onCreateProfile?: () => void;
    filters: HeroFilters;
    onFilterChange: (key: keyof HeroFilters, value: string) => void;
    onResetFilters: () => void;
}

const Hero = ({ showCheckButton = false, onCheckCompatibility, onCreateProfile, filters, onFilterChange, onResetFilters }: HeroProps) => {
    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
            <div className="bg-[#FFF0F3] dark:bg-gray-900 rounded-3xl p-6 md:p-10 lg:p-12 shadow-sm transition-colors duration-300">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-10 gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                            Find Your Perfect Match
                        </h1>
                        <p className="mt-2 text-gray-600 dark:text-gray-400 text-lg">
                            Trusted by millions of happy couples across India.
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        {showCheckButton && (
                            <button
                                onClick={onCheckCompatibility}
                                className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-lg transition-all gap-2 animate-in fade-in zoom-in duration-300"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-sparkles"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" /></svg>
                                Check Compatibility
                            </button>
                        )}
                        <button
                            onClick={onCreateProfile}
                            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-bold rounded-lg text-white bg-[#E91E63] hover:bg-[#D81B60] shadow-md hover:shadow-lg transition-all"
                        >
                            Create Profile
                        </button>
                    </div>
                </div>

                {/* Search Card */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 md:p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <Search className="w-5 h-5 text-[#E91E63]" />
                        <h2 className="text-lg font-bold text-[#E91E63]">Partner Search</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-end">
                        {/* Looking For */}
                        <div className="md:col-span-3 space-y-2">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Looking For
                            </label>
                            <select
                                value={filters.lookingFor}
                                onChange={(e) => onFilterChange('lookingFor', e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm py-3 px-4"
                            >
                                <option value="">Any Gender</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Age */}
                        <div className="md:col-span-3 space-y-2">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Age (Yrs)
                            </label>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="18"
                                    value={filters.minAge}
                                    onChange={(e) => onFilterChange('minAge', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm py-3 px-4"
                                />
                                <span className="text-gray-400">to</span>
                                <input
                                    type="number"
                                    placeholder="40"
                                    value={filters.maxAge}
                                    onChange={(e) => onFilterChange('maxAge', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm py-3 px-4"
                                />
                            </div>
                        </div>

                        {/* Profession */}
                        <div className="md:col-span-3 space-y-2">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Profession
                            </label>
                            <input
                                type="text"
                                placeholder="Doctor, Engineer..."
                                value={filters.profession}
                                onChange={(e) => onFilterChange('profession', e.target.value)}
                                className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm py-3 px-4"
                            />
                        </div>

                        {/* Hobby */}
                        <div className="md:col-span-3 space-y-2">
                            <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Hobby / Interest
                            </label>
                            <div className="flex items-center gap-4">
                                <input
                                    type="text"
                                    placeholder="Music, Travel..."
                                    value={filters.hobby}
                                    onChange={(e) => onFilterChange('hobby', e.target.value)}
                                    className="block w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white focus:border-[#E91E63] focus:ring-[#E91E63] sm:text-sm py-3 px-4"
                                />
                                <button
                                    onClick={onResetFilters}
                                    className="whitespace-nowrap text-sm font-bold text-[#E91E63] hover:text-[#D81B60] flex items-center gap-1"
                                >
                                    <RotateCcw className="w-4 h-4" />
                                    <span className="hidden lg:inline">Reset</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Hero;
