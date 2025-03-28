import { useState, useRef } from 'react';
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

  // Handle dropdown toggle
  const toggleDropdown = (key: string) => {
    setIsDropdownOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Handle profile picture upload
  const handleProfilePictureUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setProfilePicture(reader.result as string);
    reader.readAsDataURL(file);
  };

  // Handle phone number change
  const [phoneNumber, setPhoneNumber] = useState("");
  const [phoneNumberInput, setPhoneNumberInput] = useState("");
  
  const handlePhoneNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPhoneNumberInput(e.target.value);
  };

  // Handle location change
  const [location, setLocation] = useState("");
  const [locationInput, setLocationInput] = useState("");

  const handleLocationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLocationInput(e.target.value);
  };

  // Handle bio change
  const [userBio, setUserBio] = useState("");
  const [userBioInput, setUserBioInput] = useState("");

  const handleUserBioInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserBioInput(e.target.value);
  };

  // Handle Full Name Change
  const [userFname, setUserFname] = useState("");
  const [userFnameInput, setUserFnameInput] = useState("");

  const handleUserFnameInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserFnameInput(e.target.value);
  };

  // Handle Email Notification Changes
  const [isEmailChecked, setEmailChecked] = useState(false);
  const [emailCheckboxState, setEmailCheckboxState] = useState(false);

  const handleEmailCheckboxState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmailChecked(e.target.checked);
  };

  // Handle Push Notification Changes
  const [isPushChecked, setPushChecked] = useState(false);
  const [pushCheckboxState, setPushCheckboxState] = useState(false);

  const handlePushCheckboxState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPushChecked(e.target.checked);
  };

  // Handle SMS Notification Changes
  const [isSmsChecked, setSmsChecked] = useState(false);
  const [smsCheckboxState, setSmsCheckboxState] = useState(false);

  const handleSmsCheckboxState = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSmsChecked(e.target.checked);
  };

  // Handle saved changes
  const handleSavedChanges = () => {
    if(userFnameInput !== userFname){
      setUserFname(userFnameInput);
      alert("Full name saved: " + userFnameInput);
    }
    if(phoneNumberInput !== phoneNumber){
      setPhoneNumber(phoneNumberInput);
      alert("Phone number saved: " + phoneNumberInput);
    }
    if(locationInput !== location){
      setLocation(locationInput);
      alert("Location saved: " + locationInput);
    }
    if(userBioInput !== userBio){
      setUserBio(userBioInput);
      alert("User Bio saved: " + userBioInput);
    }
    if(emailCheckboxState !== isEmailChecked){
      setEmailCheckboxState(isEmailChecked);
      alert("Email notifications set to: " + isEmailChecked);
    }
    if(pushCheckboxState !== isPushChecked){
      setPushCheckboxState(isPushChecked);
      alert("Push notifications set to: " + isPushChecked);
    }
    if(smsCheckboxState !== isSmsChecked){
      setSmsCheckboxState(isSmsChecked);
      alert("Push notifications set to: " + isSmsChecked);
    }
  };

  // Handle Cancel changes
  const handleCancelChanges = () => {
    setUserFname(userFname);
    setPhoneNumber(phoneNumber);
    setLocation(location); 
    setUserBio(userBio);    
    setEmailChecked(emailCheckboxState);
    setPushChecked(pushCheckboxState);
    setSmsChecked(smsCheckboxState);

    setUserFnameInput(userFname); 
    setPhoneNumberInput(phoneNumber); 
    setLocationInput(location);
    setUserBioInput(userBio); 
    alert("Changes have been canceled");
  };
  

  // Handle logout
  const handleLogout = () => {
    setAuth({ isAuthenticated: false, user: { email: '', name: '' } });
    localStorage.removeItem('access_token');
    navigate('/');
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

        {/* Hidden file input */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          className="hidden"
          onChange={handleProfilePictureUpload}
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
                      padding: '0.5rem 0',
                      width: '100%',
                      borderRadius: '0.25rem',
                    }}
                    className="hover:opacity-90 transition-opacity" 
                  >
                    Change Picture
                  </button>
                  <button
                    onClick={removeProfilePicture}
                    style={{ 
                      backgroundColor: 'rgb(219, 94, 75)',
                      color: 'white',
                      padding: '0.5rem 0',
                      width: '100%',
                      borderRadius: '0.25rem',
                    }}
                    className="border border-gray-300 rounded-md font-medium hover:bg-gray-50 transition-colors"
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
                    />
                  </div>
                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Full Name</label>
                  <input
                    type="text"
                    defaultValue={userFname || auth.user.name}
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
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    defaultValue={phoneNumber}
                    onChange={handlePhoneNumberInputChange}
                    placeholder="Add phone number"
                    className="w-full border rounded p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Location</label>
                  <input
                    type="text"
                    defaultValue={location}
                    onChange={handleLocationInputChange}
                    placeholder="City, Country"
                    className="w-full border rounded p-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">Bio</label>
                  <textarea
                    className="w-full border rounded p-2"
                    rows={3}
                    defaultValue={userBio}
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
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Current Password</label>
                      <input
                        type="password"
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">New Password</label>
                      <input
                        type="password"
                        className="w-full border rounded p-2"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-600 mb-1">Confirm Password</label>
                      
                      <input
                        type="password"
                        className="w-full border rounded p-2"
                      />
                    </div>
                  </div>
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
                type="submit"
                style={{ 
                  backgroundColor: 'rgb(55, 50, 146)',
                  color: 'white',
                }}
                onClick={handleSavedChanges}
                className="px-4 py-2 text-white rounded-md text-sm font-medium hover:opacity-90 transition-opacity"
              > 
                Save Changes
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