import { useState } from 'react'; 
import { NavLink, Outlet } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; 
import './AdminLayout.css';

function AdminLayout() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const toggleSidebar = () => {
      setIsSidebarOpen(!isSidebarOpen);
    };

    // Função para fechar o menu apenas se estiver aberto (para mobile)
    const handleLinkClick = () => {
      if (isSidebarOpen) {
        toggleSidebar();
      }
    };


    return (
      <div className="admin-layout">
        
      <button onClick={toggleSidebar} className="menu-toggle">
        {isSidebarOpen ? <FaTimes /> : <FaBars />}
      </button>

        <aside className={`sidebar ${isSidebarOpen ? 'sidebar-open' : ''}`}>
          <div className="logo-container">
            <img src="/logo_tamandare.png" alt="Logo Projeto Tamandaré do Amanhã" className="logo" />
          </div>
          {/* <h2>Admin</h2> */}
          <nav>
            <ul>
              <li><NavLink to="/dashboard" onClick={handleLinkClick}>Início</NavLink></li>
              <li><NavLink to="/admin/alunos" onClick={handleLinkClick}>Alunos</NavLink></li>
              <li><NavLink to="/admin/aulas" onClick={handleLinkClick}>Aulas</NavLink></li>
              <li><NavLink to="/admin/frequencia" onClick={handleLinkClick}>Relatório de frequência</NavLink></li>
              <li><NavLink to="/admin/postagens" onClick={handleLinkClick}>Postagens</NavLink></li>
              <li><NavLink to="/admin/galeria" onClick={handleLinkClick}>Galeria de imagens</NavLink></li> 
              <li><NavLink to="/admin/voluntarios" onClick={handleLinkClick}>Voluntários</NavLink></li>
            </ul>
          </nav>
        </aside>

        {isSidebarOpen && <div className="overlay" onClick={toggleSidebar}></div>}
        
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    );
}

export default AdminLayout;