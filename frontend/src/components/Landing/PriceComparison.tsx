
const PriceComparison = () => {
    return (
        <div className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

                    {/* Left Content */}
                    <div>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6">
                            Real Price Comparison. <br />
                            <span className="text-[#2DD4BF]">Real Savings.</span>
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                            Most people don't know that generic medicines have the exact same active ingredients as expensive brands. Our AI reveals the truth and puts money back in your pocket.
                        </p>

                        <div className="space-y-4">
                            <div className="flex items-start gap-4 p-4 bg-green-50 dark:bg-green-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
                                <div className="w-1.5 h-12 bg-[#2DD4BF] rounded-full flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Same Efficacy</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">FDA/CDSCO approved standards</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                                <div className="w-1.5 h-12 bg-[#3B82F6] rounded-full flex-shrink-0"></div>
                                <div>
                                    <h4 className="font-bold text-gray-900 dark:text-white">Huge Cost Difference</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Typically 40% to 80% cheaper</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Content - Visual Card */}
                    <div className="relative">
                        {/* Background Decorations */}
                        <div className="absolute -inset-4 bg-gradient-to-r from-gray-100 to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-3xl transform rotate-3 -z-10"></div>

                        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            {/* Card Header */}
                            <div className="bg-slate-900 p-6 flex justify-between items-start">
                                <div>
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Prescribed Medicine</p>
                                    <h3 className="text-2xl font-bold text-white">Urimax 0.4 mg</h3>
                                    <p className="text-[#2DD4BF] text-sm font-medium mt-1">Salt: Tamsulosin 0.4 mg</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-gray-400 text-xs font-bold uppercase tracking-wider mb-1">Market Price</p>
                                    <p className="text-2xl font-bold text-red-400 line-through">₹350</p>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-6 space-y-4">
                                <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">GENMEDAI FOUND SUBSTITUTES</p>

                                {/* Substitute Item 1 (Highlighted) */}
                                <div className="bg-white dark:bg-gray-800 border-2 border-[#2DD4BF] rounded-xl p-4 shadow-sm flex items-center justify-between relative overflow-hidden">
                                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-[#2DD4BF]"></div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 dark:text-white">Generic Tamsulosin 0.4</h4>
                                        <p className="text-xs text-gray-500">Jan Aushadhi / Generic</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-900 dark:text-white">₹120</p>
                                        <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">Save 65%</span>
                                    </div>
                                </div>

                                {/* Substitute Item 2 */}
                                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between opacity-80">
                                    <div>
                                        <h4 className="font-bold text-gray-700 dark:text-gray-300">Tamlink 0.4</h4>
                                        <p className="text-xs text-gray-500">Sun Pharma</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-700 dark:text-gray-300">₹135</p>
                                    </div>
                                </div>

                                {/* Substitute Item 3 */}
                                <div className="bg-gray-50 dark:bg-gray-900/50 border border-gray-100 dark:border-gray-700 rounded-xl p-4 flex items-center justify-between opacity-80">
                                    <div>
                                        <h4 className="font-bold text-gray-700 dark:text-gray-300">Tamsusafe 0.4</h4>
                                        <p className="text-xs text-gray-500">Mankind</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-gray-700 dark:text-gray-300">₹140</p>
                                    </div>
                                </div>

                                <div className="pt-4 text-center">
                                    <p className="text-sm font-bold text-gray-900 dark:text-white">
                                        Save up to <span className="text-green-600">₹230</span> on this prescription alone.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PriceComparison;
