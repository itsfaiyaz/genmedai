import { Shield } from 'lucide-react';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-20 transition-colors duration-300">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 mb-6">
                        <Shield className="w-8 h-8" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white mb-6">
                        Privacy Policy
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        Effective Date: December 9, 2024
                    </p>
                </div>

                <div className="prose prose-lg dark:prose-invert max-w-none text-gray-600 dark:text-gray-300">
                    <p className="lead">
                        At GenMedAI, accessible from <strong>genmedai.ontu.in</strong> and operated by <strong>Ontu Technologies</strong>, one of our main priorities is the privacy of our visitors. This Privacy Policy document contains types of information that is collected and recorded by GenMedAI and how we use it.
                    </p>

                    <h3>1. Interpretation and Definitions</h3>
                    <p>
                        The words of which the initial letter is capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.
                    </p>

                    <h3>2. Collecting and Using Your Personal Data</h3>
                    <p>
                        We may ask you to provide us with certain personally identifiable information that can be used to contact or identify you, including but not limited to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>Email address</li>
                        <li>First name and last name</li>
                        <li>Phone number</li>
                        <li>Uploaded prescription images (processed for data extraction only)</li>
                    </ul>

                    <h3>3. Use of Data</h3>
                    <p>
                        Ontu Technologies uses the collected data for various purposes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>To provide and maintain our Service</li>
                        <li>To notify you about changes to our Service</li>
                        <li>To allow you to participate in interactive features when you choose to do so</li>
                        <li>To provide customer support (via support@ontu.in)</li>
                        <li>To gather analysis or valuable information so that we can improve our Service</li>
                    </ul>

                    <h3>4. Data Security</h3>
                    <p>
                        The security of your data is important to us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While we strive to use commercially acceptable means to protect your Personal Data, we cannot guarantee its absolute security.
                    </p>

                    <h3>5. Contact Us</h3>
                    <p>
                        If you have any questions about this Privacy Policy, You can contact us:
                    </p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li>By email: <a href="mailto:support@ontu.in" className="text-brand-teal font-bold">support@ontu.in</a></li>
                        <li>By phone: <a href="tel:+919122331261" className="text-brand-teal font-bold">+91 9122331261</a></li>
                    </ul>

                    <div className="mt-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-xl border border-gray-100 dark:border-gray-800 text-sm">
                        <p className="mb-0">
                            <strong>Note:</strong> GenMedAI does not share your personal health data with third-party advertisers. All prescription data is processed anonymously for the sole purpose of finding medicine substitutes.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
