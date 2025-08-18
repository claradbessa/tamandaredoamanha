import Header from '../components/layout/Header'; 
import Footer from '../components/layout/Footer'; 
import HeroSection from '../components/home/HeroSection'; 
import AboutSection from '../components/home/AboutSection';
import PillarsSection from '../components/home/PillarsSection';
import ClassroomSection from '../components/home/ClassroomSection';

function HomePage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <AboutSection />
      <PillarsSection />
      <ClassroomSection />
      
      {/* Aqui virão as outras secções */}
      <Footer />
    </div>
  );
}

export default HomePage;