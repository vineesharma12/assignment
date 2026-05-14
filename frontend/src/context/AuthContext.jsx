import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user') || 'null'));
  const [token, setToken] = useState(() => localStorage.getItem('token'));
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const loadMe = async () => {
      if (!token) {
        setBooting(false);
        return;
      }
      try {
        const { data } = await api.get('/auth/me');
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
      } catch {
        setToken(null);
        setUser(null);
        localStorage.clear();
      } finally {
        setBooting(false);
      }
    };
    loadMe();
  }, [token]);

  const signin = async (endpoint, payload) => {
    const { data } = await api.post(endpoint, payload);
    setUser(data.user);
    setToken(data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    localStorage.setItem('token', data.token);
    return data.user;
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const value = useMemo(
    () => ({
      user,
      token,
      booting,
      isAdmin: user?.role === 'Admin',
      login: (payload) => signin('/auth/login', payload),
      register: (payload) => signin('/auth/register', payload),
      setUser,
      logout
    }),
    [user, token, booting]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
