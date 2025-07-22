import { createContext, useState, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  const login = async ({ email, senha }) => {
    try {
      const response = await api.post('/login', { email, senha });
      const { access_token, user: userData } = response.data;

      // Armazena o token e os dados do usuário no estado
      setToken(access_token);
      setUser(userData);

      // Guarda o token no localStorage para persistir a sessão
      localStorage.setItem('@App:token', access_token);
      localStorage.setItem('@App:user', JSON.stringify(userData));

      // Configura o cabeçalho de autorização para futuras requisições
      api.defaults.headers.Authorization = `Bearer ${access_token}`;

      return true; // Indica que o login foi bem-sucedido
    } catch (error) {
      console.error("Falha no login", error.response?.data?.message);
      return false; // Indica que o login falhou
    }
  };

  const logout = () => {
    // Limpa o estado
    setUser(null);
    setToken(null);

    // Remove os dados do localStorage
    localStorage.removeItem('@App:token');
    localStorage.removeItem('@App:user');

    // Remove o cabeçalho de autorização
    api.defaults.headers.Authorization = null;
  };


  return (
    <AuthContext.Provider value={{ signed: !!user, user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}