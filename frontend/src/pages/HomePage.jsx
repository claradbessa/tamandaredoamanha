import { Helmet } from 'react-helmet-async';
import Header from '../components/layout/Header'; 
import Footer from '../components/layout/Footer'; 
import HeroSection from '../components/home/HeroSection'; 
import AboutSection from '../components/home/AboutSection';
import PillarsSection from '../components/home/PillarsSection';
import ClassroomSection from '../components/home/ClassroomSection';
import CardSection from '../components/home/CardSection';
import MediaSection from '../components/home/MediaSection';

function HomePage() {
  return (
    <div>
      <Helmet>
        <title>Projeto Tamandaré do Amanhã | Início</title>
        <meta 
          name="description" 
          content="Conheça o Projeto Tamandaré do Amanhã, uma iniciativa social em Guaratinguetá-SP que oferece educação, esporte e cultura para crianças e adolescentes." 
        />
          <meta property="og:title" content="Projeto Tamandaré do Amanhã | Guaratinguetá-SP" />
          
          <meta property="og:description" content="Uma iniciativa social que oferece educação, esporte e cultura para crianças e adolescentes." />
          
          <meta property="og:image" content="https://www.tamandaredoamanha.com.br/og-image-tamandare-do-amanha.png" />
          
          <meta property="og:url" content="https://www.tamandaredoamanha.com.br/" />
          
          <meta property="og:type" content="website" />
      </Helmet>

      <Header />
      <HeroSection />
      <AboutSection />
      <MediaSection />
      <PillarsSection />
      <ClassroomSection />
      <CardSection />
      
      {/* Aqui virão as outras secções */}
      <Footer />
    </div>
  );
}

export default HomePage;