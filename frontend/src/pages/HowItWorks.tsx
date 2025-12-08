import { Search, Brain, CheckCircle } from 'lucide-react';

const HowItWorks = () => {
    const steps = [
        {
            icon: Search,
            title: "1. Search or Upload",
            description: "Enter your prescribed medicine name or simply upload an image of your prescription.",
            color: "text-blue-600",
            bg: "bg-blue-100 dark:bg-blue-900/30"
        },
        {
            icon: Brain,
            title: "2. AI Analysis",
            description: "GenMedAI's advanced algorithm identifies the active salt matching composition and dosage strength.",
            color: "text-purple-600",
            bg: "bg-purple-100 dark:bg-purple-900/30"
        },
        {
            icon: CheckCircle,
            title: "3. Find Substitutes",
            description: "We instantly list verified generic and branded substitutes that have the exact same effect but cost significantly less.",
            color: "text-teal-600",
            bg: "bg-teal-100 dark:bg-teal-900/30"
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white mb-6">
                        How <span className="text-brand-teal">GenMedAI</span> Works
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        In just 3 simple steps, you can save up to 80% on your medical bills.
                    </p>
                </div>

                <div className="relative">
                    {/* Connecting Line (Desktop) */}
                    <div className="hidden md:block absolute top-[2.5rem] left-[10%] right-[10%] h-1 bg-gradient-to-r from-blue-200 via-purple-200 to-teal-200 dark:from-gray-800 dark:via-gray-800 dark:to-gray-800 -z-10"></div>

                    <div className="grid md:grid-cols-3 gap-12">
                        {steps.map((step, idx) => (
                            <div key={idx} className="relative flex flex-col items-center text-center">
                                <div className={`w-20 h-20 rounded-full ${step.bg} ${step.color} flex items-center justify-center mb-8 shadow-lg z-10 bg-white dark:bg-gray-900 border-4 border-white dark:border-gray-950`}>
                                    <step.icon className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                                    {step.title}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mt-20 bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 md:p-12 text-center max-w-4xl mx-auto border border-gray-100 dark:border-gray-800">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Backed by Science</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Our database is curated by qualified pharmacists and powered by Ontu Technologies' proprietary AI models to ensure 100% safety and accuracy.
                    </p>
                    <div className="inline-flex gap-4 items-center justify-center text-sm font-semibold text-gray-500 bg-white dark:bg-gray-800 px-6 py-2 rounded-full shadow-sm">
                        <span>Trusted Data</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-gray-300"></span>
                        <span>Verified by Experts</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HowItWorks;
