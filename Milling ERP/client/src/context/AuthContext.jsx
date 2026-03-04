/* eslint-disable react-refresh/only-export-components */
import React, {
  createContext,
  useContext,
  useState,
} from 'react';
import { login as apiLogin } from '../services/api.js';

const AuthContext = createContext({
  user: null,
  isAuthenticated: false,
  isAdmin: false,
  login: async () => {},
  logout: () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null;
    try {
      const storedUser = window.localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    const { token, user: userPayload } = data;

    if (typeof window !== 'undefined') {
      window.localStorage.setItem('token', token);
      window.localStorage.setItem('user', JSON.stringify(userPayload));
    }

    setUser(userPayload);
    return userPayload;
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem('token');
      window.localStorage.removeItem('user');
    }
    setUser(null);
  };

  const isAuthenticated = Boolean(user);
  const isAdmin = Boolean(user && user.role === 'admin');

  const value = {
    user,
    isAuthenticated,
    isAdmin,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return ctx;
}
