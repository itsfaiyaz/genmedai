import { useState, useEffect, useRef } from 'react';
import { useFrappeAuth, useFrappeGetDocList, useFrappeUpdateDoc } from 'frappe-react-sdk';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Heart, Plus, Edit, Search, Filter, Eye, Camera, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import CreateProfileDialog from '../components/CreateProfileDialog';
import ViewProfileDialog from '../components/ViewProfileDialog';
import EditProfileDialog from '../components/EditProfileDialog';

const MyAccount = () => {
    const { currentUser, logout } = useFrappeAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('profiles');
    const [isEditing, setIsEditing] = useState(false);

    // Dialog States
    const [isCreateProfileOpen, setIsCreateProfileOpen] = useState(false);
    const [viewProfileId, setViewProfileId] = useState<string | null>(null);
    const [editProfileId, setEditProfileId] = useState<string | null>(null);

    // Search & Filter States
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('All');

    // Form States
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        mobileNo: '',
        location: '',
        birthDate: '',
        gender: '',
        username: '',
        userImage: '',
        newPassword: ''
    });
    const [isUploading, setIsUploading] = useState(false);
    const [updateError, setUpdateError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch User details
    const { data: userDetails, mutate: mutateUser } = useFrappeGetDocList('User', {
        filters: [['name', '=', currentUser || '']],
        fields: ['name', 'first_name', 'last_name', 'full_name', 'email', 'mobile_no', 'user_image', 'location', 'birth_date', 'gender', 'username']
    });

    const user = userDetails?.[0];

    const { updateDoc, loading: isUpdating } = useFrappeUpdateDoc();

    useEffect(() => {
        if (user) {
            setFormData({
                firstName: user.first_name || '',
                lastName: user.last_name || '',
                mobileNo: user.mobile_no || '',
                location: user.location || '',
                birthDate: user.birth_date || '',
                gender: user.gender || '',
                username: user.username || '',
                userImage: user.user_image || '',
                newPassword: ''
            });
        }
    }, [user]);

    // Fetch My Profiles (Matrimony Profiles)
    const { data: myProfiles, isLoading: profilesLoading, mutate: mutateProfiles } = useFrappeGetDocList('ProfileCard', {
        filters: [['owner', '=', currentUser || '']],
        fields: ['name', 'full_name', 'age', 'gender', 'profession', 'location', 'profile_image', 'status']
    });

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({ ...prev, [id]: value }));
        // Clear errors when user types
        if (updateError) setUpdateError(null);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('is_private', '0');

        try {
            const response = await fetch('/api/method/upload_file', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();
            if (data.message) {
                setFormData(prev => ({ ...prev, userImage: data.message.file_url }));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setIsUploading(false);
        }
    };

    const handleUpdateProfile = async () => {
        if (!user) return;
        setUpdateError(null);
        setUpdateSuccess(null);

        try {
            const updateData: any = {
                mobile_no: formData.mobileNo,
                location: formData.location,
                birth_date: formData.birthDate,
                gender: formData.gender,
                username: formData.username,
                user_image: formData.userImage
            };

            if (formData.newPassword) {
                updateData.new_password = formData.newPassword;
            }

            await updateDoc('User', user.name, updateData);
            await mutateUser();
            setIsEditing(false);
            setFormData(prev => ({ ...prev, newPassword: '' })); // Clear password field
            setUpdateSuccess("Profile updated successfully.");

            // Clear success message after 3 seconds
            setTimeout(() => setUpdateSuccess(null), 3000);

        } catch (error: any) {
            console.error("Error updating profile:", error);
            let errorMessage = "An error occurred while updating your profile.";

            if (error?._server_messages) {
                try {
                    const messages = JSON.parse(error._server_messages);
                    if (Array.isArray(messages) && messages.length > 0) {
                        const firstMsg = JSON.parse(messages[0]);
                        errorMessage = firstMsg.message || errorMessage;
                    }
                } catch (e) {
                    // ignore parse error
                }
            } else if (error?.exception) {
                // Remove "frappe.exceptions.ValidationError: " prefix if present
                const parts = error.exception.split(':');
                if (parts.length > 1) {
                    errorMessage = parts.slice(1).join(':').trim();
                } else {
                    errorMessage = error.exception;
                }
            } else if (error?.message) {
                errorMessage = error.message;
            }

            setUpdateError(errorMessage);
        }
    };

    const handleProfileCreated = () => {
        mutateProfiles();
        setIsCreateProfileOpen(false);
    };

    const handleProfileUpdated = () => {
        mutateProfiles();
        setEditProfileId(null);
    };

    // Profile Tab State
    const [profileTab, setProfileTab] = useState<'Verified' | 'Unverified'>('Verified');

    // Filter Logic
    const filteredProfiles = myProfiles?.filter(profile => {
        const matchesSearch = profile.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile.profession?.toLowerCase().includes(searchQuery.toLowerCase()) ||
            profile.location?.toLowerCase().includes(searchQuery.toLowerCase());

        // Filter by Tab
        const matchesTab = profileTab === 'Verified'
            ? profile.status === 'Verified'
            : profile.status !== 'Verified'; // Show all non-verified in Unverified tab

        return matchesSearch && matchesTab;
    });

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your account.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 rounded-md"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto py-10 px-4 md:px-8">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar / User Info Card */}
                <div className="w-full md:w-1/4 space-y-6">
                    <div className="bg-card text-card-foreground rounded-xl border shadow-sm">
                        <div className="p-6 text-center">
                            <div className="mx-auto mb-4 relative h-24 w-24 rounded-full overflow-hidden bg-muted group">
                                {formData.userImage ? (
                                    <img src={formData.userImage} alt={user?.full_name} className="h-full w-full object-cover" />
                                ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-gray-200 text-2xl font-bold text-gray-500">
                                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                                    </div>
                                )}
                            </div>
                            <h3 className="text-2xl font-semibold leading-none tracking-tight">{user?.full_name}</h3>
                            <p className="text-sm text-muted-foreground mt-2">{user?.email}</p>
                        </div>
                        <div className="p-6 pt-0 space-y-2">
                            <button
                                className={`w-full flex items-center justify-start px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'settings' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                                onClick={() => setActiveTab('settings')}
                            >
                                <User className="mr-2 h-4 w-4" /> Account Settings
                            </button>
                            <button
                                className={`w-full flex items-center justify-start px-4 py-2 rounded-md text-sm font-medium transition-colors ${activeTab === 'profiles' ? 'bg-accent text-accent-foreground' : 'hover:bg-accent hover:text-accent-foreground'}`}
                                onClick={() => setActiveTab('profiles')}
                            >
                                <Heart className="mr-2 h-4 w-4" /> My Profiles
                            </button>
                            <button
                                className="w-full flex items-center justify-start px-4 py-2 rounded-md text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 transition-colors"
                                onClick={handleLogout}
                            >
                                <LogOut className="mr-2 h-4 w-4" /> Logout
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="w-full md:w-3/4">
                    {/* Tabs Header */}
                    <div className="mb-8 border-b">
                        <div className="flex space-x-8">
                            <button
                                onClick={() => setActiveTab('profiles')}
                                className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'profiles'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                My Matrimony Profiles
                            </button>
                            <button
                                onClick={() => setActiveTab('settings')}
                                className={`pb-2 text-sm font-medium transition-colors border-b-2 ${activeTab === 'settings'
                                    ? 'border-primary text-primary'
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                    }`}
                            >
                                Account Settings
                            </button>
                        </div>
                    </div>

                    {/* My Profiles Tab */}
                    {activeTab === 'profiles' && (
                        <div className="space-y-6">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <h2 className="text-2xl font-bold tracking-tight">Managed Profiles</h2>
                                <button
                                    onClick={() => setIsCreateProfileOpen(true)}
                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                >
                                    <Plus className="mr-2 h-4 w-4" /> Create New Profile
                                </button>
                            </div>

                            {/* Profile Status Tabs */}
                            <div className="flex p-1 bg-gray-100 dark:bg-gray-800/50 rounded-xl border border-gray-200 dark:border-gray-700 w-fit">
                                <button
                                    onClick={() => setProfileTab('Verified')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${profileTab === 'Verified'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    Verified
                                </button>
                                <button
                                    onClick={() => setProfileTab('Unverified')}
                                    className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-200 ${profileTab === 'Unverified'
                                        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                        }`}
                                >
                                    Unverified
                                </button>
                            </div>

                            {/* Search Bar */}
                            <div className="flex flex-col sm:flex-row gap-4 bg-muted/30 p-4 rounded-lg border">
                                <div className="relative flex-1">
                                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                    <input
                                        type="text"
                                        placeholder="Search profiles by name, profession..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="w-full pl-9 pr-4 py-2 rounded-md border border-input bg-background text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                                    />
                                </div>
                            </div>

                            {profilesLoading ? (
                                <div className="flex justify-center py-12">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                                </div>
                            ) : filteredProfiles?.length === 0 ? (
                                <div className="rounded-xl border bg-card text-card-foreground shadow-sm text-center py-12">
                                    <div className="p-6">
                                        {searchQuery ? (
                                            <>
                                                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-semibold mb-2">No Matches Found</h3>
                                                <p className="text-muted-foreground mb-6">Try adjusting your search.</p>
                                                <button
                                                    onClick={() => setSearchQuery('')}
                                                    className="text-primary hover:underline"
                                                >
                                                    Clear Search
                                                </button>
                                            </>
                                        ) : (
                                            <>
                                                <Heart className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                                <h3 className="text-lg font-semibold mb-2">No {profileTab} Profiles</h3>
                                                <p className="text-muted-foreground mb-6">
                                                    {profileTab === 'Verified'
                                                        ? "You don't have any verified profiles yet."
                                                        : "You don't have any unverified profiles."}
                                                </p>
                                                {profileTab === 'Unverified' && (
                                                    <button
                                                        onClick={() => setIsCreateProfileOpen(true)}
                                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                                    >
                                                        Create Your First Profile
                                                    </button>
                                                )}
                                            </>
                                        )}
                                    </div>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {filteredProfiles?.map((profile) => (
                                        <div key={profile.name} className="rounded-xl border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                                            <div className="flex p-4 gap-4">
                                                <div className="h-16 w-16 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                    {profile.profile_image ? (
                                                        <img src={profile.profile_image} alt={profile.full_name} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center bg-gray-200 text-gray-500 font-bold">
                                                            {profile.full_name[0]}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h3 className="font-semibold text-lg truncate">{profile.full_name}</h3>
                                                            <p className="text-sm text-muted-foreground">{profile.profession}, {profile.age} yrs</p>
                                                            <p className="text-xs text-muted-foreground mt-1">{profile.location}</p>
                                                        </div>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium whitespace-nowrap ml-2 ${profile.status === 'Verified' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                                            }`}>
                                                            {profile.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="bg-muted/50 p-3 flex justify-end gap-2">
                                                <button
                                                    onClick={() => setViewProfileId(profile.name)}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                                >
                                                    <Eye className="h-4 w-4 mr-1" /> View
                                                </button>
                                                <button
                                                    onClick={() => setEditProfileId(profile.name)}
                                                    className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-9 px-3"
                                                >
                                                    <Edit className="h-4 w-4 mr-1" /> Edit
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings Tab */}
                    {activeTab === 'settings' && (
                        <div className="rounded-xl border bg-card text-card-foreground shadow-sm">
                            <div className="flex flex-col space-y-1.5 p-6">
                                <h3 className="text-2xl font-semibold leading-none tracking-tight">Profile Settings</h3>
                                <p className="text-sm text-muted-foreground">Update your personal account information.</p>
                            </div>
                            <div className="p-6 pt-0 space-y-6">
                                {/* Alerts */}
                                {updateError && (
                                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                        <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-sm">Update Failed</h4>
                                            <p className="text-sm opacity-90">{updateError}</p>
                                        </div>
                                    </div>
                                )}
                                {updateSuccess && (
                                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                                        <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5" />
                                        <div>
                                            <h4 className="font-semibold text-sm">Success</h4>
                                            <p className="text-sm opacity-90">{updateSuccess}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Profile Image Upload */}
                                <div className="flex items-center gap-6">
                                    <div className="relative h-24 w-24 rounded-full overflow-hidden bg-muted border-2 border-dashed border-gray-300">
                                        {formData.userImage ? (
                                            <img src={formData.userImage} alt="Profile" className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="flex h-full w-full items-center justify-center bg-gray-50 text-gray-400">
                                                <User className="h-10 w-10" />
                                            </div>
                                        )}
                                        {isEditing && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                                                {isUploading ? <Loader2 className="w-6 h-6 text-white animate-spin" /> : <Camera className="w-6 h-6 text-white" />}
                                            </div>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <div>
                                            <button
                                                type="button"
                                                onClick={() => fileInputRef.current?.click()}
                                                className="text-sm font-medium text-primary hover:underline"
                                                disabled={isUploading}
                                            >
                                                {isUploading ? 'Uploading...' : 'Change Profile Photo'}
                                            </button>
                                            <p className="text-xs text-muted-foreground mt-1">JPG, PNG or GIF. Max 5MB.</p>
                                            <input
                                                type="file"
                                                ref={fileInputRef}
                                                className="hidden"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                            />
                                        </div>
                                    )}
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label htmlFor="full_name" className="text-sm font-medium leading-none">Full Name</label>
                                        <input
                                            id="full_name"
                                            value={user?.full_name || ''}
                                            disabled
                                            className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-70 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="email" className="text-sm font-medium leading-none">Email</label>
                                        <input
                                            id="email"
                                            value={user?.email || ''}
                                            disabled
                                            className="flex h-10 w-full rounded-md border border-input bg-muted px-3 py-2 text-sm opacity-70 cursor-not-allowed"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="username" className="text-sm font-medium leading-none">Username</label>
                                        <input
                                            id="username"
                                            value={formData.username}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            placeholder="Choose a unique username"
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="mobileNo" className="text-sm font-medium leading-none">Mobile Number</label>
                                        <input
                                            id="mobileNo"
                                            value={formData.mobileNo}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="birthDate" className="text-sm font-medium leading-none">Date of Birth</label>
                                        <input
                                            id="birthDate"
                                            type="date"
                                            value={formData.birthDate}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label htmlFor="gender" className="text-sm font-medium leading-none">Gender</label>
                                        <select
                                            id="gender"
                                            value={formData.gender}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="">Select Gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div className="space-y-2 md:col-span-2">
                                        <label htmlFor="location" className="text-sm font-medium leading-none">Location</label>
                                        <input
                                            id="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            disabled={!isEditing}
                                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        />
                                    </div>
                                </div>

                                {/* Password Change Section */}
                                {isEditing && (
                                    <div className="pt-4 border-t mt-4">
                                        <h4 className="text-sm font-semibold mb-4">Change Password</h4>
                                        <div className="space-y-2">
                                            <label htmlFor="newPassword" className="text-sm font-medium leading-none">New Password</label>
                                            <input
                                                id="newPassword"
                                                type="password"
                                                value={formData.newPassword}
                                                onChange={handleInputChange}
                                                placeholder="Leave blank to keep current password"
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                                            />
                                            <p className="text-xs text-muted-foreground">Only enter a value if you want to change your password.</p>
                                        </div>
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center p-6 pt-0 justify-end gap-4">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={() => setIsEditing(false)}
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleUpdateProfile}
                                            disabled={isUpdating}
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                        >
                                            {isUpdating ? (
                                                <>
                                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                                </>
                                            ) : (
                                                'Save Changes'
                                            )}
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <CreateProfileDialog
                isOpen={isCreateProfileOpen}
                onClose={handleProfileCreated}
                currentUser={currentUser}
            />

            <ViewProfileDialog
                isOpen={!!viewProfileId}
                onClose={() => setViewProfileId(null)}
                profileId={viewProfileId}
                onEdit={() => {
                    setEditProfileId(viewProfileId);
                    setViewProfileId(null);
                }}
            />

            <EditProfileDialog
                isOpen={!!editProfileId}
                onClose={() => setEditProfileId(null)}
                profileId={editProfileId}
                onUpdateSuccess={handleProfileUpdated}
            />
        </div>
    );
};

export default MyAccount;
