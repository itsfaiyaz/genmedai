import { Pill, Wallet, ScanLine, ShieldCheck } from 'lucide-react';

const Features = () => {
    const features = [
        {
            icon: Pill,
            title: "AI-Powered Salt Matching",
            description: "We analyze the exact salt composition of your medicine and find 100% equivalent substitutes.",
            color: "text-blue-500",
            bg: "bg-blue-50 dark:bg-blue-900/20"
        },
        {
            icon: Wallet,
            title: "Save 40–80% on Medicines",
            description: "Stop overpaying for branded medicines. Get cheaper generics with identical composition.",
            color: "text-[#2DD4BF]",
            bg: "bg-teal-50 dark:bg-teal-900/20"
        },
        {
            icon: ScanLine,
            title: "Prescription Scanner",
            description: "Upload your prescription and let GenMedAI extract everything automatically.",
            color: "text-purple-500",
            bg: "bg-purple-50 dark:bg-purple-900/20"
        },
        {
            icon: ShieldCheck,
            title: "Safety First",
            description: "We do not sell medicines. We only provide accurate, unbiased information.",
            color: "text-gray-900 dark:text-white",
            bg: "bg-gray-100 dark:bg-gray-800"
        }
    ];

    return (
        <div className="py-24 bg-white dark:bg-gray-950">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        Why Millions Will Choose GenMedAI
                    </h2>
                    <div className="h-1.5 w-24 bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] rounded-full mx-auto"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className={`w-14 h-14 ${feature.bg} rounded-xl flex items-center justify-center mb-6`}>
                                <feature.icon className={`w-7 h-7 ${feature.color}`} />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                                {feature.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Features;
