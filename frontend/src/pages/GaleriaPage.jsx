import { Helmet } from 'react-helmet-async';
import { useState, useEffect } from 'react';
import api from '../services/api';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';

import Lightbox from "yet-another-react-lightbox";
import { FaSearchPlus } from 'react-icons/fa'; 
import "yet-another-react-lightbox/styles.css";

import './GaleriaPage.css';

function GaleriaPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const slides = images.map(image => ({
    src: image.caminho,
    title: image.descricao,
  }));

  return (
    <div>
      <Helmet>
        <title>Galeria de Fotos | Projeto Tamandaré do Amanhã</title>
        <meta 
          name="description" 
          content="Explore a galeria de fotos do Projeto Tamandaré do Amanhã e veja os momentos marcantes de nossas atividades com as crianças e voluntários."
        />

        <meta property="og:title" content="Galeria de Fotos | Projeto Tamandaré do Amanhã" />
          
        <meta property="og:description" content="Explore a galeria de fotos do Projeto Tamandaré do Amanhã e veja os momentos marcantes de nossas atividades com as crianças e voluntários." />
          
        <meta property="og:image" content="https://www.tamandaredoamanha.com.br/og-image-tamandare-do-amanha.png" />
          
        <meta property="og:url" content="https://www.tamandaredoamanha.com.br/galeria" />
          
        <meta property="og:type" content="website" />
      </Helmet>

      <main className="galeria-page-container">
        <h2>Galeria de Fotos</h2>
        <p>Explore os momentos e as atividades do nosso projeto.</p>

        {loading && <p>Carregando imagens...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <div className="galeria-grid">
          {images.map((image, index) => (
            <div 
              key={image.id} 
              className="galeria-item"
              onClick={() => setLightboxIndex(index)}
            >
              <img src={image.caminho} alt={image.descricao || 'Foto do projeto'} />
              
              <div className="zoom-icon">
                <FaSearchPlus />
              </div>
            </div>
          ))}
        </div>
      </main>

      <Lightbox
        open={lightboxIndex >= 0}
        index={lightboxIndex}
        close={() => setLightboxIndex(-1)}
        slides={slides}
      />
      
    </div>
  );
}

export default GaleriaPage;