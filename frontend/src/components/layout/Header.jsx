import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '/logo_tamandare_site.png'; 
import './Header.css'; 
import { FaBars, FaTimes } from 'react-icons/fa'; 

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="main-header">
      <Link to="/" onClick={handleLinkClick}>
        <img src={logo} alt="Logo Tamandaré do Amanhã" className="logo" />
      </Link>
      
      {/*Navegação muda de classe quando o menu está aberto */}
      <nav className={`main-nav ${isMenuOpen ? 'active' : ''}`}>
        <NavLink  to="/" onClick={handleLinkClick}>Início</NavLink >
        <NavLink  to="/galeria" onClick={handleLinkClick}>Galeria</NavLink >
        <NavLink  to="/blog" onClick={handleLinkClick}>Blog</NavLink >
        <NavLink  to="/contato" onClick={handleLinkClick}>Contato</NavLink >
      </nav>

      {/* Botão "hambúrguer" que aparece no mobile */}
      <button className="menu-toggle-site" onClick={() => setIsMenuOpen(!isMenuOpen)}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </button>
    </header>
  );
}

export default Header;