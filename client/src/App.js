import { useState, useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import Dashboard from './Dashboard-Updated-WithStationName';

// Helper function to decode JWT token and extract user info
function decodeToken(token) {
  try {
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload;
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
}

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem('token') || '');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      // Decode token to get user info
      const userInfo = decodeToken(token);
      if (userInfo) {
        // Check if token is expired
        const currentTime = Date.now() / 1000;
        if (userInfo.exp && userInfo.exp < currentTime) {
          // Token expired, logout user
          logout();
        } else {
          setUser(userInfo);
        }
      } else {
        // Invalid token, logout user
        logout();
      }
    } else {
      localStorage.removeItem('token');
      setUser(null);
    }
    setLoading(false);
  }, [token]);

  const logout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleLogin = (newToken) => {
    setToken(newToken);
    // Navigate to dashboard after successful login
    navigate('/dashboard');
  };

  // Show loading spinner while checking authentication
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#f0f8ff',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
      }}>
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px'
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '5px solid #e3f2fd',
            borderTop: '5px solid #2196f3',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <p style={{
            color: '#1976d2',
            fontSize: '18px',
            fontWeight: '600'
          }}>Loading TCIL CCTV Portal...</p>
        </div>
        <style>
          {`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          `}
        </style>
      </div>
    );
  }

  // If no token, show login routes
  if (!token || !user) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="*" element={<Navigate replace to="/login" />} />
      </Routes>
    );
  }

  // If authenticated, show dashboard routes
  return (
    <Routes>
      <Route 
        path="/dashboard/*" 
        element={
          <Dashboard 
            token={token} 
            user={user}
            logout={logout} 
          />
        } 
      />
      <Route path="*" element={<Navigate replace to="/dashboard" />} />
    </Routes>
  );
}