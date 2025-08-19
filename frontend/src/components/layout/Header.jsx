import { Link } from 'react-router-dom';
import logo from '/logo_tamandare.png'; 

function Header() {
  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '10px 40px',
    backgroundColor: 'var(--cor-branco)',
    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
  };

  const logoStyle = {
    height: '60px',
  };

  const navStyle = {
    display: 'flex',
    gap: '20px',
  };

  const navLinkStyle = {
    color: 'var(--cor-texto)',
    fontWeight: '500',
    fontSize: '1rem',
  };
  

  return (
    <header style={headerStyle}>
      <Link to="/">
        <img src={logo} alt="Logo Tamandaré do Amanhã" style={logoStyle} />
      </Link>
      <nav style={navStyle}>
        <Link to="/" style={navLinkStyle}>Início</Link>
        <Link to="/sobre" style={navLinkStyle}>Sobre o Projeto</Link>
        <Link to="/galeria" style={navLinkStyle}>Galeria</Link>
        <Link to="/contato" style={navLinkStyle}>Posts</Link>
        <Link to="/contato" style={navLinkStyle}>Contato</Link>
      </nav>
    </header>
  );
}

export default Header;