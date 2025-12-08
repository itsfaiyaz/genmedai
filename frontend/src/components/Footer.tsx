import { Pill, Heart, Facebook, Twitter, Instagram, Linkedin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFrappeAuth, useFrappeGetDoc, useFrappeGetDocList } from 'frappe-react-sdk';
import { useEffect } from 'react';

const Footer = () => {
    const { currentUser } = useFrappeAuth();
    const isLoggedIn = currentUser && currentUser !== 'Guest';

    // Fetch current user to get their assigned roles
    const { data: userDoc, mutate: mutateUserDoc } = useFrappeGetDoc('User', currentUser || undefined, {
        enabled: !!currentUser && currentUser !== 'Guest'
    });

    useEffect(() => {
        if (currentUser && currentUser !== 'Guest') {
            mutateUserDoc();
        }
    }, [currentUser]);

    // Fetch all roles that have Desk Access
    const { data: deskRoles } = useFrappeGetDocList('Role', {
        fields: ['name'],
        filters: [['desk_access', '=', 1]],
        limit: 1000
    });

    // Check if the user has any role that grants Desk Access
    const hasDeskAccess = userDoc?.roles?.some((userRole: any) =>
        deskRoles?.some(deskRole => deskRole.name === userRole.role)
    ) || false;

    return (
        <footer className="bg-gray-900 text-white pt-16 pb-8 border-t border-gray-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-2">
                            <div className="w-10 h-10 bg-brand-teal rounded-full flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                <Pill className="w-6 h-6 fill-current" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-white">GenMed<span className="text-brand-teal">AI</span></span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Smarter. Cheaper. Safer. Your AI guide to affordable medicines. We help you find exact substitutes and save money on healthcare.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Quick Links</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <Link to="/" className="hover:text-brand-teal transition-colors">Home</Link>
                            </li>
                            <li>
                                <Link to="/how-it-works" className="hover:text-brand-teal transition-colors">How It Works</Link>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-brand-teal transition-colors">About Us</Link>
                            </li>
                            <li>
                                <Link to="/faqs" className="hover:text-brand-teal transition-colors">FAQs</Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal & Account */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Account & Legal</h3>
                        <ul className="space-y-4 text-sm text-gray-400">
                            <li>
                                <Link to="/privacy-policy" className="hover:text-brand-teal transition-colors">Privacy Policy</Link>
                            </li>
                            <li>
                                <Link to="/terms" className="hover:text-brand-teal transition-colors">Terms of Service</Link>
                            </li>

                            <li>
                                {isLoggedIn ? (
                                    <div className="flex flex-col gap-2">
                                        <Link to="/my-account" className="font-bold text-white hover:text-brand-teal">My Account</Link>
                                        {hasDeskAccess && (
                                            <a href="/app" className="font-bold text-white hover:text-brand-teal">Go to Desk</a>
                                        )}
                                    </div>
                                ) : (
                                    <Link to="/login" className="hover:text-brand-teal transition-colors">Login / Sign Up</Link>
                                )}
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-lg font-bold mb-6 text-white">Get in Touch</h3>
                        <div className="space-y-4 text-sm text-gray-400">
                            <div className="flex items-center gap-3">
                                <Mail className="w-4 h-4 text-brand-teal" />
                                <span>support@genmedai.com</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <Phone className="w-4 h-4 text-brand-teal" />
                                <span>+91 1800-GEN-MED</span>
                            </div>

                            <div className="flex space-x-4 pt-4">
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all duration-300">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all duration-300">
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all duration-300">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="#" className="w-10 h-10 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-teal hover:text-white transition-all duration-300">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-gray-500">
                        &copy; {new Date().getFullYear()} GenMedAI. All rights reserved. Not a substitute for professional medical advice.
                    </p>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                        Made with <Heart className="h-4 w-4 text-red-500 fill-current" /> for a healthier India.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
