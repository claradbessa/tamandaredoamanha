import { Link } from 'react-router-dom';
import './CardSection.css';

function CardSection() {
  const whatsappNumber = '5512996051909';
  const whatsappLink = `https://wa.me/${whatsappNumber}`;

  return (
    <div className="cta-container">
      <div className="cta-card voluntariado">
        <h2>VOLUNTARIADO</h2>
        <p>Quer fazer parte da nossa missão? Embarque com a gente e ajude a transformar vidas.</p>
        <a 
          href={whatsappLink} 
          className="cta-button"
          target="_blank" 
          rel="noopener noreferrer"
        >
          Faça parte
        </a>
      </div>
      <div className="cta-card doe">
        <h2>DOE</h2>
        <p>Sua doação faz a diferença.<br/> Participe da nossa missão e multiplique sorrisos.</p>
        <a to="/contato" className="cta-button">
          Quero Doar
        </a>
      </div>
    </div>
  );
}

export default CardSection;