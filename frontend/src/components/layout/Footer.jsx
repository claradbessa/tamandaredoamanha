import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';

function Footer() {
  // Estilos inline para simplicidade
  const footerStyle = {
    backgroundColor: '#005f9e',
    color: '#ffffff',
    padding: '40px 20px',
    textAlign: 'center',
  };

  const socialIconsStyle = {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginBottom: '20px',
  };

  const iconStyle = {
    color: '#ffffff',
    fontSize: '1.5rem',
  };

  const copyrightStyle = {
    fontSize: '0.9rem',
    opacity: 0.7,
  };

  return (
    <footer style={footerStyle}>
      <div style={socialIconsStyle}>
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook style={iconStyle} />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram style={iconStyle} />
        </a>
        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp style={iconStyle} />
        </a>
      </div>
      <p>Projeto Tamandaré do Amanhã</p>
      <p>Feito com 💙 por <a href="http://linkedin.com/in/claradbessa" target="_blank">claradbessa</a></p>
      <p style={copyrightStyle}>
        © {new Date().getFullYear()} Todos os direitos reservados.
      </p>
    </footer>
  );
}

export default Footer;