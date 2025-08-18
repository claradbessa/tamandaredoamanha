import { FaBookOpen, FaSmile, FaHeart } from 'react-icons/fa';
import './PillarsSection.css';

function PillarsSection() {
  const pillars = [
    {
      icon: <FaBookOpen size={40} />,
      title: 'Educação',
      description: 'Oferecemos aulas e atividades que incentivam o aprendizado e o desenvolvimento intelectual das nossas crianças.',
    },
    {
      icon: <FaSmile size={40} />,
      title: 'Lazer',
      description: 'Proporcionamos um ambiente seguro para brincadeiras, esportes e atividades culturais que estimulam a criatividade e a socialização.',
    },
    {
      icon: <FaHeart size={40} />,
      title: 'Assistência',
      description: 'Damos suporte às famílias da comunidade através de orientações e acolhimento, fortalecendo os laços comunitários.',
    },
  ];

  return (
    <div className="pillars-container">
      <h2>O Projeto</h2>
      <div className="pillars-grid">
        {pillars.map((pillar, index) => (
          <div key={index} className="pillar-card">
            <div className="pillar-icon">{pillar.icon}</div>
            <h3>{pillar.title}</h3>
            <p>{pillar.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PillarsSection;