import { useState } from 'react'; 
import { NavLink, Outlet } from 'react-router-dom';
import { FaBars, FaTimes } from 'react-icons/fa'; 

function AdminLayout() {
  // Cria um estado para controlar se o menu está aberto ou fechado
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Função para alternar o estado do menu
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
              <li><NavLink to="/dashboard" onClick={toggleSidebar}>Início</NavLink></li>
              <li><NavLink to="/admin/alunos" onClick={toggleSidebar}>Alunos</NavLink></li>
              <li><NavLink to="/admin/aulas" onClick={toggleSidebar}>Aulas</NavLink></li>
              <li><NavLink to="/admin/frequencia" onClick={toggleSidebar}>Relatório de frequência</NavLink></li>
              <li><NavLink to="/admin/postagens" onClick={toggleSidebar}>Postagens</NavLink></li>
              <li><NavLink to="/admin/galeria" onClick={toggleSidebar}>Galeria de imagens</NavLink></li> 
              <li><NavLink to="/admin/voluntarios" onClick={toggleSidebar}>Voluntários</NavLink></li>
            </ul>
          </nav>
        </aside>

        {/* 6. Adiciona o overlay que fecha o menu ao ser clicado */}
        <div className="overlay" onClick={toggleSidebar}></div>
        
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    );
}

export default AdminLayout;