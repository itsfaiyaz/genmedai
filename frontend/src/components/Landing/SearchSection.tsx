// In SearchSection.tsx or wherever this component is
import { useState } from 'react';
import { Search, UploadCloud, Loader2, AlertCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const SearchSection = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    /*
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const { call: analyzePrescription } = useFrappePostCall('genmedai.api.analyze_prescription');
    */
    const navigate = useNavigate();

    const handleSearch = () => {
        if (!query.trim()) return;
        setLoading(true);
        setError('');

        setTimeout(() => {
            setLoading(false);
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }, 500);
    };

    /*
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        // Disabled for Coming Soon
        return;

        // Original Logic Preserved but unreachable for now
        // const file = e.target.files?.[0];
        // if (!file) return;

        // // Reset file input so same file can be selected again if needed
        // e.target.value = '';

        // setUploadLoading(true);
        // setError('');

        // try {
        //     const reader = new FileReader();
        //     reader.readAsDataURL(file);
        //     reader.onload = async () => {
        //         const base64 = reader.result as string;
        //         try {
        //             const result = await analyzePrescription({ image_base64: base64 });
        //             if (result?.message && Array.isArray(result.message) && result.message.length > 0) {
        //                 // Found medicines! Search for the first one for now
        //                 // Ideally we could pass list, but let's start with first match
        //                 const firstMed = result.message[0];
        //                 navigate(`/search?query=${encodeURIComponent(firstMed)}`);
        //             } else {
        //                 setError("Could not identify any clear medicine names in the image. Please try typing manually.");
        //             }
        //         } catch (err) {
        //             console.error(err);
        //             setError("Failed to analyze prescription. Please try again.");
        //         } finally {
        //             setUploadLoading(false);
        //         }
        //     };
        //     reader.onerror = () => {
        //         setError("Failed to read file.");
        //         setUploadLoading(false);
        //     };
        // } catch (err) {
        //     setUploadLoading(false);
        // }
    };
    */

    return (
        <section id="search-section" className="py-12 -mt-16 relative z-20 px-4">
            <div className="container mx-auto max-w-5xl space-y-8">

                {/* 1. Main Search Bar - Centered & Prominent */}
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden p-8 md:p-12 text-center">
                    <label className="text-sm font-bold text-brand-teal dark:text-brand-teal uppercase tracking-wider mb-6 block">
                        Search for Affordable Medicines
                    </label>
                    <div className="relative max-w-3xl mx-auto">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder="Enter medicine name (e.g. Dolo 650, Pan D)"
                            className="w-full pl-8 pr-16 py-5 bg-gray-50 dark:bg-gray-900 border-2 border-transparent focus:border-brand-teal rounded-2xl text-xl text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none shadow-inner"
                            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                        />
                        <button
                            onClick={handleSearch}
                            disabled={loading}
                            className="absolute right-3 top-3 bottom-3 w-14 bg-brand-gradient hover:opacity-90 rounded-xl flex items-center justify-center text-white transition-all disabled:opacity-70 shadow-lg hover:shadow-brand-blue/30"
                        >
                            {loading ? <Loader2 className="animate-spin w-6 h-6" /> : <Search className="w-6 h-6" />}
                        </button>
                    </div>

                    {error && (
                        <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 inline-flex items-center gap-2 rounded-lg border border-red-100 dark:border-red-900/30">
                            <AlertCircle size={18} /> {error}
                        </div>
                    )}
                </div>

                {/* 2. Upload Prescription Section - Distinct & Coming Soon */}
                <div id="upload-prescription-section" className="relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest shadow-lg z-30 border-2 border-white dark:border-gray-800">
                        Feature Coming Soon
                    </div>

                    <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-3xl border border-gray-200 dark:border-gray-700 border-dashed p-10 text-center relative overflow-hidden group select-none grayscale opacity-80 hover:opacity-100 transition-opacity">
                        <div className="max-w-xl mx-auto space-y-4">
                            <div className="w-16 h-16 bg-blue-50 dark:bg-blue-900/20 rounded-2xl flex items-center justify-center mx-auto mb-2 text-brand-blue">
                                <UploadCloud size={32} />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                AI Prescription Analysis
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400">
                                Soon, you'll be able to upload your prescription directly. Our AI will scan it, digitize the medicines, and instantly find you the best savings.
                            </p>

                            {/* Fake Button */}
                            <button disabled className="mt-4 px-8 py-3 rounded-xl bg-gray-200 dark:bg-gray-700 text-gray-400 font-bold cursor-not-allowed">
                                Notify Me When Ready
                            </button>
                        </div>

                        {/* Overlay pattern to indicate disabled/coming soon more clearly */}
                        <div className="absolute inset-0 bg-white/10 dark:bg-black/10 z-20" />
                    </div>
                </div>

                {/* Footer Tagline - Moved outside */}
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

