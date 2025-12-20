import React from 'react';
import { Upload, Search, ShieldCheck, Zap } from 'lucide-react';

const HeroSection: React.FC = () => {
    const scrollToSection = (id: string) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-40 overflow-hidden bg-white dark:bg-gray-950 transition-colors duration-300">
            {/* Background Effects */}
            <div className="absolute top-0 right-0 w-full lg:w-1/2 h-full bg-gradient-to-b from-blue-50/50 to-transparent dark:from-blue-900/10 pointer-events-none" />
            <div className="absolute -top-20 -right-20 w-72 h-72 md:w-96 md:h-96 bg-brand-teal/10 dark:bg-brand-teal/5 rounded-full blur-3xl animate-pulse" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

                    {/* Left Content */}
                    <div className="space-y-6 md:space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 border border-blue-100 dark:border-blue-800 text-brand-blue dark:text-blue-400 text-sm font-medium">
                            <Zap size={14} className="mr-2 fill-current" />
                            AI-Powered Savings Engine
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-brand-navy dark:text-white leading-tight tracking-tight">
                            Smarter. Cheaper. Safer.<br />
                            <span className="text-transparent bg-clip-text bg-brand-gradient">
                                Your AI Guide to Affordable Medicines.
                            </span>
                        </h1>

                        <p className="text-base sm:text-lg text-gray-600 dark:text-gray-300 leading-relaxed max-w-xl mx-auto lg:mx-0">
                            Upload your prescription or type a medicine name. GenMedAI finds cheaper substitutes with the same salt, same dose, same effect — powered by advanced AI.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                            <button
                                onClick={() => scrollToSection('search-section')}
                                className="px-8 py-4 rounded-full bg-brand-gradient text-white font-bold text-lg shadow-xl shadow-brand-blue/20 hover:shadow-brand-blue/40 hover:-translate-y-1 transition-all duration-300 flex items-center justify-center cursor-pointer"
                            >
                                <Search size={20} className="mr-2" />
                                Find Substitute Now
                            </button>
                            <button
                                onClick={() => scrollToSection('auto-prescription-card')}
                                className="px-8 py-4 rounded-full border-2 border-gray-200 dark:border-gray-700 text-gray-400 dark:text-gray-500 font-bold text-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center cursor-pointer group"
                            >
                                <Upload size={20} className="mr-2 group-hover:scale-110 transition-transform" />
                                Upload Prescription
                                <span className="ml-2 text-[10px] uppercase tracking-wider bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-gray-400">Soon</span>
                            </button>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 text-sm font-medium text-gray-500 dark:text-gray-400 justify-items-center lg:justify-items-start">
                            <div className="flex items-center"><ShieldCheck size={16} className="text-brand-teal mr-1.5" /> Same Salt</div>
                            <div className="flex items-center"><ShieldCheck size={16} className="text-brand-teal mr-1.5" /> Same Dosage</div>
                            <div className="flex items-center"><ShieldCheck size={16} className="text-brand-teal mr-1.5" /> Trusted AI</div>
                            <div className="flex items-center"><ShieldCheck size={16} className="text-brand-teal mr-1.5" /> Save 80%</div>
                        </div>
                    </div>

                    {/* Right Visual - Abstract SVG Composition */}
                    <div className="relative hidden lg:block">
                        <svg viewBox="0 0 600 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
                            <defs>
                                <linearGradient id="heroGrad" x1="0" y1="0" x2="600" y2="500" gradientUnits="userSpaceOnUse">
                                    <stop offset="0%" stopColor="#1A8CEB" stopOpacity="0.1" />
                                    <stop offset="100%" stopColor="#31C776" stopOpacity="0.1" />
                                </linearGradient>
                                <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                                    <feGaussianBlur stdDeviation="20" result="blur" />
                                    <feComposite in="SourceGraphic" in2="blur" operator="over" />
                                </filter>
                                <linearGradient id="brandGrad" x1="0" y1="0" x2="1" y2="1">
                                    <stop offset="0%" stopColor="#3B82F6" />
                                    <stop offset="100%" stopColor="#2DD4BF" />
                                </linearGradient>
                            </defs>

                            {/* Abstract Mesh Background */}
                            <path d="M50,250 Q150,150 300,250 T550,250" stroke="url(#heroGrad)" strokeWidth="2" fill="none" className="animate-[dash_10s_linear_infinite]" strokeDasharray="10 10" />
                            <path d="M50,300 Q150,200 300,300 T550,300" stroke="url(#heroGrad)" strokeWidth="2" fill="none" className="animate-[dash_15s_linear_infinite]" strokeDasharray="5 15" />
                            <path d="M50,200 Q150,100 300,200 T550,200" stroke="url(#heroGrad)" strokeWidth="2" fill="none" className="animate-[dash_12s_linear_infinite]" strokeDasharray="15 5" />

                            {/* Glowing Central Elements - Suggesting Pills decomposing into data */}
                            <g filter="url(#glow)">
                                {/* Main Pill */}
                                <rect x="180" y="180" width="240" height="100" rx="50" fill="white" className="dark:fill-gray-800" fillOpacity="0.8" />
                                <path d="M300 180 L300 280" stroke="#E2E8F0" className="dark:stroke-gray-700" strokeWidth="2" />

                                {/* Half Colored */}
                                <path d="M180 230 C180 202.386 202.386 180 230 180 H300 V280 H230 C202.386 280 180 257.614 180 230 Z" fill="url(#brandGrad)" />
                            </g>

                            {/* Floating Data Particles */}
                            <circle cx="450" cy="200" r="8" fill="#1A8CEB" className="animate-bounce" style={{ animationDuration: '3s' }} />
                            <circle cx="480" cy="230" r="5" fill="#00C4A7" className="animate-bounce" style={{ animationDuration: '4s', animationDelay: '0.5s' }} />
                            <circle cx="440" cy="260" r="6" fill="#31C776" className="animate-bounce" style={{ animationDuration: '3.5s', animationDelay: '1s' }} />

                            {/* Scanning Line */}
                            <rect x="150" y="150" width="300" height="2" fill="#00C4A7" fillOpacity="0.5" className="animate-[scan_4s_ease-in-out_infinite]">
                            </rect>

                            {/* UI Card Floating */}
                            <rect x="380" y="300" width="180" height="120" rx="12" fill="white" className="dark:fill-gray-800 shadow-xl" />
                            <rect x="400" y="320" width="100" height="12" rx="6" fill="#E2E8F0" className="dark:fill-gray-700" />
                            <rect x="400" y="345" width="140" height="8" rx="4" fill="#F1F5F9" className="dark:fill-gray-700" />
                            <rect x="400" y="365" width="80" height="8" rx="4" fill="#F1F5F9" className="dark:fill-gray-700" />
                            <rect x="400" y="395" width="60" height="16" rx="4" fill="#10B981" />
                        </svg>
                    </div>
                </div>
            </div>

            <style>{`
        @keyframes dash {
          to { stroke-dashoffset: -1000; }
        }
        @keyframes scan {
          0%, 100% { transform: translateY(0); opacity: 0; }
          50% { transform: translateY(200px); opacity: 1; }
        }
      `}</style>
        </section>
    );
};

export default HeroSection;
