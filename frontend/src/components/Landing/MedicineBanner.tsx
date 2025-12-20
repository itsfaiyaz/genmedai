import { useNavigate } from 'react-router-dom';
import { ArrowRight, FileText, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const MedicineBanner = () => {
    const navigate = useNavigate();

    return (
        <section id="explore-actions" className="py-8 -mt-2 relative z-20">
            <div className="container mx-auto max-w-6xl px-4">
                <div className="grid md:grid-cols-2 gap-6">

                    {/* Card 1: Browse Medicines (Active) with Custom Image Background */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        onClick={() => navigate('/medicines')}
                        className="group cursor-pointer relative overflow-hidden rounded-[2rem] shadow-2xl transition-all hover:scale-[1.02] hover:shadow-brand-teal/20 min-h-[260px] flex md:block" // Increased height slightly
                    >
                        {/* Full Background Image with Overlay */}
                        <div className="absolute inset-0">
                            <img
                                src="/assets/genmedai/images/medicine-catalog-banner.png"
                                alt="Medicine Catalog"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                            {/* Teal Gradient Overlay to ensure text readability */}
                            <div className="absolute inset-0 bg-gradient-to-r from-brand-teal/90 via-brand-teal/70 to-transparent mix-blend-multiply" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60" />
                        </div>

                        <div className="relative z-10 p-8 md:p-10 flex flex-col justify-between h-full text-white">
                            <div>
                                <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md border border-white/30 text-xs font-bold uppercase tracking-wider mb-4">
                                    Instant Access
                                </span>
                                <h3 className="text-3xl font-bold mb-3 text-shadow-sm">
                                    Browse Medicines
                                </h3>
                                <p className="text-white/90 font-medium text-lg leading-relaxed max-w-sm text-shadow-sm">
                                    Search our verified database for substitutes, detailed salts, and pricing.
                                </p>
                            </div>

                            <div className="pt-8 flex items-center font-bold text-white group-hover:translate-x-2 transition-transform">
                                Explore Catalog <ArrowRight className="w-6 h-6 ml-2" />
                            </div>
                        </div>
                    </motion.div>

                    {/* Card 2: Upload Prescription (Coming Soon) - Distinct "Future" Style */}
                    <motion.div
                        id="auto-prescription-card"
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="relative overflow-hidden bg-gray-50 dark:bg-gray-900 rounded-[2rem] p-8 md:p-10 shadow-inner border-2 border-dashed border-gray-200 dark:border-gray-800 min-h-[260px] flex flex-col justify-between group"
                    >
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-14 h-14 rounded-2xl bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                                    <FileText className="w-7 h-7 text-gray-400 dark:text-gray-500" />
                                </div>
                                <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                                    <Sparkles className="w-3 h-3" /> Coming Soon
                                </span>
                            </div>

                            <h3 className="text-2xl font-bold text-gray-400 dark:text-gray-500 mb-3">
                                Smart Prescription Audit
                            </h3>
                            <p className="text-gray-400 dark:text-gray-500 font-medium leading-relaxed max-w-sm">
                                We are building an AI engineer to read your prescription photos instantly. It will verify dosages and suggest safe, cheaper alternatives automatically.
                            </p>
                        </div>

                        <div className="relative z-10 pt-6">
                            <button disabled className="px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 font-semibold text-sm cursor-not-allowed">
                                Notify Me When Ready
                            </button>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default MedicineBanner;
