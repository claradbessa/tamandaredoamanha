import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function DashboardPage() {
  const auth = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    auth.logout();
    navigate('/login');
  };

  return (
    <div>
      <h1>Dashboard Administrativo</h1>
      {auth.user ? (
        <p>Bem-vindo(a), {auth.user.nome}!</p>
      ) : (
        <p>A carregar...</p>
      )}
      <button onClick={handleLogout}>Sair (Logout)</button>
    </div>
  );
}

export default DashboardPage;