import Header from '../components/layout/Header'; 
import Footer from '../components/layout/Footer'; 
import HeroSection from '../components/home/HeroSection'; 
import AboutSection from '../components/home/AboutSection';
import PillarsSection from '../components/home/PillarsSection';
import GallerySection from '../components/home/GallerySection';

function HomePage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <AboutSection />
      <PillarsSection />
      <GallerySection />
      
      {/* Aqui virão as outras secções */}
      <Footer />
    </div>
  );
}

export default HomePage;