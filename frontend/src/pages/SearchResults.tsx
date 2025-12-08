import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useFrappeGetDocList } from 'frappe-react-sdk';
import { Search, Frown } from 'lucide-react';
import ProfileCard from '../components/ProfileCard';
import ViewProfileDialog from '../components/ViewProfileDialog';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('q') || '';
    const [viewProfileId, setViewProfileId] = useState<string | null>(null);

    // Fetch all profiles to filter client-side for better multi-field search
    // In a real app with many records, you'd want a backend search API
    const { data: profiles, isLoading } = useFrappeGetDocList('ProfileCard', {
        fields: ['name', 'full_name', 'age', 'gender', 'profession', 'location', 'profile_image', 'about_me', 'interests', 'status', 'mobile_number', 'is_mobile_public'],
        filters: [['status', '=', 'Verified']]
    });

    // Static Pages Data
    const staticPages = [
        { title: 'Home', path: '/', description: 'Welcome to GenMedAI - The Community Platform', content: 'matrimony profiles match finding' },
        { title: 'Business Directory', path: '/business', description: 'Find businesses and services in the community', content: 'shops services professionals' },
        { title: 'Classifieds', path: '/classifieds', description: 'Buy, sell, and rent items or properties', content: 'ads jobs rent sell buy' },
        { title: 'Social Corner', path: '/social', description: 'Community events and news', content: 'events gatherings news' },
        { title: 'About Us', path: '/about', description: 'Learn more about GenMedAI', content: 'mission vision team history' },
        { title: 'Contact Us', path: '/contact', description: 'Get in touch with us', content: 'support email phone address' },
    ];

    // Filter profiles based on query
    const filteredProfiles = profiles?.filter(profile => {
        const searchTerms = query.toLowerCase().split(' ');
        const searchableText = `
            ${profile.full_name} 
            ${profile.profession} 
            ${profile.location} 
            ${profile.about_me || ''} 
            ${profile.interests || ''}
        `.toLowerCase();

        return searchTerms.every(term => searchableText.includes(term));
    }) || [];

    // Filter pages based on query
    const filteredPages = staticPages.filter(page => {
        const searchTerms = query.toLowerCase().split(' ');
        const searchableText = `${page.title} ${page.description} ${page.content}`.toLowerCase();
        return searchTerms.every(term => searchableText.includes(term));
    });

    const hasResults = filteredProfiles.length > 0 || filteredPages.length > 0;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-12 transition-colors duration-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <Search className="w-8 h-8 text-[#E91E63]" />
                        Search Results
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                        Showing results for <span className="font-semibold text-gray-900 dark:text-white">"{query}"</span>
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E91E63]"></div>
                    </div>
                ) : hasResults ? (
                    <div className="space-y-12">
                        {/* Pages Section */}
                        {filteredPages.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">Pages</span>
                                    Found {filteredPages.length} matching pages
                                </h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredPages.map((page) => (
                                        <Link
                                            key={page.path}
                                            to={page.path}
                                            className="block p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all border border-gray-100 dark:border-gray-700 hover:border-blue-200 dark:hover:border-blue-800 group"
                                        >
                                            <h3 className="text-lg font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {page.title}
                                            </h3>
                                            <p className="text-gray-600 dark:text-gray-400 mt-2 text-sm">
                                                {page.description}
                                            </p>
                                        </Link>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* Profiles Section */}
                        {filteredProfiles.length > 0 && (
                            <section>
                                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <span className="bg-pink-100 text-pink-800 text-xs font-medium px-2.5 py-0.5 rounded dark:bg-pink-900 dark:text-pink-300">Profiles</span>
                                    Found {filteredProfiles.length} matching profiles
                                </h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {filteredProfiles.map((profile) => (
                                        <ProfileCard
                                            key={profile.name}
                                            name={profile.full_name}
                                            age={profile.age}
                                            location={profile.location}
                                            profession={profile.profession}
                                            imageUrl={profile.profile_image}
                                            description={profile.about_me || "No description provided."}
                                            tags={profile.interests ? profile.interests.split(',') : []}
                                            isVerified={profile.status === 'Verified'}
                                            mobileNumber={profile.mobile_number}
                                            isMobilePublic={!!profile.is_mobile_public}
                                            onView={() => setViewProfileId(profile.name)}
                                            showCompare={false}
                                        />
                                    ))}
                                </div>
                            </section>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <div className="bg-gray-100 dark:bg-gray-800 p-6 rounded-full mb-6">
                            <Frown className="w-16 h-16 text-gray-400" />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No matches found</h2>
                        <p className="text-gray-500 dark:text-gray-400 max-w-md">
                            We couldn't find any profiles or pages matching "{query}". Try checking for typos or using different keywords.
                        </p>
                    </div>
                )}
            </div>

            <ViewProfileDialog
                isOpen={!!viewProfileId}
                onClose={() => setViewProfileId(null)}
                profileId={viewProfileId}
            />
        </div>
    );
};

export default SearchResults;
