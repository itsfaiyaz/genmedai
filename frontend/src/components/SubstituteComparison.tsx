import { useFrappeGetCall } from 'frappe-react-sdk';
import { Pill, Check, TrendingDown } from 'lucide-react';
import { useMemo } from 'react';

interface ComponentProps {
    medicine: any;
}

const SubstituteComparison = ({ medicine }: ComponentProps) => {
    const { data: substitutesData, isLoading } = useFrappeGetCall(
        'genmedai.api.get_substitutes',
        {
            medicine_id: medicine.id,
            salt_composition: medicine.salt_composition,
            current_price: medicine.original_price || medicine.price
        }
    );

    const substitutes = (substitutesData as any[]) || [];
    const bestSubstitute = substitutes.length > 0 ? substitutes[0] : null;

    const cleanPrice = (price: any) => {
        if (!price) return 0;
        return parseFloat(String(price).replace(/[^\d.]/g, ''));
    };

    const originalPrice = cleanPrice(medicine.price);
    const bestPrice = bestSubstitute ? cleanPrice(bestSubstitute.price) : originalPrice;
    const savings = originalPrice - bestPrice;
    const savePercentage = originalPrice > 0 ? Math.round((savings / originalPrice) * 100) : 0;

    if (isLoading) {
        return (
            <div className="animate-pulse rounded-3xl bg-gray-100 dark:bg-gray-800 h-64 w-full mt-8"></div>
        );
    }

    if (!substitutes.length) return null;

    return (
        <div className="mt-12 w-full">
            <div className="grid lg:grid-cols-5 gap-8 items-center">

                {/* Left Side: Marketing / Context */}
                <div className="lg:col-span-2 space-y-6">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-brand-navy dark:text-white leading-tight">
                        Real Price Comparison. <br />
                        <span className="text-brand-teal">Real Savings.</span>
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
                        Most people don't know that generic medicines have the exact same active ingredients as expensive brands. Our AI reveals the truth and puts money back in your pocket.
                    </p>

                    <div className="space-y-4 pt-4">
                        <div className="flex items-start gap-3 bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-100 dark:border-green-900/30">
                            <div className="w-1 bg-green-500 rounded-full self-stretch"></div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <Check className="w-4 h-4 text-green-600" />
                                    Same Efficacy
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">FDA/CDSCO approved standards for safety and results.</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-900/30">
                            <div className="w-1 bg-blue-500 rounded-full self-stretch"></div>
                            <div>
                                <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    <TrendingDown className="w-4 h-4 text-brand-blue" />
                                    Huge Cost Difference
                                </h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Typically 40% to 80% cheaper for the same composition.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Side: The Card */}
                <div className="lg:col-span-3">
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Header */}
                        <div className="bg-[#0B1221] p-6 text-white flex justify-between items-start">
                            <div className="space-y-1">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Prescribed Medicine</p>
                                <h3 className="text-2xl font-bold">{medicine.name}</h3>
                                <p className="text-sm text-brand-teal">Salt: {medicine.salt_composition}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Market Price</p>
                                <div className="text-2xl font-bold line-through text-red-400/80">₹{originalPrice}</div>
                            </div>
                        </div>

                        {/* List */}
                        <div className="p-6 space-y-4 bg-gray-50/50 dark:bg-gray-800/50">
                            <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">GenMedAI Found Substitutes</p>

                            {substitutes.slice(0, 3).map((sub, idx) => {
                                const subPrice = cleanPrice(sub.price);
                                const isBest = idx === 0;
                                const subSavingsPercent = Math.round(((originalPrice - subPrice) / originalPrice) * 100);

                                return (
                                    <div
                                        key={idx}
                                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border transition-all ${isBest
                                                ? 'bg-white dark:bg-gray-700 border-brand-teal/50 shadow-md ring-1 ring-brand-teal/20 scale-[1.02]'
                                                : 'bg-white dark:bg-gray-700 border-gray-100 dark:border-gray-600 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="mb-2 sm:mb-0">
                                            <h4 className="font-bold text-gray-900 dark:text-white text-lg">{sub.brand_name} {sub.strength}</h4>
                                            <p className="text-xs text-gray-500">{sub.manufacturer}</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-bold text-gray-900 dark:text-white text-xl">₹{subPrice}</div>
                                            {subSavingsPercent > 0 && (
                                                <span className="inline-block bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-300 text-xs font-extrabold px-2 py-0.5 rounded-full mt-1">
                                                    Save {subSavingsPercent}%
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Footer */}
                        {savings > 0 && (
                            <div className="bg-white dark:bg-gray-800 p-4 text-center border-t border-gray-100 dark:border-gray-700">
                                <p className="font-bold text-gray-800 dark:text-white">
                                    Save up to <span className="text-green-600 dark:text-green-400">₹{savings}</span> on this prescription alone.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default SubstituteComparison;
