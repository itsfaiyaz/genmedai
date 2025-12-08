import { useState } from 'react';
import { useFrappePostCall, useFrappeAuth } from 'frappe-react-sdk';
import { Link, useLocation } from 'react-router-dom';
import { User, Mail, Loader2, CheckCircle, Phone, AlertCircle } from 'lucide-react';

const Register = () => {
    const { currentUser } = useFrappeAuth();
    const { call, loading, error } = useFrappePostCall('genmedai.api.register_user');
    const location = useLocation();
    const message = location.state?.message;

    const [email, setEmail] = useState('');
    const [fullName, setFullName] = useState('');
    const [mobileNo, setMobileNo] = useState('');
    const [gender, setGender] = useState('');
    const [success, setSuccess] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    if (currentUser && currentUser !== 'Guest') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-white/20 dark:border-gray-700 p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-[#3B82F6]/10 dark:bg-[#3B82F6]/20 mb-6">
                        <User className="h-8 w-8 text-[#3B82F6]" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Already Logged In</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        You are already signed in as <strong>{currentUser}</strong>.
                    </p>
                    <Link
                        to="/"
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DD4BF] transition-all"
                    >
                        Go to Home
                    </Link>
                </div>
            </div>
        );
    }

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage('');

        try {
            await call({
                email: email,
                full_name: fullName,
                mobile_no: mobileNo,
                gender: gender,
                redirect_to: window.location.origin + '/login'
            });
            setSuccess(true);
        } catch (err: any) {
            console.error('Registration Error:', err);
            let msg = 'Registration failed. Please try again.';

            if (err) {
                if (err._server_messages) {
                    try {
                        const messages = JSON.parse(err._server_messages);
                        if (Array.isArray(messages) && messages.length > 0) {
                            const firstMsg = JSON.parse(messages[0]);
                            msg = firstMsg.message || msg;
                        }
                    } catch (e) {
                        console.error('Error parsing server messages:', e);
                    }
                } else if (err.exception) {
                    const parts = err.exception.split(':');
                    if (parts.length > 1) {
                        msg = parts.slice(1).join(':').trim();
                    } else {
                        msg = err.exception;
                    }
                } else if (err.message && err.message !== 'There was an error.') {
                    msg = err.message;
                }
            }

            setErrorMessage(msg);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
                <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700 p-8 text-center animate-in fade-in zoom-in duration-300">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Registration Successful!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Please check your email to verify your account.
                    </p>
                    <Link
                        to="/login"
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DD4BF] transition-all"
                    >
                        Go to Login
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-950 p-4 transition-colors duration-300">
            <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-white/20 dark:border-gray-700">
                <div className="p-8 sm:p-10">
                    <div className="text-center mb-8">
                        <div className="mx-auto w-12 h-12 bg-[#2DD4BF]/10 dark:bg-[#2DD4BF]/20 rounded-full flex items-center justify-center mb-4">
                            <User className="h-6 w-6 text-[#2DD4BF]" />
                        </div>
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight">Create Account</h1>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join our community today</p>
                    </div>

                    {message && (
                        <div className="mb-6 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-blue-700 dark:text-blue-300">{message}</p>
                        </div>
                    )}

                    <form onSubmit={handleRegister} className="space-y-6">
                        {(errorMessage || error) && (
                            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 text-red-600 dark:text-red-400 text-sm flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 flex-shrink-0">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                </svg>
                                {errorMessage || error?.message || 'An error occurred'}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Full Name</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2DD4BF] transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                                <input
                                    type="text"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/20 focus:border-[#2DD4BF] transition-all bg-white dark:bg-gray-900"
                                    placeholder="John Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Email Address</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2DD4BF] transition-colors">
                                    <Mail className="h-5 w-5" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/20 focus:border-[#2DD4BF] transition-all bg-white dark:bg-gray-900"
                                    placeholder="john@example.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Gender</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2DD4BF] transition-colors">
                                    <User className="h-5 w-5" />
                                </div>
                                <select
                                    value={gender}
                                    onChange={(e) => setGender(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/20 focus:border-[#2DD4BF] transition-all bg-white dark:bg-gray-900 appearance-none"
                                    required
                                >
                                    <option value=""></option>
                                    <option value="Male">Male</option>
                                    <option value="Female">Female</option>
                                    <option value="Other">Other</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 block">Mobile Number</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-[#2DD4BF] transition-colors">
                                    <Phone className="h-5 w-5" />
                                </div>
                                <input
                                    type="tel"
                                    value={mobileNo}
                                    onChange={(e) => setMobileNo(e.target.value)}
                                    className="block w-full pl-10 pr-3 py-2.5 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2DD4BF]/20 focus:border-[#2DD4BF] transition-all bg-white dark:bg-gray-900"
                                    placeholder="+91 98765 43210"
                                    required
                                />
                            </div>
                        </div>


                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-gradient-to-r from-[#3B82F6] to-[#2DD4BF] hover:from-[#2563EB] hover:to-[#14B8A6] hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#2DD4BF] disabled:opacity-70 disabled:cursor-not-allowed transition-all transform active:scale-[0.98]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="animate-spin -ml-1 mr-2 h-4 w-4" />
                                    Creating account...
                                </>
                            ) : (
                                'Create Account'
                            )}
                        </button>
                    </form>

                    <div className="mt-8">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">Already have an account?</span>
                            </div>
                        </div>
                        <div className="mt-6 text-center">
                            <Link to="/login" className="font-bold text-[#2DD4BF] hover:text-[#14B8A6] transition-colors">
                                Sign in instead
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
