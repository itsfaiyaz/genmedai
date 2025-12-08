import { useSearchParams } from 'react-router-dom';
import { Search, Pill } from 'lucide-react';
import { useState, useEffect } from 'react';

const MedicineSearch = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query') || '';
    const [isLoading, setIsLoading] = useState(true);
    const [results, setResults] = useState<any[]>([]);

    useEffect(() => {
        if (query) {
            setIsLoading(true);
            // Simulate API call
            setTimeout(() => {
                setIsLoading(false);
                // Placeholder results
                setResults([
                    {
                        id: 1,
                        name: "Paracetamol 500mg",
                        manufacturer: "Generic Pharma",
                        price: "₹15.00",
                        type: "Tablet",
                        substitutes: 12
                    },
                    {
                        id: 2,
                        name: "Dolo 650",
                        manufacturer: "Micro Labs",
                        price: "₹30.00",
                        type: "Tablet",
                        substitutes: 8
                    }
                ]);
            }, 1000);
        } else {
            setIsLoading(false);
        }
    }, [query]);

    return (
        <div className="container mx-auto py-10 px-4 md:px-8 max-w-5xl">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">Medicine Substitutes</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    Showing results for: <span className="font-semibold text-[#2DD4BF] text-lg">"{query}"</span>
                </p>
            </div>

            {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#2DD4BF] mb-4"></div>
                    <p className="text-gray-500 animate-pulse">Searching for medicines...</p>
                </div>
            ) : results.length > 0 ? (
                <div className="space-y-6">
                    {/* Results Grid */}
                    <div className="grid grid-cols-1 gap-4">
                        {results.map((medicine) => (
                            <div key={medicine.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow">
                                <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                                    <div className="flex items-start gap-4">
                                        <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-blue-500 flex-shrink-0">
                                            <Pill className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{medicine.name}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{medicine.manufacturer} • {medicine.type}</p>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="text-xl font-bold text-[#2DD4BF]">{medicine.price}</div>
                                        <button className="text-sm font-medium text-blue-500 hover:text-blue-600 hover:underline">
                                            View {medicine.substitutes} Substitutes
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
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
        </div>
    );
};

export default MedicineSearch;
