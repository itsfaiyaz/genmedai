import { FileText, AlertTriangle } from 'lucide-react';

const TermsOfService = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-20 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 mb-6">
                        <FileText className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white mb-6">
                        Terms of Service
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Last updated: December 9, 2024
                    </p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    <p className="lead">
                        Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the <strong>genmedai.ontu.in</strong> website (the "Service") operated by <strong>Ontu Technologies</strong> ("us", "we", or "our").
                    </p>

                    <h3>1. Conditions of Use</h3>
                    <p>
                        Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.
                    </p>
                    <p>
                        By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.
                    </p>

                    <h3>2. Medical Disclaimer</h3>
                    <div className="p-4 bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 rounded-r-md my-6">
                        <div className="flex items-start">
                            <AlertTriangle className="w-6 h-6 text-red-500 mr-2 flex-shrink-0 mt-1" />
                            <div>
                                <h4 className="text-red-700 dark:text-red-400 font-bold m-0 p-0 text-lg">Important Notice</h4>
                                <p className="text-red-600 dark:text-red-300 m-0 p-0 text-sm mt-1">
                                    GenMedAI is an information tool only. The content is not intended to be a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition.
                                </p>
                            </div>
                        </div>
                    </div>

                    <h3>3. Accuracy of Information</h3>
                    <p>
                        While Ontu Technologies strives to provide accurate and up-to-date information, the pharmaceutical data is complex and subject to change. We do not guarantee the completeness or absolute accuracy of the medicine data, prices, or substitute matches.
                    </p>

                    <h3>4. Intellectual Property</h3>
                    <p>
                        The Service and its original content, features, and functionality are and will remain the exclusive property of Ontu Technologies and its licensors.
                    </p>

                    <h3>5. Links To Other Web Sites</h3>
                    <p>
                        Our Service may contain links to third-party web sites or services that are not owned or controlled by Ontu Technologies. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party web sites or services.
                    </p>

                    <h3>6. Termination</h3>
                    <p>
                        We may terminate or suspend access to our Service immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.
                    </p>

                    <h3>7. Governing Law</h3>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of India, without regard to its conflict of law provisions.
                    </p>

                    <h3>8. Contact Us</h3>
                    <p>
                        If you have any questions about these Terms, please contact us at:
                    </p>
                    <p className="font-bold">
                        Ontu Technologies<br />
                        Email: support@ontu.in<br />
                        Phone: +91 9122331261
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;
