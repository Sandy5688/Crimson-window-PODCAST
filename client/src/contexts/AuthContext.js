import React, { createContext, useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api'; // Relative from contexts/ to utils/

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // Verify token with backend (interceptor auto-adds Authorization header)
      verifyUser();
    }
    setLoading(false);
  }, []);

  const verifyUser = async () => {
    try {
      const response = await api.get('/auth/me');
      setUser(response.data); // Assumes { id, email, name }
    } catch (error) {
      localStorage.removeItem('authToken');
      setUser(null);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('authToken', token);
      // Verify and set user (interceptor handles token)
      await verifyUser();
      navigate('/dashboard');
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      // Optional: Call backend /auth/logout if needed (cleans sessions)
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout API failed:', error); // Non-blocking
    }
    localStorage.removeItem('authToken');
    setUser(null);
    navigate('/login');
  };

  const value = {
    user,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
