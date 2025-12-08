// Since I don't want to assume shadcn is installed in a specific path if I haven't checked, 
// I will build a simple custom Accordion component right here to be safe and dependency-free.

import { useState } from 'react';
import { ChevronDown, HelpCircle, MessageCircle } from 'lucide-react';

const FAQItem = ({ question, answer }: { question: string, answer: React.ReactNode }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="border border-gray-200 dark:border-gray-800 rounded-xl overflow-hidden mb-4 bg-white dark:bg-gray-900 transition-all hover:shadow-md">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
            >
                <span className="text-lg font-bold text-gray-900 dark:text-white pr-4">{question}</span>
                <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            <div className={`transition-all duration-300 overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="p-6 pt-0 text-gray-600 dark:text-gray-400 leading-relaxed border-t border-gray-100 dark:border-gray-800/50 mt-2">
                    {answer}
                </div>
            </div>
        </div>
    );
};

const FAQs = () => {
    const faqs = [
        {
            question: "Is GenMedAI safe to use?",
            answer: "Absolutely. GenMedAI only recommends medicine substitutes that have the exact same active salt composition and strength as your prescribed medicine. However, we always recommend consulting your doctor before switching any medication."
        },
        {
            question: "How does GenMedAI find cheaper medicines?",
            answer: "We scan thousands of medicines available in the market. Many branded medicines are expensive due to marketing costs. Generic or alternative brands with the same formula are often much cheaper. We simply connect you to these savings."
        },
        {
            question: "Do you sell medicines?",
            answer: "No, GenMedAI is an information platform developed by Ontu Technologies. We do not sell medicines directly. we help you find the best prices and substitutes."
        },
        {
            question: "Is this service free?",
            answer: "Yes! Searching for medicines and finding substitutes on GenMedAI is completely free for all users."
        },
        {
            question: "How accurate is the AI prescription reader?",
            answer: "Our AI model is trained on millions of medical records and is highly accurate. However, if the handwriting is extremely unclear, it might ask for manual verification. Always double-check the result."
        }
    ];

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-20 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 text-brand-teal mb-6">
                        <HelpCircle className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white mb-6">
                        Frequently Asked Questions
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300">
                        Have questions? We have answers.
                    </p>
                </div>

                <div className="space-y-2">
                    {faqs.map((faq, idx) => (
                        <FAQItem key={idx} question={faq.question} answer={faq.answer} />
                    ))}
                </div>

                <div className="mt-16 text-center bg-blue-50 dark:bg-gray-900 p-8 rounded-2xl border border-blue-100 dark:border-gray-800">
                    <h3 className="text-xl font-bold text-brand-navy dark:text-white mb-2">Still have questions?</h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        Can't find the answer you're looking for? Please seek support from our friendly team.
                    </p>
                    <a href="mailto:support@ontu.in" className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-brand-teal hover:bg-brand-dark-teal transition-colors">
                        <MessageCircle className="w-5 h-5 mr-2" />
                        Contact Support
                    </a>
                </div>
            </div>
        </div>
    );
};

export default FAQs;
