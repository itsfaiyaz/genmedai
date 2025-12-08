import { Mail } from 'lucide-react';

const ContactUs = () => {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
            <div className="max-w-7xl mx-auto text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-teal-100 dark:bg-teal-900/30 text-brand-teal mb-6">
                    <Mail className="w-8 h-8" />
                </div>
                <h1 className="text-4xl font-extrabold text-brand-navy dark:text-white tracking-tight mb-4">
                    Contact Us
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                    Have questions or feedback? We'd love to hear from you. Reach out to our support team.
                </p>

                <div className="mt-12 p-12 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-2xl bg-gray-50 dark:bg-gray-900/50">
                    <p className="text-gray-500 dark:text-gray-500 font-medium">
                        Contact form and details coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
