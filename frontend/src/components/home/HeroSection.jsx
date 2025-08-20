import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import './HeroSection.css';

import slide1Desktop from '../../assets/slide-1.png';
import slide1Mobile from '../../assets/slide-1-mob.jpg';
import slide2Desktop from '../../assets/slide-2.png';
import slide2Mobile from '../../assets/slide-2-mob.jpg';

function HeroSection() {
  const slides = [
    {
      imageDesktop: slide1Desktop,
      imageMobile: slide1Mobile,
      // title: 'Um Lugar Para Crescer, Aprender e Sonhar',
      // subtitle: 'Oferecemos um ambiente seguro e estimulante onde crianças e adolescentes desenvolvem seu potencial máximo.',
    },
    {
      imageDesktop: slide2Desktop,
      imageMobile: slide2Mobile,
      // title: 'Transformando Vidas',
      // subtitle: 'Uma criança de cada vez, com educação, esporte e cultura.',
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
              className="hero-slide desktop-image"
              style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.imageDesktop})` }}
            >
            </div>
            <div
              className="hero-slide mobile-image"
              style={{ backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.4), rgba(0, 0, 0, 0.4)), url(${slide.imageMobile})` }}
            >
            </div>
            
            <div className="hero-content">
              <h1>{slide.title}</h1>
              <p>{slide.subtitle}</p>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}

export default HeroSection;