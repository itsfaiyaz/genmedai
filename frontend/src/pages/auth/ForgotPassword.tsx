import { useState } from 'react';
import { useFrappePostCall } from 'frappe-react-sdk';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft, CheckCircle, Lock } from 'lucide-react';

const ForgotPassword = () => {
    const { call, loading, error } = useFrappePostCall('frappe.core.doctype.user.user.reset_password');

    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            // The standard Frappe reset_password method expects 'user' argument
            await call({
                user: email
            });
            setSuccess(true);
        } catch (err: any) {
            console.error(err);
            // Frappe might throw an error if user not found, or generic error
            setErrorMessage(err.message || 'Failed to send reset email. Please check the email address.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-12 h-12 bg-[#2DD4BF]/10 dark:bg-[#2DD4BF]/20 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-6 w-6 text-[#2DD4BF]" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Forgot Password?</h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm">
                            No worries, we'll send you reset instructions.
                        </p>
                    </div>

                    {success ? (
                        <div className="text-center animate-in fade-in zoom-in duration-300">
                            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Check your email</h3>
                            <p className="text-gray-500 dark:text-gray-400 mb-6">
                                We've sent password reset instructions to <span className="font-medium text-gray-900 dark:text-white">{email}</span>
                            </p>
                            <Link
                                to="/login"
                                className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DD4BF] transition-all transform active:scale-[0.98]"
                            >
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Back to Login
                            </Link>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email address
                                </label>
                                <div className="mt-1 relative rounded-md shadow-sm group">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2DD4BF] transition-colors">
                                        <Mail className="h-5 w-5" aria-hidden="true" />
                                    </div>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/20 focus:border-[#2DD4BF] transition-all bg-white dark:bg-gray-900"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            {errorMessage && (
                                <p className="text-sm text-red-600 dark:text-red-400 text-center">{errorMessage}</p>
                            )}

                            <div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] hover:from-[#2563EB] hover:to-[#14B8A6] hover:shadow-lg hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DD4BF] disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                                >
                                    {loading ? (
                                        <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                    ) : (
                                        <Mail className="h-5 w-5 mr-2" />
                                    )}
                                    Send reset link
                                </button>
                            </div>
                        </form>
                    )}

                    <div className="mt-8 text-center">
                        <Link to="/login" className="text-sm font-bold text-[#2DD4BF] hover:text-[#14B8A6] flex items-center justify-center transition-colors">
                            <ArrowLeft className="w-4 h-4 mr-1" />
                            Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
