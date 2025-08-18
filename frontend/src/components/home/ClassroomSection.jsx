import './ClassroomSection.css';
import imagemIngles from '../../assets/aula-ingles.jpg';
import imagemGinastica from '../../assets/aula-ginastica.jpg';
import imagemJiuJitsu from '../../assets/aula-jiujitsu.jpg';

function ClassroomSection() {
  const aulas = [
    {
      imagem: imagemIngles,
      titulo: 'Aulas de Inglês',
    },
    {
      imagem: imagemGinastica,
      titulo: 'Aulas de Ginástica',
    },
    {
      imagem: imagemJiuJitsu,
      titulo: 'Aulas de Jiu Jitsu',
    },
  ];

  return (
    <div className="aulas-ofertadas-container">
      <h2>Aulas Ofertadas</h2>
      <div className="aulas-ofertadas-grid">
        {aulas.map((aula, index) => (
          <div key={index} className="aula-card">
            <img src={aula.imagem} alt={aula.titulo} />
            <p>{aula.titulo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ClassroomSection;