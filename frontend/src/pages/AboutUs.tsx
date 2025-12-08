import { Info, Target, Users, Globe } from 'lucide-react';

const AboutUs = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-20 transition-colors duration-300">
            {/* Hero Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-brand-blue mb-6">
                    <Info className="w-8 h-8" />
                </div>
                <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white tracking-tight mb-6">
                    About <span className="text-brand-teal">GenMedAI</span>
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                    A revolutionary healthcare initiative by <span className="font-bold text-gray-900 dark:text-white">Ontu Technologies</span>.
                    We are on a mission to democratize access to affordable healthcare through the power of Artificial Intelligence.
                </p>
            </div>

            {/* Content Sections */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-3 gap-12">
                    {/* Mission */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-xl flex items-center justify-center mb-6">
                            <Target className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Mission</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            To empower every individual with the knowledge of affordable medicine alternatives. We believe that quality healthcare shouldn't be a financial burden.
                        </p>
                    </div>

                    {/* Who We Are */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                            <Users className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Who We Are</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            GenMedAI is a flagship product of <span className="font-semibold">Ontu Technologies</span>. We are a team of data scientists, pharmacists, and engineers working together to decode medicine pricing.
                        </p>
                    </div>

                    {/* Reach */}
                    <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-2xl border border-gray-100 dark:border-gray-800">
                        <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-brand-teal rounded-xl flex items-center justify-center mb-6">
                            <Globe className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Our Vision</h3>
                        <p className="text-gray-600 dark:text-gray-400">
                            To become the world's most trusted source for medicine information, ensuring transparency and accessibility in the pharmaceutical industry.
                        </p>
                    </div>
                </div>

                <div className="mt-20 text-center">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Developed by Ontu Technologies</h2>
                    <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                        Ontu Technologies is committed to building digital solutions that solve real-world problems. GenMedAI is our step towards a healthier, more informed society.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
