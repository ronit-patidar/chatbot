import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/api';
import { connectSocket, disconnectSocket } from '../services/socket';
import { toast } from 'react-toastify';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);

  // Verify auth on mount
  useEffect(() => {
    const verifyAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (storedToken) {
        try {
          const res = await api.get('/api/auth/profile');
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification error:', err?.response?.data?.message || err.message);
          // If unauthorized, clean up
          if (err?.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setToken(null);
            disconnectSocket();
          }
        }
      }
      setLoading(false);
    };

    verifyAuth();
  }, []);

  // When user is authenticated, ensure socket is ready
  useEffect(() => {
    if (user && token) {
      connectSocket();
    } else {
      disconnectSocket();
    }
  }, [user, token]);

  const login = async (email, password) => {
    try {
      const res = await api.post('/api/auth/login', { email, password });
      const { user: userData, token: userToken } = res.data;

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      if (userToken) {
        setToken(userToken);
        localStorage.setItem('token', userToken);
      } else {
        // Fallback for cookie only
        setToken('cookie-session');
        localStorage.setItem('token', 'cookie-session');
      }

      toast.success(res.data.message || 'Logged in successfully!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to login';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const register = async ({ firstName, lastName, email, password }) => {
    try {
      const res = await api.post('/api/auth/register', {
        fullName: { firstName, lastName },
        email,
        password,
      });
      const { user: userData, token: userToken } = res.data;

      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      if (userToken) {
        setToken(userToken);
        localStorage.setItem('token', userToken);
      } else {
        setToken('cookie-session');
        localStorage.setItem('token', 'cookie-session');
      }

      toast.success(res.data.message || 'Registration successful!');
      return { success: true };
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Failed to register';
      toast.error(msg);
      return { success: false, error: msg };
    }
  };

  const logout = async () => {
    try {
      await api.get('/api/auth/logout');
    } catch (err) {
      console.warn('Logout API error:', err);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      disconnectSocket();
      toast.info('Logged out successfully');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
