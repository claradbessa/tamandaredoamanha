import './MediaSection.css';
import { FaComments  } from 'react-icons/fa';
import midiaImage from '../../assets/tamandare-do-amanha-na-midia.jpg';

function MediaSection() {
  return (
    <div className="about-section-container">
      <div className="about-content">
        <h2>Na mídia <FaComments  size={40} /></h2>
        <p>
          Nossa voz chegou mais longe!
        </p>
        <p>
          Tivemos a honra de participar de uma entrevista para a TV Aparecida,
          onde pudemos contar a nossa história, os desafios que enfrentamos e a
          força do nosso projeto: Tamandaré do Amanhã.
        </p>
        <p>
          Assista à entrevista completa e venha conhecer de perto o nosso projeto.
        </p>
        <a href="#" className="cta-button">
          Assista agora
        </a>
      </div>

      <div className="about-image">
        <img src={midiaImage} alt="Tamandaré do Amanhã na Mídia" />
      </div>
    </div>
  );
}

export default MediaSection;