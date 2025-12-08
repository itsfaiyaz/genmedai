// In SearchSection.tsx or wherever this component is
import { useState, useRef } from 'react';
import { Search, UploadCloud, Loader2, AlertCircle, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useFrappePostCall } from 'frappe-react-sdk';

const SearchSection = () => {
    const [query, setQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [uploadLoading, setUploadLoading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const { call: analyzePrescription } = useFrappePostCall('genmedai.api.analyze_prescription');

    const handleSearch = () => {
        if (!query.trim()) return;
        setLoading(true);
        setError('');

        setTimeout(() => {
            setLoading(false);
            navigate(`/search?query=${encodeURIComponent(query)}`);
        }, 500);
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Reset file input so same file can be selected again if needed
        e.target.value = '';

        setUploadLoading(true);
        setError('');

        try {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;
                try {
                    const result = await analyzePrescription({ image_base64: base64 });
                    if (result?.message && Array.isArray(result.message) && result.message.length > 0) {
                        // Found medicines! Search for the first one for now
                        // Ideally we could pass list, but let's start with first match
                        const firstMed = result.message[0];
                        navigate(`/search?query=${encodeURIComponent(firstMed)}`);
                    } else {
                        setError("Could not identify any clear medicine names in the image. Please try typing manually.");
                    }
                } catch (err) {
                    console.error(err);
                    setError("Failed to analyze prescription. Please try again.");
                } finally {
                    setUploadLoading(false);
                }
            };
            reader.onerror = () => {
                setError("Failed to read file.");
                setUploadLoading(false);
            };
        } catch (err) {
            setUploadLoading(false);
        }
    };

    return (
        <section className="py-12 -mt-16 relative z-20 px-4">
            <div className="container mx-auto max-w-7xl">
                <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                    <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-gray-700">

                        {/* Text Search */}
                        <div className="p-8 md:p-12 flex flex-col justify-center">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 block">
                                Search by Name
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Enter medicine name e.g. Urimax 0.4"
                                    className="w-full pl-6 pr-14 py-4 bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-brand-teal focus:border-transparent text-lg text-gray-900 dark:text-white placeholder-gray-400 transition-all outline-none"
                                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                                />
                                <button
                                    onClick={handleSearch}
                                    disabled={loading}
                                    className="absolute right-2 top-2 bottom-2 w-12 bg-brand-teal hover:bg-brand-teal/90 rounded-lg flex items-center justify-center text-white transition-opacity disabled:opacity-70"
                                >
                                    {loading ? <Loader2 className="animate-spin w-5 h-5" /> : <Search className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Upload Section */}
                        <div className="p-8 md:p-12 flex flex-col justify-center bg-gray-50/50 dark:bg-gray-800/50">
                            <label className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-4 block">
                                Or Upload Prescription
                            </label>
                            <div
                                className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-brand-teal hover:bg-white dark:hover:bg-gray-700 transition-all group"
                                onClick={() => fileInputRef.current?.click()}
                            >
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    accept="image/png, image/jpeg, application/pdf"
                                    onChange={handleFileUpload}
                                />
                                <div className="w-12 h-12 bg-white dark:bg-gray-700 rounded-full shadow-sm flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                    {uploadLoading ? (
                                        <Loader2 className="animate-spin text-brand-blue w-6 h-6" />
                                    ) : (
                                        <UploadCloud className="text-brand-blue w-6 h-6" />
                                    )}
                                </div>
                                <p className="text-gray-900 dark:text-white font-bold">Click to Upload Prescription</p>
                                <p className="text-sm text-gray-400 mt-1">JPG, PNG, PDF supported</p>
                            </div>
                        </div>
                    </div>

                    {/* Results Area (Placeholder/Loading state if needed inline, but we navigate away for now) */}
                    {error && (
                        <div className="p-6 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center justify-center gap-2 border-t border-red-100 dark:border-red-900/30">
                            <AlertCircle size={20} /> {error}
                        </div>
                    )}

                    {/* Footer Tagline */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 px-8 py-4 text-center border-t border-gray-100 dark:border-gray-700">
                        <p className="text-sm text-brand-blue dark:text-blue-300 flex items-center justify-center gap-2 font-medium">
                            <Zap size={16} className="fill-current" />
                            GenMedAI scans your prescription, extracts medicines, identifies salts, and finds the cheapest substitutes in seconds.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default SearchSection;

