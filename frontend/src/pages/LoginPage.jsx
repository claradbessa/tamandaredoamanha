import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  const auth = useAuth();

  const handleLogin = async (event) => {
    event.preventDefault();
    setError('');

    const loginSuccess = await auth.login({ email, senha });

    if (loginSuccess) {
      // Se o login der certo, navega para a página de dashboard
      navigate('/dashboard'); 
    } else {
      // Se falhar, exibe o erro
      setError('E-mail ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div>
      <h1>Página de Login</h1>
      <form onSubmit={handleLogin}>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="senha">Senha:</label>
          <input
            type="password"
            id="senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            required
          />
        </div>
        
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit">Entrar</button>
      </form>
    </div>
  );
}

export default LoginPage;