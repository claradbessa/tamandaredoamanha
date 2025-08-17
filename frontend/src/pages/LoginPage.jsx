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
      navigate('/dashboard'); 
    } else {
      setError('E-mail ou senha inválidos. Tente novamente.');
    }
  };

  return (
    <div className="login-page-wrapper ">
      <div className="login-container ">
        <img src="/logo_tamandare.png" alt="Logo Projeto Tamandaré do Amanhã" className="logo" />
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="email" className="sr-only">Email:</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Digite seu e-mail"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="senha" className="sr-only">Senha:</label>
            <input
              type="password"
              id="senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              placeholder="Digite sua senha"
              required
            />
          </div>
          
          {error && <p className="alert alert-danger">{error}</p>}
          
          <button type="submit" className="btn btn-primary">Entrar</button>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;