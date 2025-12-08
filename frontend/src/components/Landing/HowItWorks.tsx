
const HowItWorks = () => {
    const steps = [
        {
            num: 1,
            title: "Upload prescription or type your medicine.",
            desc: "Start by entering the medicine name or uploading your prescription for analysis."
        },
        {
            num: 2,
            title: "AI extracts drug name, salt, dose & strength.",
            desc: "Our advanced AI identifies the exact composition and strength of your medicine."
        },
        {
            num: 3,
            title: "We find equivalent substitutes in the same salt category.",
            desc: "Our database matches your medicine with cheaper, equally effective substitutes."
        },
        {
            num: 4,
            title: "Compare prices on Pharmeasy, 1mg, Netmeds & more.",
            desc: "See real-time price comparisons to get the best deal available."
        }
    ];

    return (
        <div className="py-24 bg-gray-50 dark:bg-gray-900/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
                        How GenMedAI Works
                    </h2>
                    <p className="text-[#2DD4BF] font-bold text-lg">
                        Simple. Smart. Effective.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden lg:block absolute top-12 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10 transform translate-y-1/2"></div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {steps.map((step, idx) => (
                            <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm hover:shadow-md transition-all text-center relative group">
                                <div className="w-12 h-12 bg-[#2DD4BF] text-white rounded-full flex items-center justify-center font-bold text-xl mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform">
                                    {step.num}
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3 leading-tight">
                                    {step.title}
                                </h3>
                                {/* <p className="text-gray-500 dark:text-gray-400 text-sm">
                                    {step.desc}
                                </p> */}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
