import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../../services/authService';
import { storageService } from '../../services/storageService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(storageService.getUser());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = storageService.getAccessToken();
      if (token) {
        try {
          const currentUser = await authService.getCurrentUser();
          setUser(currentUser);
        } catch (error) {
          console.error('Session expired or invalid token:', error);
          storageService.clearAuth();
          setUser(null);
        }
      }
      setLoading(false);
    };
    initAuth();
  }, []);

  const login = async (credentials, password) => {
    const payload = typeof credentials === 'string'
      ? { username: credentials, password }
      : credentials;
    const loggedUser = await authService.login(payload);
    setUser(loggedUser);
    return loggedUser;
  };

  const loginInit = async (credentials) => {
    return await authService.loginInit(credentials);
  };

  const verifyOTP = async ({ session_token, otp }) => {
    const loggedUser = await authService.verifyOTP({ session_token, otp });
    setUser(loggedUser);
    return loggedUser;
  };

  const register = async (data) => {
    const res = await authService.register(data);
    if (res?.user) {
      setUser(res.user);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, loginInit, verifyOTP, register, logout, loading }}>
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

export default AuthContext;
