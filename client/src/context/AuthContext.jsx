import { createContext, useContext, useState } from 'react';
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
    try {
      const storedUser = localStorage.getItem('user');
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  const login = async (email, password) => {
    const data = await apiLogin(email, password);
    const { token, user: userPayload } = data;
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(userPayload));
    setUser(userPayload);
    return userPayload;
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: Boolean(user), isAdmin: Boolean(user?.role === 'admin'), login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}