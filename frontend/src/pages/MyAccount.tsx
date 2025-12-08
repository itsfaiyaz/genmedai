import { useState, useEffect, useRef } from 'react';
import { useFrappeAuth, useFrappeGetDocList, useFrappeUpdateDoc } from 'frappe-react-sdk';
import { useNavigate } from 'react-router-dom';
import { LogOut, User, Camera, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';


const MyAccount = () => {
    const { currentUser, logout } = useFrappeAuth();
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('settings');
    const [isEditing, setIsEditing] = useState(false);

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

    if (!currentUser) {
        return (
            <div className="flex items-center justify-center min-h-[50vh]">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Please Log In</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your account.</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-brand-blue text-white hover:bg-brand-blue/90 px-4 py-2 rounded-md"
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
                                                className="text-sm font-medium text-brand-blue hover:underline"
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
                                            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-blue text-white hover:bg-brand-blue/90 h-10 px-4 py-2"
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
                                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-brand-blue text-white hover:bg-brand-blue/90 h-10 px-4 py-2"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};


export default MyAccount;
