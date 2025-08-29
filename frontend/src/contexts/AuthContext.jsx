import { createContext, useState, useContext, useEffect } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true); 

  useEffect(() => {
    const storedToken = localStorage.getItem('@App:token');
    const storedUser = localStorage.getItem('@App:user');

    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
      
      api.defaults.headers.Authorization = `Bearer ${storedToken}`;
    }

    setLoading(false);
  }, []);

  const login = async ({ email, senha }) => {
    try {
      const response = await api.post('/login', { email, senha });
      const { access_token, user: userData } = response.data;

      setToken(access_token);
      setUser(userData);

      localStorage.setItem('@App:token', access_token);
      localStorage.setItem('@App:user', JSON.stringify(userData));

      api.defaults.headers.Authorization = `Bearer ${access_token}`;

      return true; 
    } catch (error) {
      console.error("Falha no login", error.response?.data?.message);
      return false; 
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);

    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:user');

    api.defaults.headers.Authorization = null;
  };

  return (
    <AuthContext.Provider value={{ signed: !!user, user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }

  return context;
}