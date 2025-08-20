import { Link } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaWhatsapp } from 'react-icons/fa';
import './Footer.css';

function Footer() {
  const whatsappNumber = '5512996051909'; 
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-logo">
          <img src="/logo_tamandare.png" alt="Logo Tamandaré do Amanhã" />
        </div>
        <div className="footer-contact">
          <h2>Fale conosco</h2>
          <p>(12) 99605-1909</p>
          <p>R. Barão da Bocaína, 131</p>
          <p>Centro - Guaratinguetá - SP</p>
        </div>
      </div>

      <div className="social-icons">
        <a href="https://www.facebook.com/fabiana.andrade.50552" target="_blank" rel="noopener noreferrer">
          <FaFacebook />
        </a>
        <a href="https://www.instagram.com/tmdoamanha/" target="_blank" rel="noopener noreferrer">
          <FaInstagram />
        </a>
        <a href={whatsappLink} target="_blank" rel="noopener noreferrer">
          <FaWhatsapp />
        </a>
      </div>
      <p className="footer-credits">
        Feito com 💙 por <a href="https://claradbessa.vercel.app/" target="_blank" rel="noopener noreferrer">claradbessa</a>
      </p>
      <p className="copyright">
        © {new Date().getFullYear()} Todos os direitos reservados.
      </p>
    </footer>
  );
}

export default Footer;