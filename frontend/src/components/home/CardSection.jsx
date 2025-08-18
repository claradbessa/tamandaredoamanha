import { Link } from 'react-router-dom';
import './CardSection.css';

function CardSection() {
  return (
    <div className="cta-container">
      <div className="cta-card voluntariado">
        <h2>VOLUNTARIADO</h2>
        <p>Quer fazer parte da nossa missão? Embarque com a gente e ajude a transformar vidas.</p>
        <Link to="/contato" className="cta-button">
          Faça parte
        </Link>
      </div>
      <div className="cta-card doe">
        <h2>Doe</h2>
        <p>Sua doação faz a diferença.<br/> Participe da nossa missão e multiplique sorrisos.</p>
        <Link to="/contato" className="cta-button">
          Obrigada!
        </Link>
      </div>
    </div>
  );
}

export default CardSection;