
import { useState } from 'react';
import { Search, Sparkles, AlertCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchSection = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setError('');

        // Simulate AI thinking briefly for effect before navigation
        setTimeout(() => {
            setLoading(false);
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }, 800);
    };

    const handlePopularClick = (term: string) => {
        setQuery(term);
        navigate(`/search?query=${encodeURIComponent(term)}`);
    }

    return (
        <section id="search-section" className="py-12 -mt-16 relative z-20 px-4">
            <div className="container mx-auto max-w-5xl space-y-8">

                {/* 1. Main Search Bar - Adapted from Search.tsx */}
                <div className="flex flex-col items-center justify-center">
                    <div className="w-full max-w-3xl text-center space-y-8">
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 p-8 md:p-12 relative overflow-visible">
                            <label className="text-sm font-bold text-brand-teal dark:text-brand-teal uppercase tracking-wider mb-6 block">
                                Search for Affordable Medicines
                            </label>

                            <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto group">
                                <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                                    <Search className="h-6 w-6 text-gray-400 group-focus-within:text-brand-teal transition-colors" />
                                </div>
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search for a medicine (e.g. Dolo, Pan D)..."
                                    className="block w-full pl-14 pr-48 py-6 bg-gray-50 dark:bg-gray-900 border-2 border-gray-100 dark:border-gray-700 rounded-full text-xl shadow-inner focus:ring-4 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                                />
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`absolute inset-y-2 right-2 px-6 bg-brand-gradient text-white rounded-full font-semibold shadow-md transition-all flex items-center gap-2 ${loading ? 'opacity-80 cursor-wait' : 'hover:shadow-lg hover:opacity-90 group-hover:scale-105'}`}
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <Sparkles className="w-4 h-4 animate-spin" />
                                            <span className="animate-pulse">Thinking...</span>
                                        </div>
                                    ) : (
                                        <>
                                            <Sparkles className="w-4 h-4 fill-white/20" />
                                            AI Search
                                        </>
                                    )}
                                </button>
                            </form>

                            {error && (
                                <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 inline-flex items-center gap-2 rounded-lg border border-red-100 dark:border-red-900/30">
                                    <AlertCircle size={18} /> {error}
                                </div>
                            )}

                            <div className="mt-8 flex flex-wrap justify-center gap-3">
                                <span className="text-sm text-gray-500 dark:text-gray-400 font-medium pt-1.5">Popular:</span>
                                {['Dolo 650', 'Pan 40', 'Crocin', 'Azithromycin'].map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => handlePopularClick(item)}
                                        className="px-4 py-1.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:border-brand-teal hover:text-brand-teal transition-colors shadow-sm"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer Tagline */}
                <div className="text-center pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center gap-2 font-medium">
                        <Zap size={16} className="text-brand-yellow fill-current" />
                        Save up to 80% on medical bills with GenMedAI
                    </p>
                </div>

            </div>
        </section>
    );
};

export default SearchSection;


