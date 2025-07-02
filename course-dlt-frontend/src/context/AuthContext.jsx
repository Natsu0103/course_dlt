import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    const checkAuth = async () => {
      setLoading(true);
      setAuthError('');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        try {
          const res = await axios.get('/api/auth/me');
          setUser(res.data);
        } catch (err) {
          setUser(null);
          setAuthError('Session expired. Please log in again.');
          localStorage.removeItem('token');
          setToken(null);
        }
      } else {
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
      }
      setLoading(false);
    };
    checkAuth();
    // eslint-disable-next-line
  }, [token]);

  const login = async (username, password) => {
    const res = await axios.post('/api/auth/login', { username, password });
    localStorage.setItem('token', res.data.token);
    setToken(res.data.token);
  };

  const register = async (username, password, is_admin = false) => {
    await axios.post('/api/auth/register', { username, password, is_admin });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading, authError }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
} 