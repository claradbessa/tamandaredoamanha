import './AboutSection.css';
import midiaImage from '../../assets/tamandare-do-amanha-na-midia.jpg'; 

function AboutSection() {
  return (
    <div className="about-section-container">
      <div className="about-content">
        <h2>Sobre o Projeto</h2>
        <p>
          O Projeto Tamandaré do Amanhã é uma organização não governamental sem fins lucrativos
          que se dedica a oferecer um futuro mais brilhante para crianças e adolescentes
          em situação de vulnerabilidade. Através de atividades de educação, esporte,
          cultura e lazer, criamos um ambiente seguro e estimulante para o desenvolvimento
          integral de cada um.
        </p>
        <p>
          Acreditamos no poder da comunidade e no potencial de cada criança. Junte-se a nós
          e ajude a construir um amanhã com mais oportunidades.
        </p>
      </div>
      <div className="about-image">
        <img src={midiaImage} alt="Tamandaré do Amanhã na Midia" />
      </div>
    </div>
  );
}

export default AboutSection;