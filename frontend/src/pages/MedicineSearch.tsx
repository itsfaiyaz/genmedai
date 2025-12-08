import { useSearchParams } from 'react-router-dom';
import { Search, Pill } from 'lucide-react';
import { useFrappeGetCall } from 'frappe-react-sdk';
import { useState, useEffect } from 'react';

const MedicineSearch = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [results, setResults] = useState<any[]>([]);

    const { data, isLoading } = useFrappeGetCall(
        'genmedai.api.get_medicines',
        { query: query }
    );

    useEffect(() => {
        if (data && Array.isArray(data)) {
            const mappedResults = (data as any[]).map(item => ({
                id: item.name,
                name: item.brand_name + (item.strength ? ' ' + item.strength : ''),
                manufacturer: item.manufacturer,
                price: `₹${item.price}`,
                type: item.dosage_form,
                salt_composition: item.salt_composition,
                is_ai_generated: item.is_ai_generated,
                substitutes: "View",
                original_price: item.price,
                explanation: item.explanation,
                affiliate_link: item.affiliate_link
            }));
            setResults(mappedResults);
        } else {
            setResults([]);
        }
    }, [data]);

    // isLoading is already provided by the hook

    // Substitutes fetching
    const [selectedMedicine, setSelectedMedicine] = useState<any>(null);
    const { data: substitutesData, isLoading: isLoadingSubstitutes } = useFrappeGetCall(
        selectedMedicine ? 'genmedai.api.get_substitutes' : null as any,
        { medicine_id: selectedMedicine?.id }
    );

    // Split results into DB and AI
    const dbResults = results.filter(r => !r.is_ai_generated);
    const aiResults = results.filter(r => r.is_ai_generated);

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 max-w-5xl relative">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Medicine Substitutes</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Showing results for: <span className="font-semibold text-brand-teal text-lg">"{query}"</span>
                </p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-teal mb-4"></div>
                    <p className="text-gray-500 animate-pulse">Searching for medicines...</p>
                </div>
            ) : results.length > 0 ? (
                <div className="space-y-8">
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
                                                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{medicine.name}</h3>
                                                <p className="text-sm text-gray-500 dark:text-gray-400">{medicine.manufacturer} • {medicine.type}</p>
                                                <p className="text-xs text-gray-400 mt-1">{medicine.salt_composition || "Composition not available"}</p>
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
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="h-px flex-grow bg-gray-200 dark:bg-gray-700"></div>
                                <span className="text-sm font-semibold text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 px-3 py-1 rounded-full border border-purple-100 dark:border-purple-800">
                                    AI Discovered ✨
                                </span>
                                <div className="h-px flex-grow bg-gray-200 dark:bg-gray-700"></div>
                            </div>

                            <div className="grid grid-cols-1 gap-4">
                                {aiResults.map((medicine) => (
                                    <div key={medicine.id} className="bg-gradient-to-r from-purple-50/50 to-white dark:from-purple-900/10 dark:to-gray-800 rounded-xl p-6 border border-purple-100 dark:border-purple-800/30 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
                                        <div className="absolute top-0 right-0 p-2 opacity-10">
                                            <svg className="w-24 h-24 text-purple-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" /></svg>
                                        </div>

                                        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 relative z-10">
                                            <div className="flex items-start gap-4">
                                                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400 flex-shrink-0">
                                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                                                </div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{medicine.name}</h3>
                                                        <span className="bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border border-purple-200 dark:border-purple-800">
                                                            AI Generated
                                                        </span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">{medicine.manufacturer} • {medicine.type}</p>
                                                    <p className="text-xs text-gray-500 mt-1 font-mono">{medicine.salt_composition}</p>
                                                    <p className="text-xs text-amber-600 dark:text-amber-500 mt-2 bg-amber-50 dark:bg-amber-900/10 inline-block px-2 py-1 rounded">
                                                        ⚠️ Verified by AI. Please confirm with a doctor.
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end gap-2">
                                                <div className="text-xl font-bold text-brand-teal">{medicine.price}</div>
                                                <button
                                                    onClick={() => setSelectedMedicine(medicine)}
                                                    className="text-sm font-medium text-purple-600 hover:text-purple-700 hover:underline"
                                                >
                                                    Find Cheaper Substitutes
                                                </button>
                                                {medicine.affiliate_link && (
                                                    <a
                                                        href={medicine.affiliate_link}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="mt-2 text-xs font-bold text-white bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 px-4 py-2 rounded-full shadow-md transition-transform transform hover:scale-105"
                                                    >
                                                        Buy Now ↗
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                        {medicine.explanation && (
                                            <div className="mt-4 pt-4 border-t border-purple-100 dark:border-purple-800/30">
                                                <p className="text-sm text-gray-600 dark:text-gray-300 italic">
                                                    "{medicine.explanation}"
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-800">
                    <div className="bg-gray-100 dark:bg-gray-700 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Search className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">No medicines found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        We couldn't find any medicines matching "{query}". Please try checking the spelling or search for a different medicine.
                    </p>
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
                                                <h4 className="font-bold text-gray-900 dark:text-white">{sub.brand_name} {sub.strength}</h4>
                                                <p className="text-xs text-gray-500">{sub.manufacturer}</p>
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

export default MedicineSearch;
