import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

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
      
      <Swiper
        modules={[Navigation, Pagination]}
        spaceBetween={30} 
        slidesPerView={1} 
        navigation 
        pagination={{ clickable: true }} 
        loop={true}
        breakpoints={{
          640: {
            slidesPerView: 2,
            spaceBetween: 20,
          },
          1024: {
            slidesPerView: 3,
            spaceBetween: 30,
          },
        }}
        className="aulas-swiper" 
      >
        {aulas.map((aula, index) => (
          <SwiperSlide key={index}>
            <div className="aula-card">
              <img src={aula.imagem} alt={aula.titulo} />
              <p>{aula.titulo}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default ClassroomSection;