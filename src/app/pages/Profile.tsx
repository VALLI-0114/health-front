import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  User,
  Heart,
  MapPin,
  Phone,
  GraduationCap,
  Activity,
  Save,
  Loader2,
  AlertCircle,
  CheckCircle,
  Calendar,
  Camera,
  X,
  Edit2,
  XCircle,
  ArrowLeft,
  Lock,
} from 'lucide-react';

const Profile = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState({
    name: '',
    age: '',
    height: '',
    weight: '',
    college: '',
    district: '',
    phone: '',
  });
  const [profilePhoto, setProfilePhoto] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [ageLocked, setAgeLocked] = useState(false);
  const [nameLocked, setNameLocked] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadProfile = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No token found');
        navigate('/login');
        return;
      }

      // ✅ STEP 1: Get user data (name, age) from auth endpoint
      const authResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/auth/profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (authResponse.status === 401) {
        console.error('Unauthorized - redirecting to login');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      let userName = '';
      let userAge = '';

      if (authResponse.ok) {
        const authData = await authResponse.json();
        console.log('📥 Auth data received:', authData);
        
        // Extract user info from auth response
        const userInfo = authData.user || authData;
        userName = userInfo.full_name || userInfo.name || '';
        userAge = userInfo.age ? String(userInfo.age) : '';
        
        console.log('👤 User from auth:', { name: userName, age: userAge });
      }

      // ✅ STEP 2: Get profile data (height, weight, etc.) from profile endpoint
      const profileResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!profileResponse.ok) {
        let errorMessage = 'Failed to load profile';
        try {
          const errorData = await profileResponse.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${profileResponse.status})`;
        }
        throw new Error(errorMessage);
      }

      const profileData = await profileResponse.json();
      console.log('📥 Profile data received:', profileData);

      // ✅ STEP 3: Merge auth data with profile data
      // Priority: profile data > auth data (in case user updated profile)
      const finalName = profileData.name || userName;
      const finalAge = profileData.age ? String(profileData.age) : userAge;

      console.log('✅ Final merged data:', { name: finalName, age: finalAge });

      setProfile({
        name: finalName,
        age: finalAge,
        height: profileData.height || '',
        weight: profileData.weight || '',
        college: profileData.college || '',
        district: profileData.district || '',
        phone: profileData.phone || '',
      });

      // Set profile photo
      if (profileData.profile_photo) {
        setProfilePhoto(`${import.meta.env.VITE_API_BASE_URL.replace('/api','')}/static/${profileData.profile_photo}`);
      }

      // ✅ Lock name if it exists
      if (finalName && finalName.trim() !== '') {
        console.log('🔒 Locking name - already set');
        setNameLocked(true);
      }

      // ✅ Lock age if it exists  
      if (finalAge && parseInt(finalAge) > 0) {
        console.log('🔒 Locking age - already set');
        setAgeLocked(true);
      }

    } catch (err) {
      console.error('Failed to load profile:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const uploadPhoto = async () => {
    if (!photoFile) return;

    try {
      setUploadingPhoto(true);
      const token = localStorage.getItem('token');

      const formData = new FormData();
      formData.append('profile_photo', photoFile);

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/profile/upload-photo`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const data = await response.json();
      if (data.profile_photo) {
        setProfilePhoto(`${import.meta.env.VITE_API_BASE_URL.replace('/api','')}/static/${data.profile_photo}`);
      }
      setPhotoFile(null);
    } catch (err) {
      console.error('Error uploading photo:', err);
      throw err;
    } finally {
      setUploadingPhoto(false);
    }
  };

  const handleSubmit = async () => {
    try {
      setSaving(true);
      setError(null);
      setSuccess(false);

      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      // Validate name and age are provided if not locked
      if (!nameLocked && (!profile.name || profile.name.trim() === '')) {
        setError('Please enter your name');
        setSaving(false);
        return;
      }

      if (!ageLocked && (!profile.age || parseInt(profile.age) <= 0)) {
        setError('Please enter a valid age');
        setSaving(false);
        return;
      }

      // Upload photo if selected
      if (photoFile) {
        await uploadPhoto();
      }

      console.log('📤 Sending profile data:', profile);

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(profile),
      });

      if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/login');
        return;
      }

      if (!response.ok) {
        let errorMessage = 'Failed to update profile';
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          errorMessage = `Server error (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('📥 Profile update response:', data);

      // Update profile with response data
      setProfile({
        name: data.name || profile.name,
        age: data.age ? String(data.age) : profile.age,
        height: data.height || profile.height,
        weight: data.weight || profile.weight,
        college: data.college || profile.college,
        district: data.district || profile.district,
        phone: data.phone || profile.phone,
      });

      // ✅ LOCK NAME after first submission
      if (profile.name && profile.name.trim() !== '' && !nameLocked) {
        console.log('🔒 Locking name after first submission');
        setNameLocked(true);
      }

      // ✅ LOCK AGE after first submission
      if (profile.age && parseInt(profile.age) > 0 && !ageLocked) {
        console.log('🔒 Locking age after first submission');
        setAgeLocked(true);
      }

      setSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      console.error('Error updating profile:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const validTypes = [
        'image/png',
        'image/jpg',
        'image/jpeg',
        'image/gif',
        'image/webp',
      ];
      if (!validTypes.includes(file.type)) {
        setError(
          'Please select a valid image file (PNG, JPG, JPEG, GIF, or WEBP)'
        );
        return;
      }

      if (file.size > 2 * 1024 * 1024) {
        setError('File size must be less than 2MB');
        return;
      }

      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/profile/photo`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        setProfilePhoto(null);
        setPhotoFile(null);
        setSuccess(true);
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Error deleting photo:', err);
      setError('Failed to delete photo');
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f3ff] flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-16 h-16 border-4 border-purple-100 border-t-purple-600 rounded-full animate-spin"></div>
            <Heart className="w-6 h-6 text-purple-600 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
          </div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading your profile...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f3ff] py-6 px-4 sm:py-8">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fade-in {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>

      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 font-medium transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Health Profile</h1>
          <p className="text-gray-600 mt-1">Manage your personal health information</p>
        </div>

        {/* Alerts */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-red-900">Error</p>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
              <button
                onClick={() => setError(null)}
                className="text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {success && (
          <div className="mb-6 bg-green-50 border border-green-200 rounded-lg p-4 animate-fade-in">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <p className="text-sm font-medium text-green-900">
                Profile updated successfully!
              </p>
            </div>
          </div>
        )}

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN - Profile Photo */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="text-center">
                {/* Avatar */}
                <div className="relative inline-block mb-6">
                  <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center border-4 border-white shadow-lg">
                    {profilePhoto ? (
                      <img
                        src={profilePhoto}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-20 h-20 text-gray-400" />
                    )}
                  </div>
                  {profilePhoto && (
                    <button
                      onClick={handleDeletePhoto}
                      className="absolute top-0 right-0 bg-white rounded-full p-1.5 shadow-md border border-gray-200 hover:bg-red-50 hover:border-red-300 transition-colors group"
                      title="Remove photo"
                    >
                      <X className="w-4 h-4 text-gray-600 group-hover:text-red-600" />
                    </button>
                  )}
                </div>

                {/* Photo Actions */}
                <div className="space-y-3">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                    onChange={handlePhotoSelect}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploadingPhoto}
                    className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2.5 rounded-lg font-medium hover:shadow-md transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {uploadingPhoto ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Camera className="w-4 h-4" />
                        {profilePhoto ? 'Change Photo' : 'Upload Photo'}
                      </>
                    )}
                  </button>
                  <p className="text-xs text-gray-500">
                    PNG, JPG, GIF, WEBP up to 2MB
                  </p>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-6"></div>

              {/* Info Card */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4">
                <div className="flex gap-3">
                  <div className="flex-shrink-0">
                    <Heart className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">
                      Your Health Matters
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Keep your profile updated for personalized health insights. Name and age are locked after first submission for data consistency.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Personal Information Form */}
          <div className="lg:col-span-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sm:p-8">
              {/* Form Header */}
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray-900">
                  Personal Information
                </h2>
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-lg font-medium hover:shadow-md transition-all text-sm"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      loadProfile();
                    }}
                    className="inline-flex items-center gap-2 bg-gray-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-600 transition-all text-sm"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </button>
                )}
              </div>

              {/* Form Grid */}
              <div className="space-y-6">
                {/* Row 1: Name & Age */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Name Field */}
                  <div>
                    <label
                      htmlFor="name"
                      className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                      <User className="w-4 h-4 mr-1.5 text-purple-600" />
                      Name
                      {nameLocked && (
                        <Lock className="w-3.5 h-3.5 ml-1.5 text-gray-400" />
                      )}
                    </label>
                    <input
                      id="name"
                      type="text"
                      name="name"
                      value={profile.name}
                      onChange={handleChange}
                      placeholder="Enter your name"
                      disabled={nameLocked || !isEditing}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-all text-sm ${
                        nameLocked || !isEditing
                          ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-500"
                          : "bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      }`}
                    />
                    {nameLocked && (
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked after first submission
                      </p>
                    )}
                  </div>

                  {/* Age Field */}
                  <div>
                    <label
                      htmlFor="age"
                      className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                      <Calendar className="w-4 h-4 mr-1.5 text-purple-600" />
                      Age
                      {ageLocked && (
                        <Lock className="w-3.5 h-3.5 ml-1.5 text-gray-400" />
                      )}
                    </label>
                    <input
                      id="age"
                      type="number"
                      name="age"
                      value={profile.age}
                      onChange={handleChange}
                      placeholder="Enter your age"
                      disabled={ageLocked || !isEditing}
                      className={`w-full px-4 py-2.5 rounded-lg border transition-all text-sm ${
                        ageLocked || !isEditing
                          ? "bg-gray-50 border-gray-200 cursor-not-allowed text-gray-500"
                          : "bg-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      }`}
                    />
                    {ageLocked && (
                      <p className="text-xs text-gray-500 mt-1.5 flex items-center">
                        <Lock className="w-3 h-3 mr-1" />
                        Locked after first submission
                      </p>
                    )}
                  </div>
                </div>

                {/* Row 2: Height & Weight */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* Height Field */}
                  <div>
                    <label
                      htmlFor="height"
                      className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                      <Activity className="w-4 h-4 mr-1.5 text-purple-600" />
                      Height (cm)
                    </label>
                    <input
                      id="height"
                      type="text"
                      name="height"
                      value={profile.height}
                      onChange={handleChange}
                      placeholder="Enter height"
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-all text-sm bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500"
                    />
                  </div>

                  {/* Weight Field */}
                  <div>
                    <label
                      htmlFor="weight"
                      className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                      <Heart className="w-4 h-4 mr-1.5 text-pink-600" />
                      Weight (kg)
                    </label>
                    <input
                      id="weight"
                      type="text"
                      name="weight"
                      value={profile.weight}
                      onChange={handleChange}
                      placeholder="Enter weight"
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-all text-sm bg-white focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500"
                    />
                  </div>
                </div>

                {/* Row 3: College & District */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {/* College Field */}
                  <div>
                    <label
                      htmlFor="college"
                      className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                      <GraduationCap className="w-4 h-4 mr-1.5 text-blue-600" />
                      College
                    </label>
                    <input
                      id="college"
                      type="text"
                      name="college"
                      value={profile.college}
                      onChange={handleChange}
                      placeholder="Enter college name"
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-all text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500"
                    />
                  </div>

                  {/* District Field */}
                  <div>
                    <label
                      htmlFor="district"
                      className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                    >
                      <MapPin className="w-4 h-4 mr-1.5 text-green-600" />
                      District
                    </label>
                    <input
                      id="district"
                      type="text"
                      name="district"
                      value={profile.district}
                      onChange={handleChange}
                      placeholder="Enter district"
                      disabled={!isEditing}
                      className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-all text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500"
                    />
                  </div>
                </div>

                {/* Row 4: Phone Number (Full Width) */}
                <div>
                  <label
                    htmlFor="phone"
                    className="flex items-center text-sm font-semibold text-gray-700 mb-2"
                  >
                    <Phone className="w-4 h-4 mr-1.5 text-indigo-600" />
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    disabled={!isEditing}
                    className="w-full px-4 py-2.5 rounded-lg border border-gray-300 transition-all text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed disabled:text-gray-500"
                  />
                </div>

                {/* Save Button */}
                {isEditing && (
                  <div className="pt-4 border-t border-gray-200">
                    <button
                      onClick={handleSubmit}
                      disabled={saving}
                      className="w-full sm:w-auto min-w-[200px] inline-flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          Saving Changes...
                        </>
                      ) : (
                        <>
                          <Save className="w-5 h-5" />
                          Save Profile
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
