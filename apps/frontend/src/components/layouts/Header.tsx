import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../auth/components/AuthContext';

const Header: React.FC = () => {
  const { auth, setAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    // Reset the auth state to logged out.
    setAuth({
      isAuthenticated: false,
      user: {
        email: "",
        name: "",
      },
    });
    // Optionally remove the token if stored
    localStorage.removeItem("access_token");
    navigate('/');
  };

  return (
    <header
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '1rem',
        borderBottom: '1px solid #ccc',
      }} className="bg-gray-900 text-white p-4 text-xl font-bold"
    >
      <h1 style={{ cursor: 'pointer' }} onClick={() => navigate('/')}>
        Tender Disovery Platform
      </h1>
      <nav style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>

        {auth.isAuthenticated ? (
          <>
            <span>Welcome, {auth.user.name || auth.user.email}</span>
            <button onClick={handleLogout} style={{ padding: '0.5rem 1rem' }}>
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => navigate('/login')}
            style={{ padding: '0.5rem 1rem' }}
          >
            Signin/Signup
          </button>
        )}
      </nav>
    </header>
  );
};

export default Header;
