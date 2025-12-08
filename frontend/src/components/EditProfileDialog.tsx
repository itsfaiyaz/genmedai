import { useState, useEffect } from 'react';
import { X, Upload, Save, Loader2, CheckCircle, Trash2 } from 'lucide-react';
import { useFrappeGetDoc, useFrappeUpdateDoc, useFrappeDeleteDoc } from 'frappe-react-sdk';

interface EditProfileDialogProps {
    isOpen: boolean;
    onClose: () => void;
    profileId: string | null;
    onUpdateSuccess: () => void;
}

const EditProfileDialog = ({ isOpen, onClose, profileId, onUpdateSuccess }: EditProfileDialogProps) => {
    const { data: profile, isLoading: isProfileLoading } = useFrappeGetDoc('ProfileCard', profileId || undefined, {
        enabled: !!profileId && isOpen
    });

    const { updateDoc, loading: isUpdating } = useFrappeUpdateDoc();
    const { deleteDoc, loading: isDeleting } = useFrappeDeleteDoc();

    const [formData, setFormData] = useState({
        name: '',
        gender: 'Male',
        age: '',
        location: '',
        profession: '',
        mobileNumber: '',
        isMobilePublic: false,
        imageUrl: '',
        description: '',
        tags: '',
        relation: ''
    });

    const [showSuccess, setShowSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState(false);

    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.full_name || '',
                gender: profile.gender || 'Male',
                age: profile.age?.toString() || '',
                location: profile.location || '',
                profession: profile.profession || '',
                mobileNumber: profile.mobile_number || '',
                isMobilePublic: !!profile.is_mobile_public,
                imageUrl: profile.profile_image || '',
                description: profile.about_me || '',
                tags: profile.interests || '',
                relation: profile.relation || ''
            });
            setPreviewUrl(profile.profile_image || null);
        }
    }, [profile]);

    if (!isOpen) return null;

    const uploadFile = async (file: File) => {
        const formData = new FormData();
        formData.append('file', file, file.name);
        formData.append('is_private', '0');
        formData.append('folder', 'Home');

        try {
            const response = await fetch('/api/method/upload_file', {
                method: 'POST',
                headers: {
                    'X-Frappe-CSRF-Token': (window as any).csrf_token || '',
                },
                body: formData,
            });

            const data = await response.json();
            if (data.message) {
                return data.message.file_url;
            }
            throw new Error(data.error || 'File upload failed');
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setFormData(prev => ({ ...prev, imageUrl: '' })); // Clear URL input if file selected
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!profileId) return;

        setIsUploading(true);

        try {
            let finalImageUrl = formData.imageUrl;

            if (selectedFile) {
                finalImageUrl = await uploadFile(selectedFile);
            }

            await updateDoc('ProfileCard', profileId, {
                full_name: formData.name,
                gender: formData.gender,
                age: parseInt(formData.age),
                location: formData.location,
                profession: formData.profession,
                mobile_number: formData.mobileNumber,
                is_mobile_public: formData.isMobilePublic ? 1 : 0,
                profile_image: finalImageUrl,
                about_me: formData.description,
                interests: formData.tags,
                relation: formData.relation || null,
            });

            setShowSuccess(true);
            onUpdateSuccess();
        } catch (error: any) {
            console.error('Error updating profile:', error);
            let errorMessage = 'Failed to update profile. Please try again.';

            if (error) {
                if (error._error_message) {
                    errorMessage = error._error_message;
                } else if (error._server_messages) {
                    try {
                        const messages = JSON.parse(error._server_messages);
                        if (Array.isArray(messages) && messages.length > 0) {
                            const firstMsg = JSON.parse(messages[0]);
                            errorMessage = firstMsg.message || errorMessage;
                        }
                    } catch (e) {
                        console.error('Error parsing server messages:', e);
                    }
                } else if (error.message) {
                    errorMessage = error.message;
                }
            }

            // Strip HTML tags
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = errorMessage;
            const cleanMessage = tempDiv.textContent || tempDiv.innerText || errorMessage;

            setError(cleanMessage);
        } finally {
            setIsUploading(false);
        }
    };

    const handleDelete = () => {
        setShowDeleteConfirm(true);
    };

    const confirmDelete = async () => {
        if (!profileId) return;

        try {
            await deleteDoc('ProfileCard', profileId);
            onUpdateSuccess();
            onClose();
        } catch (error: any) {
            console.error("Error deleting profile:", error);
            let errorMessage = 'Failed to delete profile. Please try again.';
            if (error?.message) errorMessage = error.message;
            setError(errorMessage);
            setShowDeleteConfirm(false);
        }
    };

    const handleCloseSuccess = () => {
        setShowSuccess(false);
        onClose();
    };

    if (showDeleteConfirm) {
        return (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200 border border-white/20 dark:border-gray-700">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                        <Trash2 className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Delete Profile?</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Are you sure you want to delete this profile? This action cannot be undone.
                    </p>
                    <div className="flex gap-4">
                        <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="flex-1 px-4 py-2.5 border border-gray-200 dark:border-gray-700 text-sm font-bold rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={confirmDelete}
                            className="flex-1 px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-all flex items-center justify-center gap-2"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Delete'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200 border border-white/20 dark:border-gray-700">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
                        <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Profile Updated!</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        Your profile changes have been saved successfully.
                    </p>
                    <button
                        onClick={handleCloseSuccess}
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-[#E91E63] hover:bg-[#D81B60] shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#E91E63] transition-all"
                    >
                        Great
                    </button>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md p-8 text-center animate-in zoom-in-95 duration-200 border border-white/20 dark:border-gray-700">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100 dark:bg-red-900/30 mb-6">
                        <X className="h-8 w-8 text-red-600 dark:text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Error</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        {error}
                    </p>
                    <button
                        onClick={() => setError(null)}
                        className="inline-flex items-center justify-center w-full px-4 py-2.5 border border-transparent text-sm font-bold rounded-xl text-white bg-red-600 hover:bg-red-700 shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-600 transition-all"
                    >
                        Close
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-in zoom-in-95 duration-200">
                <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-gray-100 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md">
                    <div>
                        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Profile</h2>
                        {isProfileLoading ? (
                            <p className="text-sm text-gray-500 animate-pulse">Loading profile...</p>
                        ) : (
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Editing details for <span className="font-bold text-[#E91E63]">{profile?.full_name}</span>
                            </p>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        <button
                            onClick={handleDelete}
                            className="p-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                            title="Delete Profile"
                            disabled={isDeleting}
                        >
                            {isDeleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
                        </button>
                        <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">

                    {/* Relationship - Optional if editing own profile, but good to have */}
                    {formData.relation && (
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Relationship to Profile</label>
                            <input
                                type="text"
                                value={formData.relation}
                                onChange={(e) => setFormData({ ...formData, relation: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E91E63] focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Son, Daughter, Brother, Sister"
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Full Name</label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E91E63] focus:border-transparent outline-none transition-all"
                                placeholder="Enter full name"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Gender</label>
                            <select
                                value={formData.gender}
                                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E91E63] focus:border-transparent outline-none transition-all"
                                required
                            >
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Age</label>
                            <input
                                type="number"
                                value={formData.age}
                                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E91E63] focus:border-transparent outline-none transition-all"
                                placeholder="e.g. 28"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Location</label>
                            <input
                                type="text"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E91E63] focus:border-transparent outline-none transition-all"
                                placeholder="City, Country"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Profession</label>
                            <input
                                type="text"
                                value={formData.profession}
                                onChange={(e) => setFormData({ ...formData, profession: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E91E63] focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Software Engineer"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Mobile Number</label>
                            <input
                                type="tel"
                                value={formData.mobileNumber}
                                onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E91E63] focus:border-transparent outline-none transition-all"
                                placeholder="e.g. +91 9876543210"
                                required
                            />
                            <div className="flex items-center gap-2 mt-1">
                                <input
                                    type="checkbox"
                                    id="isMobilePublic"
                                    checked={formData.isMobilePublic}
                                    onChange={(e) => setFormData({ ...formData, isMobilePublic: e.target.checked })}
                                    className="w-4 h-4 text-[#E91E63] border-gray-300 rounded focus:ring-[#E91E63]"
                                />
                                <label htmlFor="isMobilePublic" className="text-xs text-gray-500 dark:text-gray-400 select-none cursor-pointer">
                                    Show mobile number on public profile
                                </label>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Profile Photo</label>

                            {previewUrl && (
                                <div className="mb-4 relative w-32 h-32 mx-auto">
                                    <img
                                        src={previewUrl}
                                        alt="Preview"
                                        className="w-full h-full object-cover rounded-full border-4 border-[#E91E63]/20"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setSelectedFile(null);
                                            setPreviewUrl(null);
                                        }}
                                        className="absolute -top-2 -right-2 bg-red-500 text-white p-1 rounded-full hover:bg-red-600 transition-colors"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </div>
                            )}

                            <div className="flex gap-2">
                                <div className="relative flex-1">
                                    <input
                                        type="text"
                                        value={formData.imageUrl}
                                        onChange={(e) => {
                                            setFormData({ ...formData, imageUrl: e.target.value });
                                            setSelectedFile(null);
                                            setPreviewUrl(null);
                                        }}
                                        className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E91E63] focus:border-transparent outline-none transition-all"
                                        placeholder="Enter Image URL or Upload"
                                        disabled={!!selectedFile}
                                    />
                                </div>
                                <div className="relative">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleFileChange}
                                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                    />
                                    <button type="button" className="px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2">
                                        <Upload className="w-5 h-5" />
                                        <span className="hidden sm:inline">Upload</span>
                                    </button>
                                </div>
                            </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">About Yourself</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E91E63] focus:border-transparent outline-none transition-all min-h-[100px]"
                                placeholder="Tell us about your hobbies, interests, and what you're looking for..."
                                required
                            />
                        </div>

                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300">Interests / Tags</label>
                            <input
                                type="text"
                                value={formData.tags}
                                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#E91E63] focus:border-transparent outline-none transition-all"
                                placeholder="e.g. Travel, Music, Cooking (comma separated)"
                                required
                            />
                        </div>
                    </div>

                    <div className="pt-4 flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                            disabled={isUpdating}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2.5 rounded-lg text-sm font-bold text-white bg-[#E91E63] hover:bg-[#D81B60] shadow-lg hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={isUpdating || isUploading}
                        >
                            {isUpdating || isUploading ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    {isUploading ? 'Uploading...' : 'Saving...'}
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default EditProfileDialog;
