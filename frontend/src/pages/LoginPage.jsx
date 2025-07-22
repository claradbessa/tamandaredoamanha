import { useState } from 'react';
import api from '../services/api';

function LoginPage() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault(); // Impede o recarregamento padrão da página
    setError(''); // Limpa erros anteriores

    try {
      const response = await api.post('/login', {
        email: email,
        senha: senha,
      });

      // Se o login for bem-sucedido, a API retornará os dados
      console.log('Login bem-sucedido:', response.data);
      
      const { access_token } = response.data;
      
      // Aqui, futuramente, será salvo o token e os dados do usuário
      alert(`Login realizado com sucesso! Token: ${access_token}`);

    } catch (err) {
      // Se a API retornar um erro (ex: 401 Credenciais inválidas)
      console.error('Erro no login:', err.response?.data?.message || 'Erro desconhecido');
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