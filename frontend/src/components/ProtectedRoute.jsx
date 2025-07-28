import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function ProtectedRoute() {
  const auth = useAuth();

  // Se o utilizador não estiver logado, redireciona para a página de login
  if (!auth.signed) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza a página solicitada
  return <Outlet />;
}

export default ProtectedRoute;