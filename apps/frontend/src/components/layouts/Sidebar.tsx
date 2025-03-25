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
      path: '/lg', // Kept for reference, but not used in navigation here
      subItems: [
        { title: 'Tender Search', path: '/lg/search-tender' },
        { title: 'AI Tender Search', path: '/lg/ai-search-tender' },
        { title: 'Tender Data', path: 'lg/tenderdata' },
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
                    onClick={() => toggleDropdown(module.key!)} // Only toggle dropdown, no navigation
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
                    Profile Setting
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
              className="bg-white p-5 rounded shadow-lg text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-xl font-bold mb-3">Profile Picture</h3>
              <img
                src={profilePicture || defaultAvatar}
                alt="Profile Preview"
                className="w-32 h-32 rounded-full mx-auto border border-gray-300 object-cover"
              />
              <div className="mt-4 space-y-2">
                <button
                  onClick={triggerFileInput}
                  className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600"
                >
                  Change Profile Picture
                </button>
                <button
                  onClick={removeProfilePicture}
                  className="w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
                >
                  Remove Picture
                </button>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="w-full bg-gray-500 text-white py-2 rounded hover:bg-gray-600"
                >
                  Close
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