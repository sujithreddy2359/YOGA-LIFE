import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(api.getAuthToken());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const storedToken = api.getAuthToken();
      if (storedToken) {
        try {
          const userData = await api.getMe();
          setUser(userData);
        } catch (err) {
          console.error('Failed to load user profile on start:', err);
          api.setAuthToken(null);
          setToken(null);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email, password) => {
    const res = await api.login({ email, password });
    api.setAuthToken(res.access_token);
    setToken(res.access_token);
    const fullUser = await api.getMe();
    setUser(fullUser);
    return fullUser;
  };

  const register = async (data) => {
    const res = await api.register(data);
    api.setAuthToken(res.access_token);
    setToken(res.access_token);
    const fullUser = await api.getMe();
    setUser(fullUser);
    return fullUser;
  };

  const googleLogin = async (googleToken, email, name, avatarUrl) => {
    const res = await api.googleAuth({ token: googleToken, email, name, avatar_url: avatarUrl });
    api.setAuthToken(res.access_token);
    setToken(res.access_token);
    const fullUser = await api.getMe();
    setUser(fullUser);
    return fullUser;
  };

  const verifyPhoneOtp = async (phone, code, fullName) => {
    const res = await api.verifyPhoneOtp(phone, code, fullName);
    api.setAuthToken(res.access_token);
    setToken(res.access_token);
    const fullUser = await api.getMe();
    setUser(fullUser);
    return fullUser;
  };

  const logout = () => {
    api.setAuthToken(null);
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const updated = await api.getMe();
      setUser(updated);
      return updated;
    } catch (err) {
      console.error('Failed to refresh user:', err);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: !!user?.is_admin,
        isLoading,
        login,
        register,
        googleLogin,
        verifyPhoneOtp,
        logout,
        refreshUser,
        setUser
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
