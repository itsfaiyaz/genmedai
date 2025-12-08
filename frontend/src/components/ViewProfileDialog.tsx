import { X, MapPin, Briefcase, User, Phone, Heart, Info, Edit } from 'lucide-react';
import { useFrappeGetDoc, useFrappeAuth } from 'frappe-react-sdk';

interface ViewProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    profileId: string | null;
    onEdit?: () => void;
}

const ViewProfileDialog = ({ isOpen, onClose, profileId, onEdit }: ViewProfileDialogProps) => {
    const { currentUser } = useFrappeAuth();
    const { data: profile, isLoading, error } = useFrappeGetDoc('ProfileCard', profileId || undefined, {
        enabled: !!profileId && isOpen
    });

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200 relative">

                {/* Header Actions */}
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    {profile && currentUser && profile.owner === currentUser && onEdit && (
                        <button
                            onClick={() => {
                                onClose();
                                onEdit();
                            }}
                            className="p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-gray-800 dark:text-white transition-colors"
                            title="Edit Profile"
                        >
                            <Edit className="w-5 h-5" />
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-2 bg-black/10 hover:bg-black/20 dark:bg-white/10 dark:hover:bg-white/20 rounded-full text-gray-800 dark:text-white transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E91E63]"></div>
                        <p className="mt-4 text-gray-500">Loading profile details...</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center h-64 text-center p-6">
                        <div className="bg-red-100 text-red-600 p-4 rounded-full mb-4">
                            <X className="w-8 h-8" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">Error Loading Profile</h3>
                        <p className="text-gray-500 mt-2">Could not fetch profile details. Please try again.</p>
                        <button onClick={onClose} className="mt-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-800 font-medium">
                            Close
                        </button>
                    </div>
                ) : profile ? (
                    <div>
                        {/* Header / Cover Image area */}
                        <div className="h-32 bg-gradient-to-r from-[#E91E63] to-[#FF9800] relative"></div>

                        <div className="px-6 pb-8">
                            <div className="flex flex-col sm:flex-row items-start gap-6 -mt-12">
                                {/* Profile Image */}
                                <div className="relative">
                                    <div className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden bg-white shadow-md">
                                        {profile.profile_image ? (
                                            <img src={profile.profile_image} alt={profile.full_name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full flex items-center justify-center bg-gray-100 text-gray-400">
                                                <User className="w-12 h-12" />
                                            </div>
                                        )}
                                    </div>
                                    <span className={`absolute bottom-2 right-2 px-2 py-0.5 text-xs font-bold rounded-full border border-white dark:border-gray-900 ${profile.status === 'Verified'
                                        ? 'bg-green-500 text-white'
                                        : 'bg-yellow-500 text-white'
                                        }`}>
                                        {profile.status}
                                    </span>
                                </div>

                                {/* Basic Info */}
                                <div className="flex-1 pt-2 sm:pt-14 space-y-1">
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{profile.full_name}</h2>
                                    <div className="flex flex-wrap gap-x-4 gap-y-2 text-sm text-gray-600 dark:text-gray-300">
                                        <div className="flex items-center gap-1">
                                            <Briefcase className="w-4 h-4" />
                                            <span>{profile.profession}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <MapPin className="w-4 h-4" />
                                            <span>{profile.location}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <User className="w-4 h-4" />
                                            <span>{profile.age} yrs, {profile.gender}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                                {/* About Section */}
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                            <Info className="w-5 h-5 text-[#E91E63]" />
                                            About
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                                            {profile.about_me || "No description provided."}
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-3">
                                            <Heart className="w-5 h-5 text-[#E91E63]" />
                                            Interests
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.interests ? (
                                                profile.interests.split(',').map((interest: string, idx: number) => (
                                                    <span key={idx} className="px-3 py-1 bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-300 rounded-full text-sm font-medium">
                                                        {interest.trim()}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-gray-500 italic">No interests listed</span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Contact & Details */}
                                <div className="space-y-6">
                                    <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-5 space-y-4">
                                        <h3 className="font-bold text-gray-900 dark:text-white">Contact Information</h3>

                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-[#E91E63]">
                                                <Phone className="w-4 h-4" />
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase font-semibold">Mobile Number</p>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    {profile.is_mobile_public ? profile.mobile_number : "Private / Hidden"}
                                                </p>
                                            </div>
                                        </div>

                                        {profile.relation && (
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-[#E91E63]">
                                                    <User className="w-4 h-4" />
                                                </div>
                                                <div>
                                                    <p className="text-xs text-gray-500 uppercase font-semibold">Profile Created By</p>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {profile.relation}
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default ViewProfileDialog;
