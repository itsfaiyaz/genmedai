
import { useState, useEffect } from 'react';
import { Search as SearchIcon, Pill, Sparkles, Bot, Languages, Loader2 } from 'lucide-react';
import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk';
import { useSearchParams } from 'react-router-dom';
import SubstituteComparison from '../components/SubstituteComparison';

const Search = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [query, setQuery] = useState(searchParams.get('query') || '');
    const [triggeredQuery, setTriggeredQuery] = useState(searchParams.get('query') || '');
    const [results, setResults] = useState<any[]>([]);
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [translatingId, setTranslatingId] = useState<string | null>(null);

    const { data, isLoading } = useFrappeGetCall(
        triggeredQuery ? 'genmedai.api.get_medicines' : null as any,
        { query: triggeredQuery }
    );

    // Translation Mutation
    const { call: translate } = useFrappePostCall('genmedai.api.translate_text');

    const handleTranslate = async (id: string, text: string) => {
        if (translations[id]) {
            // Toggle back to original? Or just ignore? Let's toggle.
            const newTranslations = { ...translations };
            delete newTranslations[id];
            setTranslations(newTranslations);
            return;
        }

        setTranslatingId(id);
        try {
            const result = await translate({ text, target_language: 'Hindi' });
            if (result?.message) {
                setTranslations(prev => ({ ...prev, [id]: result.message }));
            }
        } catch (error) {
            console.error("Translation failed", error);
        } finally {
            setTranslatingId(null);
        }
    };

    useEffect(() => {
        const rawData = data as any;
        const listData = Array.isArray(rawData) ? rawData : (rawData?.message || []);

        if (listData && Array.isArray(listData)) {
            const mappedResults = listData.map((item: any) => ({
                id: item.name,
                name: item.brand_name + (item.strength ? ' ' + item.strength : ''),
                manufacturer: item.manufacturer,
                price: `₹${item.price} `,
                type: item.dosage_form,
                salt_composition: item.salt_composition,
                short_composition1: item.short_composition1,
                short_composition2: item.short_composition2,
                is_ai_generated: item.is_ai_generated,
                substitutes: "View",
                original_price: item.price,
                explanation: item.explanation,
                affiliate_link: item.affiliate_link,
                is_discontinued: item.is_discontinued,
                pack_size_label: item.pack_size_label,
                is_generic: item.is_generic
            }));
            setResults(mappedResults);
        } else {
            setResults([]);
        }
    }, [data]);

    // Effect to handle URL query parameter changes
    useEffect(() => {
        const urlQuery = searchParams.get('query');
        if (urlQuery && urlQuery !== query) {
            setQuery(urlQuery);
            setTriggeredQuery(urlQuery);
            setTranslations({}); // Reset translations on new search
        } else if (!urlQuery && query) {
            // If URL query is removed but local state still has it, clear local state
            setQuery('');
            setTriggeredQuery('');
            setTranslations({});
        }
    }, [searchParams]); // Depend on searchParams to react to URL changes

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (query.trim()) {
            setTriggeredQuery(query);
            setTranslations({}); // Reset translations on new search
            setSearchParams({ query: query }); // Update URL with the new query
        } else {
            setSearchParams({}); // Clear query from URL if search input is empty
        }
    };

    // Substitutes fetching
    const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
    const { data: substitutesData, isLoading: isLoadingSubstitutes } = useFrappeGetCall(
        selectedMedicine ? 'genmedai.api.get_substitutes' : null as any,
        {
            medicine_id: selectedMedicine?.id,
            salt_composition: selectedMedicine?.salt_composition,
            current_price: selectedMedicine?.original_price
        }
    );

    const dbResults = results.filter(r => !r.is_ai_generated);
    const aiResults = results.filter(r => r.is_ai_generated);

    return (
        <div className="flex flex-col items-center min-h-[calc(100vh-80px)] px-4 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-gray-900 py-10">
            <div className={`w-full max-w-3xl text-center space-y-8 animate-in fade-in zoom-in duration-500 transition-all ${triggeredQuery ? 'mb-8' : 'mb-0 min-h-[60vh] flex flex-col justify-center'}`}>
                <div className="space-y-4">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-brand-navy to-brand-teal dark:from-white dark:to-brand-teal tracking-tight">
                        Find Your Medicine
                    </h1>
                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Instantly search for medicines, compare prices, and find cheaper substitutes with our AI-powered engine.
                    </p>
                </div>

                <form onSubmit={handleSearch} className="relative max-w-3xl mx-auto group">
                    <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                        <SearchIcon className="h-6 w-6 text-gray-400 group-focus-within:text-brand-teal transition-colors" />
                    </div>
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Search for a medicine (e.g. Dolo, Pan D)..."
                        className="block w-full pl-14 pr-48 py-6 bg-white dark:bg-gray-800 border-2 border-gray-100 dark:border-gray-700 rounded-full text-xl shadow-lg hover:shadow-xl focus:ring-4 focus:ring-brand-teal/20 focus:border-brand-teal outline-none transition-all"
                        autoFocus
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className={`absolute inset-y-2 right-2 px-6 bg-brand-gradient text-white rounded-full font-semibold shadow-md transition-all flex items-center gap-2 ${isLoading ? 'opacity-80 cursor-wait' : 'hover:shadow-lg hover:opacity-90 group-hover:scale-105'}`}
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <Sparkles className="w-4 h-4 animate-spin" />
                                <span className="animate-pulse">AI Thinking...</span>
                            </div>
                        ) : (
                            <>
                                <Sparkles className="w-4 h-4 fill-white/20" />
                                AI Search
                            </>
                        )}
                    </button>
                </form>

                <div className="flex flex-wrap justify-center gap-3">
                    <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">Popular:</span>
                    {['Dolo 650', 'Pan 40', 'Crocin', 'Azithromycin'].map((item) => (
                        <button
                            key={item}
                            onClick={() => {
                                setQuery(item);
                                setTriggeredQuery(item);
                                setTranslations({});
                                setSearchParams({ query: item });
                            }}
                            className="px-4 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full text-sm text-gray-600 dark:text-gray-300 hover:border-brand-teal hover:text-brand-teal transition-colors"
                        >
                            {item}
                        </button>
                    ))}
                </div>
            </div>

            {/* Results Section */}
            {triggeredQuery && (
                <div className="w-full max-w-5xl animate-in slide-in-from-bottom-10 fade-in duration-700">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="h-px flex-grow bg-gray-200 dark:bg-gray-800"></div>
                        <span className="text-sm text-gray-500">Results for "{triggeredQuery}"</span>
                        <div className="h-px flex-grow bg-gray-200 dark:bg-gray-800"></div>
                    </div>

                    {isLoading ? (
                        <div className="flex flex-col items-center justify-center py-20 animate-in fade-in duration-500">
                            <div className="relative">
                                <div className="absolute inset-0 bg-brand-teal/20 rounded-full animate-ping"></div>
                                <div className="bg-white dark:bg-gray-800 p-4 rounded-full shadow-xl relative z-10 border border-brand-teal/20">
                                    <Sparkles className="h-8 w-8 text-brand-teal animate-pulse" />
                                </div>
                            </div>
                            <h3 className="mt-8 text-xl font-bold text-gray-800 dark:text-white">Consulting AI...</h3>
                            <p className="text-gray-500 dark:text-gray-400 mt-2 text-center max-w-sm">
                                Analyzing medicine details, checking alternatives, and comparing prices.
                            </p>
                        </div>
                    ) : results.length > 0 ? (
                        <div className="space-y-8 pb-10">
                            {/* DB Results */}
                            {dbResults.length > 0 && (
                                <div className="grid grid-cols-1 gap-4">
                                    {dbResults.map((medicine) => (
                                        <div key={medicine.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                            <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-brand-blue flex-shrink-0">
                                                        <Pill className="w-6 h-6" />
                                                    </div>
                                                    <div>
                                                        <div className="flex items-center gap-2">
                                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{medicine.name}</h3>
                                                            {medicine.is_discontinued === 1 && (
                                                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-red-100 text-red-600 border border-red-200">
                                                                    DISCONTINUED
                                                                </span>
                                                            )}
                                                            {medicine.is_generic === 1 && (
                                                                <span className="px-2 py-0.5 rounded text-xs font-bold bg-green-100 text-green-600 border border-green-200">
                                                                    Generic
                                                                </span>
                                                            )}
                                                        </div>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            {medicine.manufacturer} • {medicine.type} {medicine.pack_size_label ? `• ${medicine.pack_size_label}` : ''}
                                                        </p>
                                                        <p className="text-xs text-gray-400 mt-1">
                                                            {medicine.salt_composition || "Composition not available"}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <div className="text-xl font-bold text-brand-teal">{medicine.price}</div>
                                                    <button
                                                        onClick={() => setSelectedMedicine(medicine)}
                                                        className="text-sm font-medium text-brand-blue hover:text-blue-600 hover:underline"
                                                    >
                                                        View Substitutes
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* AI Results Section */}
                            {aiResults.length > 0 && (
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 mb-6 bg-gradient-to-r from-brand-teal/10 to-transparent p-4 rounded-xl border border-brand-teal/10">
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-teal to-blue-600 flex items-center justify-center text-white shadow-lg shadow-brand-teal/20">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white">AI Analysis</h3>
                                            <p className="text-xs text-gray-500 dark:text-gray-400">Generated by GenMedAI Engine</p>
                                        </div>
                                    </div>

                                    {aiResults.map((medicine) => (
                                        <div key={medicine.id} className="animate-in slide-in-from-bottom-5 duration-700">
                                            {/* Chat Bubble Style Explanation */}
                                            {medicine.explanation && (
                                                <div className="flex gap-4 mb-6 items-start">
                                                    <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center flex-shrink-0 border border-gray-200 dark:border-gray-700">
                                                        <Bot className="w-6 h-6 text-gray-600 dark:text-gray-300" />
                                                    </div>
                                                    <div className="bg-white dark:bg-gray-800 rounded-2xl rounded-tl-none p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative flex-grow">
                                                        <div className="flex justify-end mb-2">
                                                            <button
                                                                onClick={() => handleTranslate(medicine.id, medicine.explanation)}
                                                                disabled={translatingId === medicine.id}
                                                                className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-full text-xs font-medium text-gray-600 dark:text-gray-300 transition-colors"
                                                            >
                                                                {translatingId === medicine.id ? (
                                                                    <Loader2 className="w-3 h-3 animate-spin" />
                                                                ) : (
                                                                    <Languages className="w-3 h-3" />
                                                                )}
                                                                {translations[medicine.id] ? "Show Original" : "Translate to Hindi"}
                                                            </button>
                                                        </div>
                                                        <p className="text-gray-700 dark:text-gray-200 text-lg leading-relaxed">
                                                            {translations[medicine.id] || medicine.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            )}

                                            {/* Medicine Card */}
                                            <div className="bg-gradient-to-r from-purple-50/50 to-white dark:from-purple-900/10 dark:to-gray-800 rounded-xl p-6 border border-purple-100 dark:border-purple-800/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                                <div className="absolute top-0 right-0 p-2 opacity-10">
                                                    <svg className="w-24 h-24 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                                </div>

                                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
                                                    <div className="flex items-start gap-4">
                                                        <div className="w-16 h-16 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0 shadow-inner">
                                                            <Pill className="w-8 h-8" />
                                                        </div>
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-1">
                                                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">{medicine.name}</h3>
                                                            </div>
                                                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">{medicine.manufacturer}</p>
                                                            <div className="flex flex-wrap gap-2 text-xs">
                                                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600">
                                                                    {medicine.salt_composition}
                                                                </span>
                                                                <span className="bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 px-2 py-1 rounded-md border border-gray-200 dark:border-gray-600">
                                                                    {medicine.type}
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex flex-col items-end gap-3 min-w-[140px]">
                                                        <div className="text-2xl font-bold text-brand-teal">{medicine.price}</div>

                                                        {medicine.affiliate_link && (
                                                            <a
                                                                href={medicine.affiliate_link}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="w-full text-center text-sm font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 px-4 py-2.5 rounded-lg shadow-md transition-transform transform hover:-translate-y-0.5"
                                                            >
                                                                Buy Now ↗
                                                            </a>
                                                        )}

                                                        <button
                                                            onClick={() => setSelectedMedicine(medicine)}
                                                            className="w-full text-sm font-medium text-purple-600 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/40 px-4 py-2.5 rounded-lg transition-colors border border-purple-100 dark:border-purple-800"
                                                        >
                                                            Find Substitutes
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="mt-4 flex items-center gap-2 text-xs text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-900/10 p-2 rounded-lg border border-amber-100 dark:border-amber-900/20">
                                                    <span className="text-base">⚠️</span>
                                                    <span>Verified by AI. Always consult a doctor before use.</span>
                                                </div>
                                            </div>
                                            <SubstituteComparison medicine={medicine} />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                            <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <SearchIcon className="w-8 h-8 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No medicines found</h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                                We couldn't find any medicines matching "{triggeredQuery}". Please try checking the spelling or search for a different medicine.
                            </p>
                        </div>
                    )}
                </div>
            )}

            {/* Substitutes Modal */}
            {selectedMedicine && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[80vh] overflow-y-auto border border-gray-200 dark:border-gray-700 flex flex-col">
                        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center sticky top-0 bg-white dark:bg-gray-900 z-10">
                            <div>
                                <h2 className="text-xl font-bold text-gray-900 dark:text-white">Substitutes for {selectedMedicine.name}</h2>
                                <p className="text-sm text-gray-500">Same salt composition, lower price.</p>
                            </div>
                            <button
                                onClick={() => setSelectedMedicine(null)}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
                            >
                                <span className="sr-only">Close</span>
                                ✕
                            </button>
                        </div>

                        <div className="p-6 space-y-4">
                            {isLoadingSubstitutes ? (
                                <div className="flex flex-col items-center py-10">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-teal mb-2"></div>
                                    <p className="text-sm text-gray-500">Finding cheaper alternatives...</p>
                                </div>
                            ) : substitutesData && (substitutesData as any[]).length > 0 ? (
                                (substitutesData as any[]).map((sub, idx) => (
                                    <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-green-50 dark:bg-green-900/10 border border-green-100 dark:border-green-900/30">
                                        <div className="flex items-start gap-3">
                                            <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 flex items-center justify-center text-brand-green shadow-sm">
                                                <Pill className="w-5 h-5" />
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <h4 className="font-bold text-gray-900 dark:text-white">{sub.brand_name} {sub.strength}</h4>
                                                    {sub.is_discontinued === 1 && <span className="text-[10px] bg-red-100 text-red-600 px-1 py-0.5 rounded border border-red-200">DISCONTINUED</span>}
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    {sub.manufacturer} {sub.pack_size_label ? ` • ${sub.pack_size_label}` : ''} {sub.is_generic ? ' • Generic' : ''}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-brand-green text-lg">₹{sub.price}</div>
                                            {parseFloat(String(sub.price).replace(/[^\d.]/g, '')) < parseFloat(String(selectedMedicine.price).replace(/[^\d.]/g, '')) && (
                                                <span className="text-xs font-bold text-brand-teal bg-teal-100 dark:bg-teal-900/30 px-2 py-0.5 rounded-full">
                                                    Save {(100 - (parseFloat(String(sub.price).replace(/[^\d.]/g, '')) / parseFloat(String(selectedMedicine.price).replace(/[^\d.]/g, '')) * 100)).toFixed(0)}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-10">
                                    <p className="text-gray-500">No cheaper substitutes found for this medicine.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Search;
