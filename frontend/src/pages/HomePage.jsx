import Header from '../components/layout/Header'; 
import Footer from '../components/layout/Footer'; 
import HeroSection from '../components/home/HeroSection'; 

function HomePage() {
  return (
    <div>
      <Header />
      <HeroSection />
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