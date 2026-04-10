import { createContext, useState } from 'react';
import { jwtDecode } from 'jwt-decode';

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Notice there is NO useEffect here! Just useState.
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return { id: decoded.id, role: decoded.role };
      } catch {
        console.error("Invalid token");
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });

  const login = (token, role) => {
    localStorage.setItem('token', token);
    const decoded = jwtDecode(token);
    setUser({ id: decoded.id, role: role });
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};