import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import type { FormEvent } from 'react';
import { useFrappeGetCall, useFrappePostCall } from 'frappe-react-sdk';

const ContactUs = () => {
    // Fetch settings via public API to allow guests
    // Using getCall handles the loading state immediately on mount vs postCall which has a delay
    const { data: settingsResult, isLoading: isSettingsLoading, error: settingsError } = useFrappeGetCall('genmedai.api.get_contact_us_settings');

    // Form state
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [queryType, setQueryType] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    // API Call for submission
    const { call: submitQuery, loading: isSubmitting } = useFrappePostCall('genmedai.api.submit_contact_query');

    const settings = settingsResult?.message; // API returns the doc directly, usually wrapped in message

    // Parse query options
    const queryOptions = settings?.query_options
        ? settings.query_options.split('\n').filter((o: string) => o.trim())
        : ['General Inquiry'];

    // If settings not loaded (and not yet fetched), show loader
    if (isSettingsLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950">
                <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
            </div>
        );
    }

    if (settingsError || (!settings && !isSettingsLoading)) {
        // Settings fetch returned empty/null or failed
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contact Unavailable</h1>
                    <p className="text-gray-500">Could not load contact settings. Please try again later.</p>
                </div>
            </div>
        );
    }

    if (!settings?.forward_to_email) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-white dark:bg-gray-950">
                <div className="text-center p-8">
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Contact Unavailable</h1>
                    <p className="text-gray-500">The contact form is currently disabled.</p>
                </div>
            </div>
        );
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        try {
            await submitQuery({
                email,
                message,
                query_type: queryType || queryOptions[0]
            });

            setIsSuccess(true);
            setEmail('');
            setMessage('');
            setQueryType('');

        } catch (error: any) {
            console.error("Submission Error:", error);
            const errorMsg = error?.message || error?.exception || "Something went wrong. Please try again later.";
            alert(`Error: ${errorMsg}`);
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pt-20 pb-20 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-extrabold text-brand-navy dark:text-white mb-6">
                        {settings?.heading || 'Get in Touch'}
                    </h1>
                    <div
                        className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto prose dark:prose-invert"
                        dangerouslySetInnerHTML={{ __html: settings?.introduction || "We'd love to hear from you." }}
                    />
                </div>

                <div className="grid md:grid-cols-2 gap-12 items-start">
                    {/* Contact Info */}
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8">Contact Information</h2>

                        <div className="space-y-8">
                            {settings?.email_id && (
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 text-brand-blue rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Email Us</h3>
                                        <a href={`mailto:${settings.email_id}`} className="text-lg font-bold text-brand-teal hover:underline break-all">
                                            {settings.email_id}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {settings?.phone && (
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-teal-100 dark:bg-teal-900/30 text-brand-teal rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Call Us</h3>
                                        <a href={`tel:${settings.phone}`} className="text-lg font-bold text-brand-teal hover:underline">
                                            {settings.phone}
                                        </a>
                                    </div>
                                </div>
                            )}

                            {(settings?.address_line1 || settings?.city) && (
                                <div className="flex items-start">
                                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 text-purple-600 rounded-xl flex items-center justify-center flex-shrink-0 mt-1">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div className="ml-6">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {settings?.address_title || 'Office'}
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 mt-1 font-medium">
                                            {settings?.address_line1} {settings?.address_line2 && <br />} {settings?.address_line2}
                                        </p>
                                        <p className="text-gray-500 dark:text-gray-400">
                                            {settings?.city} {settings?.state && `, ${settings.state}`} {settings?.pincode}
                                            {settings?.country && <br />} {settings?.country}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Contact Form or Success State */}
                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-8 border border-gray-100 dark:border-gray-800 shadow-xl shadow-gray-100/50 dark:shadow-none min-h-[500px] flex flex-col justify-center">
                        {isSuccess ? (
                            <div className="text-center py-12 animate-in fade-in zoom-in duration-500">
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle className="w-10 h-10" />
                                </div>
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Message Sent!</h3>
                                <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-sm mx-auto">
                                    Thank you for contacting us. We have received your message and will get back to you shortly.
                                </p>
                                <button
                                    onClick={() => setIsSuccess(false)}
                                    className="px-8 py-3 bg-brand-gradient text-white font-bold rounded-xl shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-1 transition-all"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Send a Message</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">

                                    {/* Query Type Dropdown */}
                                    {queryOptions.length > 0 && (
                                        <div>
                                            <label htmlFor="queryType" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Topic
                                            </label>
                                            <select
                                                id="queryType"
                                                value={queryType}
                                                onChange={(e) => setQueryType(e.target.value)}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 border focus:ring-2 focus:ring-brand-teal outline-none transition-all dark:text-white"
                                            >
                                                <option value="" disabled>Select a topic</option>
                                                {queryOptions.map((opt: string) => (
                                                    <option key={opt} value={opt}>{opt}</option>
                                                ))}
                                            </select>
                                        </div>
                                    )}

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

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-4 bg-brand-gradient text-white font-bold rounded-xl shadow-lg hover:shadow-brand-blue/30 hover:-translate-y-1 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                                        {isSubmitting ? "Sending..." : "Send Message"}
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
