import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../auth/components/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../../assets/wouessi-new-logo.png';
import defaultAvatar from '../../assets/default-avatar.jpg';

const Sidebar = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState<{ [key: string]: boolean }>({
    leadGeneration: false,
    tenderManagement: false,
    userMenu: false,
  });
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  

  // Add spinner styles to document head
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      .loader {
        border: 2px solid #f3f3f3;
        border-top: 2px solid #3498db;
        border-radius: 50%;
        width: 16px;
        height: 16px;
        animation: spin 1s linear infinite;
        display: inline-block;
        vertical-align: middle;
        margin-right: 8px;
      }
    `;
    document.head.appendChild(style);
  
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  // Fetch profile data when modal opens
  useEffect(() => {
    if (isModalOpen) {
      fetchProfileData();
    }
  }, [isModalOpen]);

  const fetchProfileData = async () => {
    setIsFetching(true);
    try {
      // Simulate API call to fetch profile data
      // Replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Set initial values for form fields
      setUserFname(auth.user.name || '');
      setUserFnameInput(auth.user.name || '');
      setPhoneNumber('');
      setPhoneNumberInput('');
      setLocation('');
      setLocationInput('');
      setUserBio('');
      setUserBioInput('');
      setEmailChecked(false);
      setEmailCheckboxState(false);
      setPushChecked(false);
      setPushCheckboxState(false);
      setSmsChecked(false);
      setSmsCheckboxState(false);
    } catch (error) {
      console.error('Failed to fetch profile data:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // Handle dropdown toggle
  const toggleDropdown = (key: string) => {
    setIsDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Password state and handlers
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Input Validation state and handlers
  const [errors, setErrors] = useState<{
    fullName?: string;
    phone?: string;
    location?: string;
    bio?: string;
  }>({});
  

  const validatePassword = (password: string) => {
    const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
    return passRegex.test(password);
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!newPassword || !confirmPassword || !currentPassword) {
      setErrorMessage('All fields are required.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMessage('New password and confirmation do not match.');
      return;
    }

    if (!validatePassword(newPassword)) {
      setErrorMessage(
        'Password must be at least 8 characters long, contain one uppercase letter, one number, and one special character.'
      );
      return;
    }

    try {
      const response = await fetch("http://localhost:3000/api/v1/auth/change-password", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('access_token')}`,
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword: confirmPassword }),
      });
    
      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.error || "An unknown error occurred.");
      }
      
      setSuccessMessage('Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      console.error("Error Details:", error);
      if (error instanceof Error) {
        setErrorMessage(error.message || 'An unknown error occurred.');
      } else {
        setErrorMessage('An error occurred while changing the password.');
      }
    }
  };

  // Handle profile picture upload with validation
  const handleProfilePictureUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setUploadError(null);

    if (!file) return;

    const validTypes = ['image/jpeg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      setUploadError('Only JPEG or PNG images are allowed');
      return;
    }

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      setUploadError('Image must be smaller than 2MB');
      return;
    }

    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async () => {
      try {
        setProfilePicture(reader.result as string);
      } catch (err) {
        setUploadError('Failed to upload image');
      } finally {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setUploadError('Failed to read image');
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  // Form state
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");
  const [userBio, setUserBio] = useState("");
  const [userBioInput, setUserBioInput] = useState("");
  const [userFname, setUserFname] = useState("");
  const [userFnameInput, setUserFnameInput] = useState("");
  const [isEmailChecked, setEmailChecked] = useState(false);
  const [emailCheckboxState, setEmailCheckboxState] = useState(false);
  const [isPushChecked, setPushChecked] = useState(false);
  const [pushCheckboxState, setPushCheckboxState] = useState(false);
  const [isSmsChecked, setSmsChecked] = useState(false);
  const [smsCheckboxState, setSmsCheckboxState] = useState(false);

  // Input handlers
  const handlePhoneNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumberInput(e.target.value);
  };

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
  };

  const handleUserBioInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserBioInput(e.target.value);
  };

  const handleUserFnameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFnameInput(e.target.value);
  };

  const handleEmailCheckboxState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailChecked(e.target.checked);
  };

  const handlePushCheckboxState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPushChecked(e.target.checked);
  };

  const handleSmsCheckboxState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmsChecked(e.target.checked);
  };

  // Handle saved changes
  const handleSavedChanges = async () => {
    if (!validateForm()) return; 
    setIsSaving(true);
    try {
      // Simulate API call to save changes
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update state with new values
      if (userFnameInput !== userFname) {
        setUserFname(userFnameInput);
      }
      if (phoneNumberInput !== phoneNumber) {
        setPhoneNumber(phoneNumberInput);
      }
      if (locationInput !== location) {
        setLocation(locationInput);
      }
      if (userBioInput !== userBio) {
        setUserBio(userBioInput);
      }
      if (emailCheckboxState !== isEmailChecked) {
        setEmailCheckboxState(isEmailChecked);
      }
      if (pushCheckboxState !== isPushChecked) {
        setPushCheckboxState(isPushChecked);
      }
      if (smsCheckboxState !== isSmsChecked) {
        setSmsCheckboxState(isSmsChecked);
      }

      alert("All changes saved successfully!");
    } catch (error) {
      console.error("Failed to save changes:", error);
      alert("Failed to save changes. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Handle cancel changes
  const handleCancelChanges = () => {
    setUserFnameInput(userFname);
    setPhoneNumberInput(phoneNumber);
    setLocationInput(location);
    setUserBioInput(userBio);
    setEmailChecked(emailCheckboxState);
    setPushChecked(pushCheckboxState);
    setSmsChecked(smsCheckboxState);
  };

  // Handle logout
  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: { email: '', name: '' } });
    localStorage.removeItem('access_token');
    navigate('/');
  };

  // Validate user input fields, required
  const validateForm = () => {
    const newErrors: typeof errors = {};
    let isValid = true;
  
    if (!userFnameInput.trim()) {
      newErrors.fullName = "Required";
      isValid = false;
    }
    if (!phoneNumberInput.trim()) {
      newErrors.phone = "Required";
      isValid = false;
    } else if (!/^\d{3}-\d{3}-\d{4}$/.test(phoneNumberInput)) {
      newErrors.phone = "Use XXX-XXX-XXXX format";
      isValid = false;
    }
    if (!locationInput.trim()) {
      newErrors.location = "Required";
      isValid = false;
    }
  
    setErrors(newErrors);
    return isValid;
  };

  // Profile picture actions
  const triggerFileInput = () => fileInputRef.current?.click();
  const removeProfilePicture = () => setProfilePicture(null);

  // Navigation Modules
  const navModules = [
    {
      title: 'Lead Generation',
      key: 'leadGeneration',
      path: '/lg',
      subItems: [
        { title: 'Tender Search', path: '/lg/search-tender' },
        { title: 'AI Tender Search', path: '/lg/ai-search-tender' },
        { title: 'Tender Data', path: '/lg/tenderdata' },
      ],
    },
    {
      title: 'Capability Assessment',
      path: '/ca/camain',
    },
    {
      title: 'Benchmarking',
      path: '/bm/bmmain',
    },
    {
      title: 'Tender Management',
      key: 'tenderManagement',
      path: '/tm',
      subItems: [
        { title: 'My Bids', path: '/tm/my_bids' },
        { title: 'My Tenders', path: '/tm/my_tenders' },
      ],
    },
    {
      title: 'Knowledge Base',
      path: '/kb/kbmain',
    },
  ];

  return (
    <nav className="w-64 bg-gray-800 text-white p-8 space-y-4 h-screen flex flex-col">
      {/* Logo */}
      <img
        src={logo}
        alt="Wouessi Logo"
        className="w-34 h-auto p-3 cursor-pointer"
        onClick={() => navigate('/')}
      />
      <div className="w-full h-0.5 bg-gradient-to-r from-gray-700 via-gray-500 to-gray-700" />

      {/* Navigation */}
      <div className="flex-1">
        <ul className="space-y-3">
          {navModules.map((module) => (
            <li key={module.title}>
              {module.subItems ? (
                <>
                  <button
                    onClick={() => toggleDropdown(module.key!)} 
                    className="w-full text-left p-3 bg-gray-700 rounded flex justify-between"
                  >
                    {module.title}
                    <span>{isDropdownOpen[module.key!] ? '▲' : '▼'}</span>
                  </button>
                  {isDropdownOpen[module.key!] && (
                    <ul className="ml-4 mt-2 bg-gray-700 rounded">
                      {module.subItems.map((subItem) => (
                        <li key={subItem.title}>
                          <Link
                            to={subItem.path}
                            className="block p-3 hover:bg-gray-600 rounded"
                          >
                            {subItem.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </>
              ) : (
                <Link
                  to={module.path!}
                  className="block p-3 nav-bg-color rounded"
                >
                  {module.title}
                </Link>
              )}
            </li>
          ))}
        </ul>
      </div>

      {/* User Section */}
      <div className="p-4">
        {auth.isAuthenticated ? (
          <div className="relative">
            <button
              onClick={() => toggleDropdown('userMenu')}
              className="flex items-center w-full p-3 bg-gray-700 rounded"
            >
              <img
                src={profilePicture || defaultAvatar}
                alt="User Profile"
                className="w-10 h-10 rounded-full border-2 border-white object-cover mr-2"
              />
              <span>{auth.user.name || auth.user.email}</span>
              <span className="ml-auto">{isDropdownOpen.userMenu ? '▲' : '▼'}</span>
            </button>
            {isDropdownOpen.userMenu && (
              <ul className="absolute bottom-full left-0 w-full bg-gray-700 rounded shadow-lg mb-2">
                <li>
                  <button
                    onClick={() => setIsModalOpen(true)}
                    className="block w-full text-left p-3 hover:bg-gray-600"
                  >
                    Profile Settings
                  </button>
                </li>
                <li>
                  <Link
                    to="/settings"
                    className="block p-3 hover:bg-gray-600"
                  >
                    App Settings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left p-3 hover:bg-red-600 text-white"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          <button
            onClick={() => navigate('/login')}
            className="w-full p-3 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Login
          </button>
        )}

        {/* Hidden file input with validation */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/jpeg, image/png, image/webp"
          className="hidden"
          onChange={handleProfilePictureUpload}
          disabled={isUploading}
        />

        {/* Profile Picture Modal */}
        {isModalOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
            onClick={() => setIsModalOpen(false)}
          >
            <div
              className="bg-white p-6 rounded shadow-lg text-black flex flex-col"
              style={{
                width: '60vw',
                height: '90vh',
                maxWidth: '900px',
                maxHeight: '800px',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4 border-b pb-4">
                <h2 className="text-2xl font-bold">Profile Settings</h2>
                <button 
                  onClick={() => setIsModalOpen(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              {/* Content Area */}
              {isFetching ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="loader"></div>
                  <span className="ml-2">Loading profile...</span>
                </div>
              ) : (
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Left Column - Profile Picture */}
                  <div className="flex flex-col items-center space-y-4">
                    <img
                      src={profilePicture || defaultAvatar}
                      alt="Profile Preview"
                      className="w-40 h-40 rounded-full border-2 border-gray-300 object-cover"
                    />
                    <div className="space-y-2 w-full">
                      <button
                        onClick={triggerFileInput}
                        style={{ 
                          backgroundColor: 'rgb(55, 50, 146)',
                          color: 'white',
                        }}
                        className="w-full py-2 rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                        disabled={isUploading}
                      >
                        {isUploading ? 'Uploading...' : 'Change Picture'}
                      </button>
                      
                      {uploadError && (
                        <p className="text-sm text-red-600">{uploadError}</p>
                      )}

                      <button
                        onClick={removeProfilePicture}
                        style={{ 
                          backgroundColor: 'rgb(219, 94, 75)',
                          color: 'white',
                        }}
                        className="w-full py-2 rounded hover:opacity-90 transition-opacity mt-2"
                      >
                        Remove Picture
                      </button>
                    </div>
                  </div>

                  {/* Middle Column - User Info */}
                  <div className="space-y-4">
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Username</label>
                      <input
                        type="text"
                        defaultValue={auth.user.name}
                        className="w-full border rounded p-2"
                        disabled
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Full Name</label>
                      <input
                        type="text"
                        value={userFnameInput}
                        onChange={handleUserFnameInputChange}
                        className="w-full border rounded p-2"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        defaultValue={auth.user.email}
                        className="w-full border rounded p-2"
                        disabled
                      />
                    </div>
                    
                    <div className="space-y-1">
                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                    <input
                      type="tel"
                      value={phoneNumberInput}
                      onChange={(e) => {
                        // Auto-format as XXX-XXX-XXXX
                        const value = e.target.value.replace(/\D/g, '');
                        let formattedValue = '';
                        
                        if (value.length > 0) formattedValue = value.substring(0, 3);
                        if (value.length > 3) formattedValue += '-' + value.substring(3, 6);
                        if (value.length > 6) formattedValue += '-' + value.substring(6, 10);
                        
                        setPhoneNumberInput(formattedValue);
                        if (errors.phone) setErrors({...errors, phone: undefined});
                      }}
                      className={`w-full border rounded p-2 ${
                        errors.phone ? "border-red-500" : ""
                      }`}
                      placeholder="XXX-XXX-XXXX"
                      maxLength={12} // 3-3-4 Format for Phone Number
                    />
                    {errors.phone && (
                      <p className="text-red-500 text-xs mt-1">{errors.phone}</p>
                    )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Location</label>
                      <input
                        type="text"
                        value={locationInput}
                        onChange={handleLocationInputChange}
                        className={`w-full border rounded p-2 ${
                          errors.location ? "border-red-500" : ""
                        }`}
                        placeholder="Country"
                        />
                        {errors.location && (
                          <p className="text-red-500 text-xs mt-1">{errors.location}</p>
                        )}
                    </div>

                    <div className="space-y-1">
                      <label className="block text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        className="w-full border rounded p-2"
                        rows={3}
                        value={userBioInput}
                        placeholder="Tell us about yourself..."
                        onChange={handleUserBioInputChange}
                      />
                    </div>
                  </div>

                  {/* Right Column - Security & Notifications */}
                  <div className="space-y-6">
                    {/* Change Password Section */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Change Password</h3>
                      <form onSubmit={handlePasswordChange}>
                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                            <input
                              type="password"
                              value={currentPassword}
                              className="w-full border rounded p-2"
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">New Password</label>
                            <input
                              type="password"
                              value={newPassword}
                              className="w-full border rounded p-2"
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
                            <input
                              type="password"
                              value={confirmPassword}
                              className="w-full border rounded p-2"
                              onChange={(e) => setConfirmPassword(e.target.value)}
                              required
                            />
                          </div>
                          {errorMessage && <div style={{ color: 'red' }}>{errorMessage}</div>}
                          {successMessage && <div style={{ color: 'green' }}>{successMessage}</div>}
                          <button
                            type="submit"
                            style={{
                              backgroundColor: 'rgb(55, 50, 146)',
                              color: 'white',
                            }}
                            className="px-4 py-2 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
                          >
                            Change Password
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Notification Preferences Section */}
                    <div className="border rounded-lg p-4">
                      <h3 className="font-medium mb-3">Notification Preferences</h3>
                      <div className="space-y-2">
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name='email'
                            checked={isEmailChecked}
                            onChange={handleEmailCheckboxState}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm">Email Notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name='push'
                            checked={isPushChecked}
                            onChange={handlePushCheckboxState}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm">Push Notifications</span>
                        </label>
                        <label className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            name='sms'
                            checked={isSmsChecked}
                            onChange={handleSmsCheckboxState}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <span className="text-sm">SMS Notifications</span>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bottom Action Buttons */}
              <div className="mt-6 pt-4 border-t flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={() => {
                    setIsModalOpen(false);
                    handleCancelChanges();
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  style={{ 
                    backgroundColor: 'rgb(55, 50, 146)',
                    color: 'white',
                  }}
                  onClick={handleSavedChanges}
                  disabled={isSaving}
                  className="px-4 py-2 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity flex items-center justify-center"
                >
                  {isSaving ? (
                    <>
                      <div className="loader"></div>
                      <span className="ml-2">Saving changes...</span>
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Sidebar;