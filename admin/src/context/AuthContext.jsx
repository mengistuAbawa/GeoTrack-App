import React, { createContext, useContext, useState, useEffect } from 'react';
import { getToken, setToken, getStoredAdmin, setStoredAdmin, clearAuth, api } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setTokenState] = useState(() => getToken());
  const [admin, setAdminState] = useState(() => getStoredAdmin());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if token exists and verify validity
    const storedToken = getToken();
    const storedUser = getStoredAdmin();

    if (storedToken && storedUser) {
      setTokenState(storedToken);
      setAdminState(storedUser);
    } else {
      clearAuth();
      setTokenState(null);
      setAdminState(null);
    }
    setLoading(false);

    const handleUnauthorized = () => {
      clearAuth();
      setTokenState(null);
      setAdminState(null);
    };

    window.addEventListener('geotrack:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('geotrack:unauthorized', handleUnauthorized);
  }, []);

  const login = async (email, password) => {
    const data = await api.login(email, password);
    if (data.token && data.admin) {
      setToken(data.token);
      setStoredAdmin(data.admin);
      setTokenState(data.token);
      setAdminState(data.admin);
      return data.admin;
    }
    throw new Error('Invalid login response from server');
  };

  const logout = () => {
    clearAuth();
    setTokenState(null);
    setAdminState(null);
  };

  const value = {
    isAuthenticated: Boolean(token && admin),
    admin,
    token,
    loading,
    login,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
