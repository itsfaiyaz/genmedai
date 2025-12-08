import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { useState } from 'react';

const ContactUs = () => {
    // Basic form state (not functional yet)
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert("Thanks for contacting us! We'll get back to you shortly.");
        // Implement actual form submission logic here
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        We'd love to hear from you. Whether you have a question about using GenMedAI or need technical support, our team is ready to help.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h2>

                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-brand-blue rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <Mail className="w-6 h-6" />
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Us</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1 mb-2">
                                        For general inquiries and support:
                                    </p>
                                    <a href="mailto:support@ontu.in" className="text-lg font-bold text-brand-teal hover:underline">
                                        support@ontu.in
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-brand-teal rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <Phone className="w-6 h-6" />
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Call Us</h3>
                                    <p className="text-gray-500 dark:text-gray-400 mt-1 mb-2">
                                        Mon-Fri from 9am to 6pm IST:
                                    </p>
                                    <a href="tel:+919122331261" className="text-lg font-bold text-brand-teal hover:underline">
                                        +91 9122331261
                                    </a>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                    <MapPin className="w-6 h-6" />
                                </div>
                                <div className="ml-6">
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Office</h3>
                                    <p className="text-gray-600 dark:text-gray-300 mt-1 font-medium">
                                        Ontu Technologies
                                    </p>
                                    <p className="text-gray-500 dark:text-gray-400">
                                        Patna, Bihar, India
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-100/50 dark:shadow-none">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Your Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border focus:ring-2 focus:ring-brand-teal outline-none transition-all dark:text-white"
                                    placeholder="name@example.com"
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    rows={4}
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border focus:ring-2 focus:ring-brand-teal outline-none transition-all dark:text-white resize-none"
                                    placeholder="How can we help you?"
                                    required
                                />
                            </div>

                            <button type="submit" className="w-full py-4 bg-brand-gradient text-white font-bold rounded-xl shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2">
                                <Send className="w-5 h-5" />
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
