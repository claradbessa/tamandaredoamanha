import { Link } from 'react-router-dom';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './HeroSection.css';

import slide1 from '../../assets/slide-1.png';
import slide2 from '../../assets/slide-2.png';

function HeroSection() {
  const slides = [
    {
      image: slide1,
    //   title: 'Transformando vidas',
    //   subtitle: 'Uma criança de cada vez.',
    },
    {
      image: slide2,
    //   title: 'Um lugar para crescer, aprender e sonhar.',
    //   subtitle: 'Oferecemos um ambiente acolhedor com atividades que estimulam o desenvolvimento integral de nossas crianças e adolescentes.',
    },
  ];

  return (
    <div className="hero-swiper-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={index}>
            <div
              className="hero-slide"
              style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${slide.image})` }}
            >
              <div className="hero-content">
                <h1>{slide.title}</h1>
                <p>{slide.subtitle}</p>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HeroSection;