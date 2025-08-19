import { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

// 1. Importe o Lightbox e os seus estilos
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import './GaleriaPage.css';

function GaleriaPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // 2. Novo estado para controlar o lightbox
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const { data } = await api.get('/galeria');
        setImages(data);
      } catch (err) {
        setError('Não foi possível carregar as imagens da galeria.');
      } finally {
        setLoading(false);
      }
    };
    fetchImages();
  }, []);

  // 3. Prepara as imagens para o formato que o Lightbox espera
  const slides = images.map(image => ({
    src: image.url,
    title: image.descricao,
  }));

  return (
    <div>
      <Header />
      <main className="galeria-page-container">
        <h2>Galeria de Fotos</h2>
        <p>Explore os momentos e as atividades do nosso projeto.</p>

        {loading && <p>A carregar imagens...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="galeria-grid">
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className="galeria-item"
              // 4. Adiciona o evento de clique para abrir o lightbox
              onClick={() => setLightboxIndex(index)}
            >
              <img src={image.url} alt={image.descricao || 'Foto do projeto'} />
            </div>
          ))}
        </div>
      </main>

      {/* 5. Adiciona o componente Lightbox à página */}
      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
      
      <Footer />
    </div>
  );
}

export default GaleriaPage;