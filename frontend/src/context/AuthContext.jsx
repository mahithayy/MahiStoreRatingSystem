import { createContext, useState } from 'react';
import api from '../services/api';
//import { jwtDecode } from 'jwt-decode';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Notice there is NO useEffect here! Just useState.
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('userState');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const login = (userData) => {
    localStorage.setItem('userState', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = async () => {
    try {
      await api.post('/auth/logout'); // Tell backend to destroy the cookie
    } catch (err) {
      console.error("Logout failed", err);
    } finally {
      localStorage.removeItem('userState');
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};