import { useFrappeAuth, useFrappeGetDoc, useFrappePostCall } from 'frappe-react-sdk';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Menu, X, ChevronDown, LayoutDashboard, Settings, Pill, User, Search } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { ModeToggle } from './mode-toggle';

const Navbar = () => {
    const { currentUser, logout, isLoading } = useFrappeAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const searchInputRef = useRef<HTMLInputElement>(null);



    // Fetch current user doc to get roles (logic from Footer)
    const { data: userDoc, mutate: mutateUserDoc } = useFrappeGetDoc('User', currentUser || undefined, {
        enabled: !!currentUser && currentUser !== 'Guest'
    });

    const { data: portalSettings } = useFrappeGetDoc('Portal Settings', 'Portal Settings', {
        enabled: !!currentUser && currentUser !== 'Guest'
    });

    useEffect(() => {
        if (currentUser && currentUser !== 'Guest') {
            mutateUserDoc();
        }
    }, [currentUser]);

    // Focus search input when opened
    useEffect(() => {
        if (isSearchOpen && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isSearchOpen]);

    // Check Desk Access via API
    const { call: checkDeskAccess, result: deskAccessResult } = useFrappePostCall('genmedai.api.has_desk_access');

    useEffect(() => {
        if (currentUser && currentUser !== 'Guest') {
            checkDeskAccess({});
        }
    }, [currentUser]);

    const hasDeskAccess = !!deskAccessResult?.message?.allowed;

    const userProfile = userDoc;

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
            setIsSearchOpen(false);
            setSearchQuery('');
            setIsMenuOpen(false); // Close mobile menu if open
        }
    };

    const isLoggedIn = currentUser && currentUser !== 'Guest';
    const displayName = userProfile?.full_name || currentUser || 'User';
    const displayImage = userProfile?.user_image;

    const getUserInitials = () => {
        if (userProfile?.full_name) {
            return userProfile.full_name.charAt(0).toUpperCase();
        }
        return (currentUser || 'U').charAt(0).toUpperCase();
    };

    const defaultNavItems = [
        { name: 'Home', path: '/' },
        { name: 'Medicines', path: '/medicines' },
        { name: 'Search', path: '/search' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
    ];

    const getNavItems = () => {
        if (!portalSettings || !isLoggedIn) return defaultNavItems;

        let items: { name: string; path: string }[] = [];
        // If hide_standard_menu is false (0) or undefined, include default items
        if (!portalSettings.hide_standard_menu) {
            items = [...defaultNavItems];
        }

        if (portalSettings.menu) {
            const userRoles = userDoc?.roles?.map((r: any) => r.role) || [];
            // Always include Guest role checks if needed, but here we assume logged in users have their roles

            const dynamicItems = portalSettings.menu.filter((item: any) => {
                if (!item.enabled) return false;
                // If no role specified, show to everyone? Or if role matches.
                if (!item.role) return true;
                return userRoles.includes(item.role);
            }).map((item: any) => ({
                name: item.title,
                path: item.route
            }));

            // Avoid duplicates if any
            const existingPaths = new Set(items.map(i => i.path));
            dynamicItems.forEach((item: any) => {
                if (!existingPaths.has(item.path)) {
                    items.push(item);
                    existingPaths.add(item.path);
                }
            });
        }

        return items.length > 0 ? items : defaultNavItems;
    };

    const navItems = getNavItems();

    return (
        <nav className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 sticky top-0 z-50 shadow-sm transition-all duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20">
                    {/* Logo Section */}
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center gap-2 group">
                            <div className="w-10 h-10 rounded-full flex items-center justify-center text-brand-teal dark:text-brand-teal bg-white dark:bg-gray-800">
                                <Pill className="w-8 h-8 fill-current" />
                            </div>
                            <div className="flex flex-col justify-center">
                                <span className="font-extrabold text-2xl text-brand-navy dark:text-white tracking-tight leading-none">
                                    GenMed<span className="text-brand-teal">AI</span>
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex md:items-center md:space-x-8">
                        {/* Nav Items */}
                        <div className="flex items-center space-x-6">
                            {navItems.map((item) => {
                                const isActive = location.pathname === item.path;
                                return (
                                    <Link
                                        key={item.name}
                                        to={item.path}
                                        className={`text-[15px] font-semibold transition-colors duration-200 ${isActive
                                            ? 'text-brand-teal'
                                            : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                                            }`}
                                    >
                                        {item.name}
                                    </Link>
                                );
                            })}
                        </div>

                        {/* Search / CTA Button */}
                        <div className="relative">
                            {isSearchOpen ? (
                                <form onSubmit={handleSearch} className="relative w-64 animate-in fade-in slide-in-from-right-5 duration-200">
                                    <input
                                        ref={searchInputRef}
                                        type="text"
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        placeholder="Search medicine..."
                                        className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-800 border-2 border-brand-teal rounded-full text-sm outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all font-medium"
                                        onBlur={() => !searchQuery && setIsSearchOpen(false)}
                                    />
                                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                                    <button
                                        type="button"
                                        onClick={() => setIsSearchOpen(false)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                    >
                                        <X className="w-3 h-3 text-gray-500" />
                                    </button>
                                </form>
                            ) : (
                                <button
                                    onClick={() => setIsSearchOpen(true)}
                                    className="bg-brand-gradient hover:opacity-90 text-white px-6 py-2.5 rounded-full text-sm font-bold shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                                >
                                    <Search className="w-4 h-4" />
                                    Check Medicine Substitute
                                </button>
                            )}
                        </div>

                        <div className="pl-2 border-l border-gray-200 dark:border-gray-700 ml-2">
                            <ModeToggle />
                        </div>

                        {/* User Profile / Auth */}
                        {isLoggedIn ? (
                            <div className="relative pl-2">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 focus:outline-none group"
                                >
                                    {displayImage ? (
                                        <img
                                            src={displayImage}
                                            alt={displayName}
                                            className="w-10 h-10 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700 group-hover:border-brand-teal transition-colors"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-semibold border border-gray-200 dark:border-gray-700 group-hover:border-brand-teal transition-colors">
                                            {getUserInitials()}
                                        </div>
                                    )}
                                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-xl py-2 z-50 border border-gray-100 dark:border-gray-700 animate-in fade-in slide-in-from-top-2">
                                        <div className="px-4 py-3 border-b border-gray-100 dark:border-gray-700 mb-1">
                                            <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{displayName}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentUser}</p>
                                        </div>

                                        <Link
                                            to="/my-account"
                                            className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <Settings className="w-4 h-4 text-gray-400" />
                                            My Account
                                        </Link>

                                        {hasDeskAccess && (
                                            <a
                                                href="/app"
                                                className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                                            >
                                                <LayoutDashboard className="w-4 h-4 text-gray-400" />
                                                Go to Desk
                                            </a>
                                        )}

                                        <div className="border-t border-gray-100 dark:border-gray-700 mt-1 pt-1">
                                            <button
                                                onClick={handleLogout}
                                                disabled={isLoading}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors text-left"
                                            >
                                                <LogOut className="w-4 h-4" />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="pl-2">
                                <Link
                                    to="/login"
                                    className="p-2 text-gray-500 hover:text-brand-teal transition-colors"
                                    title="Sign In"
                                >
                                    <User className="w-6 h-6" />
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button */}
                    <div className="flex items-center gap-4 md:hidden">
                        <ModeToggle />
                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:outline-none"
                        >
                            {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-100 dark:border-gray-800 shadow-xl">
                    <div className="pt-2 pb-3 space-y-1 px-4">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={`block px-3 py-3 rounded-lg text-base font-semibold ${isActive
                                        ? 'bg-gray-50 dark:bg-gray-800 text-brand-teal'
                                        : 'text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800'
                                        }`}
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item.name}
                                </Link>
                            );
                        })}
                        <div className="pt-4">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Check medicine substitute..."
                                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border-2 border-brand-teal rounded-xl text-base outline-none focus:ring-2 focus:ring-brand-teal/20 transition-all font-medium"
                                />
                                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                                <button type="submit" className="hidden" /> {/* Enable Enter key submission */}
                            </form>
                        </div>
                    </div>

                    <div className="pt-4 pb-4 border-t border-gray-100 dark:border-gray-800 px-4">
                        {isLoggedIn ? (
                            <div className="space-y-4">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        {displayImage ? (
                                            <img
                                                src={displayImage}
                                                alt={displayName}
                                                className="h-10 w-10 rounded-full object-cover"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-300 font-bold border border-gray-200 dark:border-gray-700">
                                                {getUserInitials()}
                                            </div>
                                        )}
                                    </div>
                                    <div className="ml-3">
                                        <div className="text-base font-medium text-gray-900 dark:text-white">{displayName}</div>
                                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{currentUser}</div>
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <Link
                                        to="/my-account"
                                        className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <Settings className="w-5 h-5" />
                                        My Account
                                    </Link>

                                    {hasDeskAccess && (
                                        <a
                                            href="/app"
                                            className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
                                        >
                                            <LayoutDashboard className="w-5 h-5" />
                                            Go to Desk
                                        </a>
                                    )}

                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Logout
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <Link
                                to="/login"
                                className="block w-full text-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-base font-bold text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                                onClick={() => setIsMenuOpen(false)}
                            >
                                Sign In
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
