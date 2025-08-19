import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import logo from '../../../public/logo_tamandare.png';

// 1. Importe o arquivo CSS aqui!
import './Footer.css';

function Footer() {
  return (
    // 2. Use className em vez de style
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src={logo} alt="Logo Tamandaré do Amanhã" />
        </div>
        <div className="footer-contact">
          <h2>Fale conosco</h2>
          <p>(12) 4002 8922</p>
          <p>Rua Qualquer, 123, Cidade Qualquer</p>
          <p>tamandare@grandesite.com.br</p>
        </div>
      </div>

      <div className="social-icons">
        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href="https://whatsapp.com" target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </a>
      </div>
      <p className="footer-credits">
        Feito com 💙 por <a href="http://linkedin.com/in/claradbessa" target="_blank">claradbessa</a>
      </p>
      <p className="copyright">
        © {new Date().getFullYear()} Todos os direitos reservados.
      </p>
    </footer>
  );
}

export default Footer;