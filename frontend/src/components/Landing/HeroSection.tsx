import { Upload, ShieldCheck, CheckCircle2, Zap } from 'lucide-react';

const HeroSection = () => {
    return (
        <div className="relative overflow-hidden bg-white dark:bg-gray-950 pt-16 pb-24 sm:pt-24 sm:pb-32">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Content */}
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-bold mb-6">
                            <Zap className="w-4 h-4 fill-current" />
                            <span>AI-Powered Savings Engine</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 dark:text-white leading-[1.1] mb-6">
                            Smarter. <br />
                            Cheaper. <br />
                            Safer. <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF]">
                                Your AI Guide to Affordable Medicines.
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl leading-relaxed">
                            Upload your prescription or type a medicine name. GenMedAI finds cheaper substitutes with the same salt, same dose, same effect — powered by advanced AI.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 mb-10">
                            <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] hover:from-[#2563EB] hover:to-[#14B8A6] shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <SearchIcon className="w-5 h-5 mr-2" />
                                Find Substitute Now
                            </button>
                            <button className="inline-flex items-center justify-center px-8 py-4 text-base font-bold rounded-full text-white bg-gray-900 dark:bg-gray-800 hover:bg-gray-800 dark:hover:bg-gray-700 shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1">
                                <Upload className="w-5 h-5 mr-2" />
                                Upload Prescription
                            </button>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            {[
                                { icon: CheckCircle2, text: "Same Salt" },
                                { icon: CheckCircle2, text: "Same Dosage" },
                                { icon: ShieldCheck, text: "Trusted AI" },
                                { icon: Zap, text: "Save 80%" },
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                    <item.icon className="w-5 h-5 text-[#2DD4BF]" />
                                    <span>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right Visual (Abstract) */}
                    <div className="relative hidden lg:block">
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-100 to-teal-100 dark:from-blue-900/20 dark:to-teal-900/20 rounded-full blur-3xl opacity-70 animate-pulse"></div>
                        <div className="relative z-10 mx-auto w-full max-w-md">
                            {/* Abstract Pill Representation */}
                            <div className="relative">
                                {/* Green/White Pill */}
                                <div className="flex items-center justify-center drop-shadow-2xl transform rotate-12 hover:rotate-0 transition-transform duration-700 ease-in-out">
                                    <div className="w-32 h-64 bg-gradient-to-br from-[#2DD4BF] to-[#14B8A6] rounded-l-full relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-full h-full bg-white/10 skew-x-12 origin-bottom-left"></div>
                                    </div>
                                    <div className="w-32 h-64 bg-white dark:bg-gray-100 rounded-r-full relative overflow-hidden flex items-center justify-center">
                                        <div className="w-24 h-48 bg-gray-50 rounded-full opacity-50 blur-xl"></div>
                                    </div>
                                </div>

                                {/* Floating Particles */}
                                <div className="absolute -top-10 -right-10 w-6 h-6 bg-blue-500 rounded-full animate-bounce delay-100"></div>
                                <div className="absolute top-20 -left-12 w-4 h-4 bg-[#2DD4BF] rounded-full animate-bounce delay-300"></div>
                                <div className="absolute bottom-10 right-0 w-5 h-5 bg-purple-500 rounded-full animate-bounce delay-700"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const SearchIcon = ({ className }: { className?: string }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.3-4.3" />
    </svg>
);

export default HeroSection;
