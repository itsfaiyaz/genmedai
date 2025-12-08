import { CheckCircle, Phone } from 'lucide-react';

interface ProfileCardProps {
    name: string;
    age: number;
    location: string;
    profession: string;
    imageUrl: string;
    description: string;
    tags: string[];
    isVerified?: boolean;
    isSelected?: boolean;
    onSelect?: () => void;
    onView?: () => void;
    mobileNumber?: string;
    isMobilePublic?: boolean;
    showCompare?: boolean;
}

const ProfileCard = ({
    name,
    age,
    location,
    profession,
    imageUrl,
    description,
    tags,
    isVerified = true,
    isSelected = false,
    onSelect,
    onView,
    mobileNumber,
    isMobilePublic = false,
    showCompare = true
}: ProfileCardProps) => {
    return (
        <div
            onClick={onView}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 group cursor-pointer ${isSelected ? 'ring-2 ring-[#E91E63]' : ''}`}
        >
            <div className="relative h-64 overflow-hidden">
                <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-90" />

                {isVerified && (
                    <div className="absolute top-4 right-4 bg-white px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                        <CheckCircle className="w-4 h-4 text-[#E91E63]" />
                        <span className="text-xs font-bold text-[#E91E63]">Verified</span>
                    </div>
                )}

                <div className="absolute bottom-4 left-4 text-white">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        {name}, {age}
                    </h3>
                    <div className="flex items-center gap-1 text-white/90 text-sm mt-1">
                        <svg className="w-3 h-3 fill-current" viewBox="0 0 24 24">
                            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
                        </svg>
                        {location}
                    </div>
                    <div className="mt-2 inline-block bg-white/20 backdrop-blur-md border border-white/30 px-2 py-0.5 rounded text-xs font-medium">
                        {profession}
                    </div>
                </div>
            </div>

            <div className="p-5">
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed line-clamp-2 mb-4">
                    {description}
                </p>

                {isMobilePublic && mobileNumber && (
                    <div className="flex items-center gap-2 mb-4 text-[#E91E63] font-medium text-sm bg-pink-50 dark:bg-pink-900/10 px-3 py-2 rounded-lg border border-pink-100 dark:border-pink-900/30">
                        <Phone className="w-4 h-4" />
                        <span>{mobileNumber}</span>
                    </div>
                )}

                <div className="flex flex-wrap gap-2 mb-6">
                    {tags.map((tag, index) => (
                        <span
                            key={index}
                            className={`text-xs px-2 py-1 rounded-md font-medium ${index % 3 === 0 ? 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-300' :
                                index % 3 === 1 ? 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-300' :
                                    'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-300'
                                }`}
                        >
                            {tag}
                        </span>
                    ))}
                </div>

                <div className="flex gap-3">
                    {showCompare && (
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelect?.();
                            }}
                            className={`flex-1 py-2 px-4 border rounded-lg text-sm font-semibold transition-colors ${isSelected
                                ? 'bg-red-50 border-red-100 text-[#E91E63] dark:bg-red-900/20 dark:border-red-800 dark:text-red-300'
                                : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            {isSelected ? 'Selected' : 'Compare'}
                        </button>
                    )}
                    <button
                        onClick={onView}
                        className="flex-1 py-2 px-4 bg-[#E91E63] hover:bg-[#D81B60] text-white rounded-lg text-sm font-bold shadow-md hover:shadow-lg transition-all"
                    >
                        Connect
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProfileCard;
