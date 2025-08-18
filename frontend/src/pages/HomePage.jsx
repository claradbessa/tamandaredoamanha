import Header from '../components/layout/Header'; 
import Footer from '../components/layout/Footer'; 
import HeroSection from '../components/home/HeroSection'; 
import AboutSection from '../components/home/AboutSection';
import PillarsSection from '../components/home/PillarsSection';

function HomePage() {
  return (
    <div>
      <Header />
      <HeroSection />
      <AboutSection />
      <PillarsSection />
      <main>
        <h1 style={{ textAlign: 'center', padding: '50px' }}>
          Página Inicial em Construção
        </h1>
      </main>
      <Footer />
    </div>
  );
}

export default HomePage;