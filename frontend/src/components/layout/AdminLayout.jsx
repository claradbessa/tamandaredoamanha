import { Link, Outlet } from 'react-router-dom';

function AdminLayout() {
  
  const styles = {
    display: 'flex',
    height: '100vh',
  };

  const sidebarStyles = {
    width: '250px',
    background: '#f4f4f4',
    padding: '20px',
  };

  const contentStyles = {
    flex: 1,
    padding: '20px',
  };

  return (
    <div style={styles}>
      <aside style={sidebarStyles}>
        <h2>Admin</h2>
        <nav>
          <ul>
            <li><Link to="/dashboard">Início</Link></li>
            <li><Link to="/admin/alunos">Alunos</Link></li>
            <li><Link to="/admin/aulas">Aulas</Link></li>
            <li><Link to="/admin/postagens">Postagens</Link></li>
            <li><Link to="/admin/voluntarios">Voluntários</Link></li>
            {/* No futuro terá mais links aqui */}
          </ul>
        </nav>
      </aside>
      <main style={contentStyles}>
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;